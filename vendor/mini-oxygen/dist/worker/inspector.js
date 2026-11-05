import { dirname } from "node:path";
import { readFile } from "node:fs/promises";
import { fetch } from "miniflare";
import { SourceMapConsumer } from "source-map";
import { WebSocket } from "ws";
import { addInspectorConsoleLogger, formatStack } from "./logger.js";
import { createInspectorProxy } from "./devtools.js";
function createInspectorConnector(options) {
  let inspectorUrl;
  let inspectorConnection;
  let inspectorProxy;
  return {
    async close() {
      inspectorConnection?.close();
      await inspectorProxy?.close();
      inspectorConnection = void 0;
      inspectorProxy = void 0;
    },
    async reconnect(onBeforeConnect) {
      inspectorConnection?.close();
      inspectorUrl ??= await findInspectorUrl(
        options.privateInspectorPort,
        options.workerName
      );
      await onBeforeConnect?.();
      inspectorConnection = connectToInspector({
        inspectorUrl,
        sourceMapPath: options.sourceMapPath
      });
      addInspectorConsoleLogger(inspectorConnection);
      if (options.publicInspectorPort) {
        if (inspectorProxy) {
          inspectorProxy.updateInspectorConnection(inspectorConnection);
        } else {
          inspectorProxy = createInspectorProxy(
            options.publicInspectorPort,
            inspectorConnection
          );
          await inspectorProxy.ready;
        }
      }
    }
  };
}
async function findInspectorUrl(inspectorPort, workerName) {
  try {
    const jsonUrl = `http://127.0.0.1:${inspectorPort}/json`;
    const body = await (await fetch(jsonUrl)).json();
    const url = body?.find(
      ({ id }) => id === `core:user:${workerName}`
    )?.webSocketDebuggerUrl;
    if (!url) {
      throw new Error("Unable to find inspector URL");
    }
    return url;
  } catch (error) {
    const message = "Unable to connect to Worker inspector. Please report this issue.";
    if (!error || !error.message) {
      error = new Error(message);
    } else {
      error.message = message + "\n" + error.message;
    }
    throw error;
  }
}
function connectToInspector({ inspectorUrl, sourceMapPath }) {
  const messageCounterRef = { value: -1 };
  const getMessageId = () => messageCounterRef.value--;
  const pendingMessages = /* @__PURE__ */ new Map();
  const ws = new WebSocket(inspectorUrl);
  let keepAliveInterval;
  const isClosed = () => ws.readyState === WebSocket.CLOSED || ws.readyState === WebSocket.CLOSING;
  const send = (method, params) => {
    if (!isClosed()) {
      const id = getMessageId();
      let promiseResolve = void 0;
      const promise = new Promise(
        (resolve) => promiseResolve = resolve
      );
      pendingMessages.set(id, promiseResolve);
      ws.send(JSON.stringify({ id, method, params }));
      return promise;
    }
    return Promise.resolve(void 0);
  };
  const cleanupMessageQueue = (data) => {
    try {
      if (data?.id < 0) {
        const resolve = pendingMessages.get(data.id);
        if (resolve !== void 0) {
          pendingMessages.delete(data.id);
          resolve(data.result);
        }
        return true;
      }
    } catch (error) {
      console.error(error);
    }
    return false;
  };
  function getPropertyValue(name, response) {
    return response?.result.find((prop) => prop.name === name)?.value;
  }
  async function reconstructError(initialProperties, ro) {
    let errorProperties = { ...initialProperties };
    const objectId = ro?.objectId;
    if (objectId) {
      const [sourceMapConsumer, getPropertiesResponse] = await Promise.all([
        getSourceMapConsumer(),
        send("Runtime.getProperties", {
          objectId,
          ownProperties: false,
          accessorPropertiesOnly: false,
          generatePreview: false,
          nonIndexedPropertiesOnly: false
        })
      ]);
      const message = getPropertyValue("message", getPropertiesResponse);
      if (message?.value) {
        errorProperties.message = message.value;
      }
      const stack = getPropertyValue("stack", getPropertiesResponse);
      if (stack?.value) {
        errorProperties.stack = sourceMapConsumer ? formatStack(sourceMapConsumer, stack.value) : stack.value;
      }
      const cause = getPropertyValue("cause", getPropertiesResponse);
      if (cause) {
        errorProperties.cause = cause.description ?? cause.value;
        if (cause.subtype === "error" && sourceMapConsumer && cause.description !== void 0) {
          errorProperties.stack = formatStack(
            sourceMapConsumer,
            cause.description
          );
        }
      }
      const isDomException = ro?.className === "DOMException";
      if (isDomException) {
        const stackDescriptor = getPropertiesResponse?.result.find(
          (prop) => prop.name === "stack"
        );
        const getObjectId = stackDescriptor?.get?.objectId;
        if (getObjectId !== void 0) {
          const callFunctionResponse = await send("Runtime.callFunctionOn", {
            objectId,
            functionDeclaration: "function invokeGetter(getter) { return Reflect.apply(getter, this, []); }",
            arguments: [{ objectId: getObjectId }],
            silent: true
          });
          if (callFunctionResponse !== void 0) {
            const stack2 = callFunctionResponse.result.value;
            if (typeof stack2 === "string" && sourceMapConsumer !== void 0) {
              errorProperties.stack = formatStack(sourceMapConsumer, stack2);
            } else {
              try {
                errorProperties.stack = JSON.stringify(stack2);
              } catch {
              }
            }
          }
        }
      }
    }
    const error = new Error(errorProperties.message);
    error.stack = errorProperties.stack;
    if (errorProperties.cause) {
      error.cause = errorProperties.cause;
    }
    return error;
  }
  const sourceMapAbortController = new AbortController();
  let sourceMapConsumerPromise;
  const getSourceMapConsumer = () => {
    return sourceMapConsumerPromise ??= (async () => {
      if (!sourceMapPath || sourceMapAbortController.signal.aborted) {
        return;
      }
      try {
        const mapContent = await readFile(sourceMapPath, "utf-8");
        if (sourceMapAbortController.signal.aborted) return;
        const map = JSON.parse(mapContent);
        map.sourceRoot = dirname(sourceMapPath);
        const sourceMapConsumer = await new SourceMapConsumer(map);
        if (sourceMapAbortController.signal.aborted) {
          sourceMapConsumer.destroy();
          return;
        }
        sourceMapAbortController.signal.addEventListener("abort", () => {
          sourceMapConsumerPromise = Promise.resolve(void 0);
          sourceMapConsumer.destroy();
        });
        return sourceMapConsumer;
      } catch {
      }
    })();
  };
  ws.once("open", () => {
    send("Runtime.enable");
    keepAliveInterval = setInterval(() => send("Runtime.getIsolateId"), 1e4);
  });
  ws.on("unexpected-response", () => {
    console.log("Waiting for connection...");
  });
  ws.once("close", () => {
    clearInterval(keepAliveInterval);
    sourceMapAbortController.abort();
  });
  return {
    ws,
    send,
    reconstructError,
    sourceMapPath,
    getSourceMapConsumer,
    cleanupMessageQueue,
    isClosed,
    close: () => {
      clearInterval(keepAliveInterval);
      if (!isClosed()) {
        try {
          ws.removeAllListeners();
          ws.once("error", () => {
          });
          ws.close();
        } catch {
        }
      }
      sourceMapAbortController.abort();
    }
  };
}
export {
  createInspectorConnector
};
