import crypto from "node:crypto";
import { readFileSync } from "node:fs";
import {
  createServer
} from "node:http";
import { WebSocket, WebSocketServer } from "ws";
import { request } from "undici";
const CFW_DEVTOOLS = "https://devtools.devprod.cloudflare.dev";
const FAVICON_URL = "https://cdn.shopify.com/s/files/1/0598/4822/8886/files/favicon.svg";
const INSPECTOR_HOST = "127.0.0.1";
const ALLOWED_INSPECTOR_HOSTNAMES = /* @__PURE__ */ new Set([
  INSPECTOR_HOST,
  "[::1]",
  "localhost"
]);
const ALLOWED_INSPECTOR_ORIGINS = /* @__PURE__ */ new Set([
  CFW_DEVTOOLS,
  "devtools://devtools"
]);
function createInspectorProxy(port, newInspectorConnection) {
  const sessionId = crypto.randomUUID();
  let debuggerWs = void 0;
  let inspector = newInspectorConnection;
  let isDevToolsInBrowser = false;
  const sourceMapPath = newInspectorConnection.sourceMapPath;
  const sourceMapPathname = "/__index.js.map";
  const sourceMapURL = `http://${INSPECTOR_HOST}:${port}${sourceMapPathname}`;
  const server = createServer((req, res) => {
    if (!isAllowedInspectorHost(req.headers.host)) {
      res.statusCode = 403;
      res.end("Forbidden");
      return;
    }
    const [url = "/", queryString = ""] = req.url?.split("?") || [];
    switch (url) {
      // We implement a couple of well known end points that are queried
      // for metadata when opening `chrome://inspect` in the browser.
      // https://chromedevtools.github.io/devtools-protocol/#endpoints
      case "/json/version":
        res.setHeader("Content-Type", "application/json");
        res.end(
          JSON.stringify({ Browser: "MiniOxygen", "Protocol-Version": "1.3" })
        );
        break;
      case "/json":
      case "/json/list":
        {
          res.setHeader("Content-Type", "application/json");
          const localHost = `${INSPECTOR_HOST}:${port}/ws`;
          const devtoolsFrontendUrl = `devtools://devtools/bundled/js_app.html?experiments=true&v8only=true&ws=${localHost}`;
          const devtoolsFrontendUrlCompat = `devtools://devtools/bundled/inspector.html?experiments=true&v8only=true&ws=${localHost}`;
          res.end(
            JSON.stringify([
              {
                id: sessionId,
                type: "node",
                webSocketDebuggerUrl: `ws://${localHost}`,
                devtoolsFrontendUrl,
                devtoolsFrontendUrlCompat,
                // Below are fields that are visible in the DevTools UI.
                title: "MiniOxygen Worker",
                faviconUrl: FAVICON_URL,
                url: "https://" + new URL(inspector.ws.url).host
              }
            ])
          );
        }
        return;
      case sourceMapPathname:
        if (!isAllowedInspectorOrigin(req.headers.origin)) {
          res.statusCode = 403;
          res.end("Forbidden");
          return;
        }
        res.setHeader("Content-Type", "text/plain");
        res.setHeader("Cache-Control", "no-store");
        res.setHeader(
          "Access-Control-Allow-Origin",
          req.headers.origin ?? "devtools://devtools"
        );
        res.setHeader("Vary", "Origin");
        if (sourceMapPath) {
          res.end(readFileSync(sourceMapPath, "utf-8"));
        } else {
          res.statusCode = 404;
          res.end();
        }
        break;
      case "/favicon.ico":
        proxyHttp(FAVICON_URL, req.headers, res);
        break;
      case "/":
        if (!queryString) {
          res.statusCode = 302;
          res.setHeader(
            "Location",
            `/?experiments=true&v8only=true&debugger=true&ws=${INSPECTOR_HOST}:${port}/ws`
          );
          res.end();
        } else {
          proxyHttp(
            CFW_DEVTOOLS + "/js_app",
            req.headers,
            res,
            (content) => (
              // HTML from DevTools comes without closing <body> and <html> tags.
              // The browser closes them automatically, then modifies the DOM with JS.
              // This adds a loading indicator before the JS kicks in and modifies the DOM.
              content + '<div style="display: flex; flex-direction: column; align-items: center; padding-top: 20px; font-family: Arial; color: white">Loading DevTools...</div></body></html>'
            )
          );
        }
        break;
      default:
        if (url === "/panels/sources/sources-meta.js" || url.startsWith("/core/i18n/locales/") && url.endsWith(".json")) {
          proxyHttp(
            CFW_DEVTOOLS + url,
            req.headers,
            res,
            (content) => content.replace(/['"]Cloudflare['"]/g, '"MiniOxygen"')
          );
        } else {
          proxyHttp(CFW_DEVTOOLS + url, req.headers, res);
        }
        break;
    }
  });
  const wsServer = new WebSocketServer({
    server,
    clientTracking: true,
    verifyClient: ({ req }) => isAllowedInspectorHost(req.headers.host) && isAllowedInspectorWebSocketOrigin(
      req.headers.origin,
      req.headers["user-agent"]
    )
  });
  const ready = new Promise((resolve, reject) => {
    const onError = (error) => reject(error);
    server.once("error", onError);
    server.listen(port, INSPECTOR_HOST, () => {
      server.off("error", onError);
      resolve(server.address());
    });
  });
  let messageBuffer = [];
  wsServer.on("connection", (ws, req) => {
    if (wsServer.clients.size > 1) {
      console.error(
        "Tried to open a new devtools window when a previous one was already open."
      );
      ws.close(1013, "Too many clients; only one can be connected at a time");
    } else {
      debuggerWs?.removeEventListener("message", sendMessageToInspector);
      debuggerWs = ws;
      const inspectorWs = inspector.ws;
      const pendingDebuggerMessages = [];
      const bufferDebuggerMessage = (event) => pendingDebuggerMessages.push(event);
      const startForwardingToInspector = () => {
        if (debuggerWs !== ws || ws.readyState !== WebSocket.OPEN) return;
        inspectorWs.send(
          JSON.stringify({ id: 1e8, method: "Debugger.disable" })
        );
        debuggerWs.removeEventListener("message", bufferDebuggerMessage);
        debuggerWs.addEventListener("message", sendMessageToInspector);
        pendingDebuggerMessages.forEach(sendMessageToInspector);
      };
      if (inspectorWs.readyState === WebSocket.OPEN) {
        startForwardingToInspector();
      } else {
        debuggerWs.addEventListener("message", bufferDebuggerMessage);
        inspectorWs.addEventListener("open", startForwardingToInspector, {
          once: true
        });
      }
      isDevToolsInBrowser = /mozilla/i.test(req.headers["user-agent"] ?? "");
      debuggerWs.addEventListener("close", () => {
        debuggerWs?.removeEventListener("message", sendMessageToInspector);
        debuggerWs?.removeEventListener("message", bufferDebuggerMessage);
        inspectorWs.removeEventListener("open", startForwardingToInspector);
        debuggerWs = void 0;
      });
      messageBuffer.forEach(sendMessageToDebugger);
      messageBuffer = [];
    }
  });
  if (inspector.ws) onInspectorConnection();
  function onInspectorConnection() {
    inspector.ws.addEventListener("message", sendMessageToDebugger);
    debuggerWs?.send(
      JSON.stringify({
        method: "Runtime.consoleAPICalled",
        params: {
          type: "warning",
          args: [
            {
              type: "string",
              value: "Source code changed. Please reload the DevTools to reconnect the debugger."
            }
          ],
          executionContextId: Date.now(),
          timestamp: Date.now()
        }
      })
    );
    debuggerWs?.close(1001, "Source code changed");
  }
  function sendMessageToInspector(event) {
    inspector.ws.send(event.data);
  }
  function sendMessageToDebugger(event) {
    if (isDevToolsInBrowser) {
      event = enhanceDevToolsEvent(event, sourceMapURL);
    }
    if (debuggerWs) {
      debuggerWs.send(event.data);
    } else {
      messageBuffer.push(event);
    }
  }
  return {
    ready,
    async close() {
      await ready;
      wsServer.clients.forEach((client) => client.terminate());
      await new Promise((resolve) => wsServer.close(() => resolve()));
      await new Promise(
        (resolve, reject) => server.close((error) => error ? reject(error) : resolve())
      );
    },
    // Every time workerd is restarted (e.g. env var change, etc.),
    // the inspector connection needs to be re-established.
    updateInspectorConnection(newConnection) {
      inspector = newConnection;
      onInspectorConnection();
    }
  };
}
function isAllowedInspectorHost(hostHeader) {
  if (!hostHeader) return false;
  try {
    const hostname = new URL(`http://${hostHeader}`).hostname.toLowerCase();
    return ALLOWED_INSPECTOR_HOSTNAMES.has(hostname);
  } catch {
    return false;
  }
}
function isAllowedInspectorOrigin(originHeader) {
  if (!originHeader) return true;
  if (ALLOWED_INSPECTOR_ORIGINS.has(originHeader)) return true;
  try {
    const origin = new URL(originHeader);
    return (origin.protocol === "http:" || origin.protocol === "https:") && ALLOWED_INSPECTOR_HOSTNAMES.has(origin.hostname.toLowerCase());
  } catch {
    return false;
  }
}
function isAllowedInspectorWebSocketOrigin(originHeader, userAgentHeader) {
  if (!originHeader) return !userAgentHeader;
  return isAllowedInspectorOrigin(originHeader);
}
function enhanceDevToolsEvent(event, sourceMapUrl) {
  const message = JSON.parse(event.data);
  if (message.method === "Debugger.scriptParsed") {
    if (message.params.sourceMapURL === "index.js.map") {
      message.params.sourceMapURL = sourceMapUrl;
    }
  }
  return { ...event, data: JSON.stringify(message) };
}
function proxyHttp(url, originalHeaders, nodeResponse, contentReplacer) {
  const headers = Object.fromEntries(Object.entries(originalHeaders));
  delete headers["host"];
  delete headers["cookie"];
  if (contentReplacer) delete headers["accept-encoding"];
  return request(url, { responseHeaders: "raw", headers }).then((response) => {
    nodeResponse.writeHead(response.statusCode, response.headers);
    if (nodeResponse.statusCode >= 300) {
      nodeResponse.end();
      return;
    }
    if (contentReplacer) {
      response.body.text().then(contentReplacer).then(nodeResponse.end.bind(nodeResponse));
    } else {
      response.body.pipe(nodeResponse);
    }
  }).catch((err) => {
    console.error(err);
    nodeResponse.statusCode = 500;
    nodeResponse.end("Internal error");
  });
}
export {
  createInspectorProxy
};
