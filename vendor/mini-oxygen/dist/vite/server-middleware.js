import {
  isFetchableDevEnvironment
} from "vite";
import { fileURLToPath } from "node:url";
import {
  createMiniOxygen,
  Response as MiniOxygenResponse,
  defaultLogRequestLine
} from "../worker/index.js";
import { pipeFromWeb, toWeb } from "./utils.js";
import {
  isEntrypointError,
  handleEntrypointError
} from "./entry-error.js";
const scriptPath = fileURLToPath(new URL("./worker-entry.js", import.meta.url));
const WARMUP_PATHNAME = "/__vite_warmup";
function startMiniOxygenRuntime({
  viteDevServer,
  env,
  debug = false,
  inspectorPort,
  crossBoundarySetup,
  entry: workerEntryFile,
  requestHook,
  logRequestLine = defaultLogRequestLine,
  compatibilityDate
}) {
  const wrappedHook = requestHook || logRequestLine ? async (request) => {
    const info = await request.json();
    await Promise.all([requestHook?.(info), logRequestLine?.(info)]);
    return new MiniOxygenResponse("ok");
  } : null;
  const wrappedViteInvoke = async (request) => handleViteInvokeRequest(viteDevServer, request);
  const miniOxygen = createMiniOxygen({
    debug,
    inspectorPort,
    requestHook: null,
    workers: [
      {
        name: "vite-env",
        modulesRoot: "/",
        modules: [{ type: "ESModule", path: scriptPath }],
        serviceBindings: {
          __VITE_INVOKE_MODULE: wrappedViteInvoke,
          ...wrappedHook && { __VITE_REQUEST_HOOK: wrappedHook }
        },
        bindings: {
          ...env,
          __VITE_RUNTIME_EXECUTE_URL: workerEntryFile,
          __VITE_WARMUP_PATHNAME: WARMUP_PATHNAME
        },
        unsafeEvalBinding: "__VITE_UNSAFE_EVAL",
        wrappedBindings: { __VITE_SETUP_ENV: "setup-environment" },
        ...compatibilityDate && { compatibilityDate }
      },
      {
        name: "setup-environment",
        modules: true,
        serviceBindings: crossBoundarySetup?.reduce(
          (acc, { binding }, index) => {
            if (binding) {
              acc[`wrapped_service_${index}`] = async (request) => {
                const payload = await request.json();
                const result = await binding(...payload);
                return new MiniOxygenResponse(JSON.stringify(result ?? ""));
              };
            }
            return acc;
          },
          {}
        ),
        script: `
          const setupScripts = [${crossBoundarySetup?.map((boundary) => boundary.script) ?? ""}];
          export default (env) => () => {
            setupScripts.forEach((setup, index) => {
              if (!setup) return;

              const service = env['wrapped_service_' + index];
              const wrappedBinding = service
                ? (...args) => {
                  return service.fetch(
                    new Request(
                      'http://localhost',
                      {method: 'POST', body: JSON.stringify(args)}
                    )
                  ).then(response => response.json());
                }
                : undefined;

              setup(wrappedBinding);
            });

            setupScripts.length = 0;
          }`
      }
    ]
  });
  return miniOxygen;
}
function setupOxygenMiddleware(viteDevServer, getEntryPointErrorHandler) {
  viteDevServer.middlewares.use(function o2HandleWorkerRequest(req, res, next) {
    const environment = viteDevServer.environments["ssr"];
    if (!isFetchableDevEnvironment(environment)) {
      next();
      return;
    }
    environment.dispatchFetch(toWeb(req)).then(async (webResponse) => {
      if (isEntrypointError(webResponse)) {
        await handleEntrypointError(
          viteDevServer,
          webResponse,
          res,
          getEntryPointErrorHandler?.()
        );
      } else {
        await pipeFromWeb(webResponse, res);
      }
    }).catch((error) => {
      console.error("MiniOxygen: Error during evaluation:", error);
      res.writeHead(500);
      res.end();
    });
  });
}
function getViteUrl(viteDevServer) {
  let viteUrl = viteDevServer.resolvedUrls?.local[0] ?? viteDevServer.resolvedUrls?.network[0];
  if (!viteUrl) {
    const address = viteDevServer.httpServer?.address?.();
    viteUrl = address && typeof address !== "string" ? `http://localhost:${address.port}` : address ?? void 0;
  }
  return viteUrl;
}
async function handleViteInvokeRequest(viteDevServer, request) {
  try {
    const payload = await request.json();
    const result = await viteDevServer.environments["ssr"].hot.handleInvoke(payload);
    return new MiniOxygenResponse(JSON.stringify(result), {
      headers: {
        "Cache-Control": "no-store",
        "Content-Type": "application/json"
      }
    });
  } catch (error) {
    console.error("Error during Vite runner invoke:", error);
    return new MiniOxygenResponse(
      JSON.stringify({ error: serializeInvokeError(error) }),
      {
        status: 500,
        headers: {
          "Cache-Control": "no-store",
          "Content-Type": "application/json"
        }
      }
    );
  }
}
function serializeInvokeError(error) {
  if (error instanceof Error) {
    const errorWithCode = error;
    return {
      message: error.message,
      stack: error.stack,
      ...error.cause ? { cause: error.cause } : {},
      ...errorWithCode.code ? { code: errorWithCode.code } : {}
    };
  }
  return {
    message: typeof error === "string" ? error : "Unknown Vite runner invoke error"
  };
}
export {
  WARMUP_PATHNAME,
  getViteUrl,
  setupOxygenMiddleware,
  startMiniOxygenRuntime
};
