import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import {
  basename,
  dirname,
  isAbsolute,
  join,
  relative,
  resolve
} from "node:path";
import { loadEnv } from "vite";
import {
  hasProvidedEnvBindings
} from "./environment.js";
import { getHydrogenCompatibilityDate } from "./compat-date.js";
import {
  createMiniOxygen,
  defaultLogRequestLine
} from "../worker/index.js";
import { findPort } from "../common/find-port.js";
import { pipeFromWeb, toMiniflareRequest, toWeb } from "./utils.js";
const DEFAULT_PREVIEW_ENTRY = "dist/server/index.js";
const DEFAULT_PREVIEW_ENTRY_FILES = ["index.js", "index.mjs"];
const DEFAULT_PREVIEW_ASSETS_PORT = 9100;
async function setupOxygenPreviewServer(previewServer, pluginOptions, apiOptions) {
  const previewRuntime = await createOxygenPreviewRuntime(
    previewServer,
    pluginOptions,
    apiOptions
  );
  previewServer.httpServer.once("close", () => {
    void previewRuntime.dispose();
  });
  return () => {
    previewServer.middlewares.use(
      async function o2HandlePreviewWorkerRequest(req, res, next) {
        try {
          const response = await previewRuntime.dispatchFetch(
            toMiniflareRequest(toWeb(req))
          );
          await pipeFromWeb(
            new Response(response.body, {
              status: response.status,
              statusText: response.statusText,
              headers: Array.from(response.headers.entries())
            }),
            res
          );
        } catch (error) {
          next(error);
        }
      }
    );
  };
}
async function createOxygenPreviewRuntime(previewServer, pluginOptions, apiOptions) {
  const { root } = previewServer.config;
  const { assetsDir, workerFile } = resolvePreviewOutputPaths(
    previewServer.config,
    pluginOptions.previewEntry
  );
  if (!existsSync(assetsDir)) {
    throw new Error(
      `No Oxygen preview client assets were found at "${formatPath(
        root,
        assetsDir
      )}". Run your build before starting \`vite preview\`.`
    );
  }
  if (!existsSync(workerFile)) {
    throw new Error(
      pluginOptions.previewEntry ? `No Oxygen preview worker entry was found at "${formatPath(
        root,
        workerFile
      )}". Check \`oxygen({ previewEntry })\` or run your build before starting \`vite preview\`.` : `No Oxygen preview worker entry was found. Configure \`oxygen({ previewEntry })\` or build a worker at "${DEFAULT_PREVIEW_ENTRY}".`
    );
  }
  const remoteEnv = await Promise.resolve(apiOptions.envPromise);
  const fallbackEnv = !hasProvidedEnvBindings(pluginOptions) && !hasProvidedEnvBindings(apiOptions) ? loadEnv(previewServer.config.mode, previewServer.config.envDir, "") : void 0;
  const env = Object.assign(
    {},
    fallbackEnv,
    remoteEnv,
    apiOptions.env,
    pluginOptions.env
  );
  const compatibilityDate = apiOptions.compatibilityDate ?? getHydrogenCompatibilityDate(root);
  const requestHook = getPreviewRequestHook(pluginOptions, apiOptions);
  const previewRuntime = createMiniOxygen({
    debug: apiOptions.debug ?? pluginOptions.debug ?? false,
    inspectorPort: apiOptions.inspectorPort ?? pluginOptions.inspectorPort,
    assets: {
      directory: assetsDir,
      port: await findPort(DEFAULT_PREVIEW_ASSETS_PORT)
    },
    ...requestHook !== void 0 && { requestHook },
    workers: [
      {
        name: "preview",
        modulesRoot: dirname(workerFile),
        modules: [
          {
            type: "ESModule",
            path: workerFile,
            contents: await readFile(workerFile, "utf8")
          }
        ],
        bindings: env,
        ...compatibilityDate && { compatibilityDate }
      }
    ]
  });
  await previewRuntime.ready;
  return previewRuntime;
}
function resolvePreviewOutputPaths(config, previewEntry) {
  const root = config.root;
  const clientOutDir = resolveFromRoot(
    root,
    config.environments.client?.build.outDir ?? config.build.outDir
  );
  if (previewEntry) {
    return {
      assetsDir: clientOutDir,
      workerFile: resolveFromRoot(root, previewEntry)
    };
  }
  const workerDirs = [
    basename(clientOutDir) === "client" ? join(dirname(clientOutDir), "server") : void 0,
    resolve(root, "dist/server")
  ].filter((dir, index, dirs) => {
    return Boolean(dir && dirs.indexOf(dir) === index);
  });
  for (const workerDir of workerDirs) {
    for (const entryFile of DEFAULT_PREVIEW_ENTRY_FILES) {
      const workerFile = join(workerDir, entryFile);
      if (existsSync(workerFile)) {
        return { assetsDir: clientOutDir, workerFile };
      }
    }
  }
  return {
    assetsDir: clientOutDir,
    workerFile: resolve(root, DEFAULT_PREVIEW_ENTRY)
  };
}
function resolveFromRoot(root, path) {
  return isAbsolute(path) ? path : resolve(root, path);
}
function formatPath(root, path) {
  const relativePath = relative(root, path);
  return relativePath && !relativePath.startsWith("..") ? relativePath : path;
}
function getPreviewRequestHook(pluginOptions, apiOptions) {
  const requestHook = apiOptions.requestHook;
  const logRequestLine = pluginOptions.logRequestLine ?? apiOptions.logRequestLine;
  if (!requestHook) return logRequestLine;
  if (logRequestLine === null) return requestHook;
  return async (info) => {
    await Promise.all([
      requestHook(info),
      (logRequestLine ?? defaultLogRequestLine)(info)
    ]);
  };
}
export {
  setupOxygenPreviewServer
};
