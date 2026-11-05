import * as path from "node:path";
import * as fs from "node:fs";
import { MiniOxygen } from "./core.js";
import { findPort } from "../common/find-port.js";
import { OXYGEN_COMPAT_PARAMS } from "../common/compat.js";
import { Request, Response, fetch } from "./server.js";
class WorkerNotFoundError extends Error {
  name = "WorkerNotFoundError";
  message = "A worker script or file is required for this command. Try building your project to ensure a workerFile is present, or pass its content in the `script` option.";
}
function createMiniOxygen(opts) {
  const {
    log = (message) => console.log(message),
    workerFile,
    script,
    rootPath,
    watch = false,
    buildWatchPaths,
    buildCommand,
    modules = true,
    sourceMap = true,
    envPath,
    env = {},
    globalFetch
  } = opts;
  const root = rootPath ?? process.cwd();
  if (!script && (!workerFile || !fs.existsSync(workerFile))) {
    throw new WorkerNotFoundError();
  }
  if (script && workerFile) {
    log(
      "Both `script` and `workerFile` options were provided. Using `script` to load the worker code and `workerFile` to find a sourcemap file in disk."
    );
  }
  const mf = new MiniOxygen(
    {
      globalFetch,
      buildCommand,
      envPath,
      script,
      scriptPath: workerFile ? path.resolve(root, workerFile) : void 0,
      watch,
      modules,
      sourceMap,
      buildWatchPaths,
      // This prevents the process from exiting when an unhandled rejection occurs.
      logUnhandledRejections: true,
      // this should stay in sync with oxygen-dms
      ...OXYGEN_COMPAT_PARAMS
    },
    env
  );
  return {
    async ready() {
      await mf.getPlugins();
    },
    dispatchFetch: (request) => {
      return mf.dispatchFetch(request);
    },
    async reload({ env: env2, ...nextOptions } = {}) {
      await mf.reload({ ...nextOptions, ...env2 && { bindings: env2 } });
    },
    async dispose() {
      await mf.dispose();
    },
    async createServer(serverOptions) {
      const {
        assetsDir,
        publicPath,
        port,
        autoReload = false,
        proxyServer,
        oxygenHeaders,
        onRequest,
        onResponseError,
        onResponse = (req, res) => {
          log(
            `${req.method}  ${res.status}  ${req.url.replace(
              new URL(req.url).origin,
              ""
            )}`
          );
        }
      } = serverOptions;
      if (publicPath !== void 0 && publicPath.length > 0 && !publicPath.endsWith("/")) {
        log(`
WARNING: publicPath must end with a trailing slash`);
      }
      const app = mf.createServer({
        assetsDir: assetsDir ? path.resolve(root, assetsDir) : void 0,
        publicPath,
        autoReload,
        proxyServer,
        oxygenHeaders,
        onRequest,
        onResponse,
        onResponseError
      });
      const actualPort = port === 0 ? 0 : port ?? await findPort(3e3);
      const sockets = /* @__PURE__ */ new Set();
      app.on("connection", (socket) => {
        sockets.add(socket);
        socket.once("close", () => sockets.delete(socket));
      });
      return new Promise((res) => {
        app.listen(actualPort, () => {
          const serverAddress = app.address();
          const assignedPort = serverAddress && typeof serverAddress === "object" ? serverAddress.port : actualPort;
          log(
            `
Started miniOxygen server. Listening at http://localhost:${assignedPort}
`
          );
          res({
            port: assignedPort,
            close: () => new Promise((resolve) => {
              sockets.forEach((socket) => socket.destroy());
              sockets.clear();
              app.close(() => resolve(void 0));
            })
          });
        });
      });
    }
  };
}
async function startServer(opts) {
  const { createServer, dispose, reload } = createMiniOxygen(opts);
  const { port, close } = await createServer(opts);
  return {
    port,
    reload,
    close: () => close().then(dispose)
  };
}
export {
  Request,
  Response,
  createMiniOxygen,
  fetch,
  startServer
};
