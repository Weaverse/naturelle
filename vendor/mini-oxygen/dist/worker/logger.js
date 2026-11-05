import { parse as parseStackTrace } from "stack-trace";
function addInspectorConsoleLogger(inspector) {
  inspector.ws.addEventListener("message", async (event) => {
    if (typeof event.data !== "string") {
      console.error("Unrecognised devtools event:", event);
      return;
    }
    const evt = JSON.parse(event.data);
    inspector.cleanupMessageQueue(evt);
    if (evt.method === "Runtime.consoleAPICalled") {
      await logConsoleMessage(evt.params, inspector);
    } else if (evt.method === "Runtime.exceptionThrown") {
      console.error(
        await createErrorFromException(evt.params.exceptionDetails, inspector)
      );
    }
  });
}
async function createErrorFromException(exceptionDetails, inspector) {
  const errorProperties = {};
  const sourceMapConsumer = await inspector.getSourceMapConsumer();
  if (sourceMapConsumer !== void 0) {
    const message = exceptionDetails.exception?.description?.split("\n")[0];
    const stack = exceptionDetails.stackTrace?.callFrames;
    const formatted = formatStructuredError(sourceMapConsumer, message, stack);
    errorProperties.message = exceptionDetails.text;
    errorProperties.stack = formatted;
  } else {
    errorProperties.message = exceptionDetails.text + " " + (exceptionDetails.exception?.description ?? "");
  }
  return inspector.reconstructError(
    errorProperties,
    exceptionDetails.exception
  );
}
async function createErrorFromLog(ro, inspector) {
  if (ro.subtype !== "error" || ro.preview?.subtype !== "error") {
    throw new Error("Not an error object");
  }
  const errorProperties = {
    message: ro.preview.description?.split("\n").filter((line) => !/^\s+at\s/.test(line)).join("\n") ?? ro.preview.properties.find(({ name }) => name === "message")?.value ?? "",
    stack: ro.preview.description ?? ro.description ?? ro.preview.properties.find(({ name }) => name === "stack")?.value,
    cause: ro.preview.properties.find(({ name }) => name === "cause")?.value
  };
  return inspector.reconstructError(errorProperties, ro);
}
const mapConsoleAPIMessageTypeToConsoleMethod = {
  log: "log",
  debug: "debug",
  info: "info",
  warning: "warn",
  error: "error",
  dir: "dir",
  dirxml: "dirxml",
  table: "table",
  trace: "trace",
  clear: "clear",
  count: "count",
  assert: "assert",
  profile: "profile",
  profileEnd: "profileEnd",
  timeEnd: "timeEnd",
  startGroup: "group",
  startGroupCollapsed: "groupCollapsed",
  endGroup: "groupEnd"
};
async function logConsoleMessage(evt, inspector) {
  const args = [];
  for (const ro of evt.args) {
    switch (ro.type) {
      case "string":
      case "number":
      case "boolean":
      case "undefined":
      case "symbol":
      case "bigint":
        args.push(ro.value);
        break;
      case "function":
        args.push(`[Function: ${ro.description ?? "<no-description>"}]`);
        break;
      case "object":
        if (!ro.preview) {
          args.push(
            ro.subtype === "null" ? "null" : ro.description ?? "<no-description>"
          );
        } else {
          if (ro.preview.description) args.push(ro.preview.description);
          switch (ro.preview.subtype) {
            case "array":
              args.push(
                "[ " + ro.preview.properties.map(({ value }) => {
                  return value;
                }).join(", ") + (ro.preview.overflow ? "..." : "") + " ]"
              );
              break;
            case "weakmap":
            case "map":
              ro.preview.entries === void 0 ? args.push("{}") : args.push(
                "{\n" + ro.preview.entries.map(({ key, value }) => {
                  return `  ${key?.description ?? "<unknown>"} => ${value.description}`;
                }).join(",\n") + (ro.preview.overflow ? "\n  ..." : "") + "\n}"
              );
              break;
            case "weakset":
            case "set":
              ro.preview.entries === void 0 ? args.push("{}") : args.push(
                "{ " + ro.preview.entries.map(({ value }) => {
                  return `${value.description}`;
                }).join(", ") + (ro.preview.overflow ? ", ..." : "") + " }"
              );
              break;
            case "regexp":
              break;
            case "date":
              break;
            case "generator":
              args.push(ro.preview?.properties[0]?.value || "");
              break;
            case "promise":
              if (ro.preview?.properties[0]?.value === "pending") {
                args.push(`{<${ro.preview.properties[0].value}>}`);
              } else {
                args.push(
                  `{<${ro.preview?.properties[0]?.value}>: ${ro.preview?.properties[1]?.value}}`
                );
              }
              break;
            case "node":
            case "iterator":
            case "proxy":
            case "typedarray":
            case "arraybuffer":
            case "dataview":
            case "webassemblymemory":
            case "wasmvalue":
              break;
            case "error":
              const error = await createErrorFromLog(ro, inspector);
              args.splice(-1, 1, error);
              break;
            default:
              args.push(
                "{\n" + ro.preview.properties.map(({ name, value }) => {
                  return `  ${name}: ${value}`;
                }).join(",\n") + (ro.preview.overflow ? "\n  ..." : "") + "\n}"
              );
          }
        }
        break;
      default:
        args.push(ro.description || ro.unserializableValue || "\u{1F98B}");
        break;
    }
  }
  const method = mapConsoleAPIMessageTypeToConsoleMethod[evt.type];
  if (method in console) {
    switch (method) {
      case "dir":
        console.dir(args);
        break;
      case "table":
        console.table(args);
        break;
      default:
        console[method].apply(console, args);
        break;
    }
  } else {
    console.warn(`Unsupported console method: ${method}`);
    console.warn("console event:", evt);
  }
}
function formatStructuredError(sourceMapConsumer, message, frames) {
  const lines = [];
  if (message !== void 0) lines.push(message);
  frames?.forEach(({ functionName, lineNumber, columnNumber }, i) => {
    try {
      if (typeof lineNumber === "number") {
        const pos = sourceMapConsumer.originalPositionFor({
          line: lineNumber + 1,
          column: columnNumber
        });
        if (i === 0 && pos.source && pos.line !== null) {
          const fileSource = sourceMapConsumer.sourceContentFor(pos.source);
          const fileSourceLine = fileSource?.split("\n")[pos.line - 1] || "";
          lines.push(fileSourceLine.trim());
          if (pos.column) {
            lines.push(
              `${" ".repeat(pos.column - fileSourceLine.search(/\S/))}^`
            );
          }
        }
        if (pos && pos.line !== null && pos.column !== null) {
          const convertedFnName = pos.name || functionName || "";
          let convertedLocation = `${pos.source}:${pos.line}:${pos.column + 1}`;
          if (convertedFnName === "") {
            lines.push(`    at ${convertedLocation}`);
          } else {
            lines.push(`    at ${convertedFnName} (${convertedLocation})`);
          }
        }
      }
    } catch {
    }
  });
  return lines.join("\n");
}
function formatStack(sourceMapConsumer, stack) {
  const message = stack.split("\n")[0];
  const callSites = parseStackTrace({ stack });
  const frames = callSites.map((site) => ({
    functionName: site.getFunctionName() ?? "",
    // `Protocol.Runtime.CallFrame`s line numbers are 0-indexed, hence `- 1`
    lineNumber: (site.getLineNumber() ?? 1) - 1,
    columnNumber: site.getColumnNumber() ?? 1,
    // Unused by `formattedError`
    scriptId: "",
    url: ""
  }));
  return formatStructuredError(sourceMapConsumer, message, frames);
}
export {
  addInspectorConsoleLogger,
  createErrorFromException,
  createErrorFromLog,
  formatStack,
  formatStructuredError
};
