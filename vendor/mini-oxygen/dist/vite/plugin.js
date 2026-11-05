import { defaultClientConditions, loadEnv } from "vite";
import {
  createMiniOxygenDevEnvironment,
  hasProvidedEnvBindings,
  mergeMiniOxygenRuntimeOptions
} from "./environment.js";
import {
  setupOxygenMiddleware
} from "./server-middleware.js";
import { getHydrogenCompatibilityDate } from "./compat-date.js";
import {
  setupOxygenPreviewServer
} from "./preview.js";
const DEFAULT_SSR_ENTRY = "./server";
const workerConditions = ["worker", "workerd", ...defaultClientConditions];
function oxygen(pluginOptions = {}) {
  let apiOptions = {};
  let miniOxygenEnvironment;
  let root = process.cwd();
  let isSsrBuild = false;
  let userTsconfigPaths;
  const resolveMiniOxygenOptions = async (runtimeOptions, viteDevServer) => {
    const entry = runtimeOptions.entry ?? pluginOptions.entry ?? DEFAULT_SSR_ENTRY;
    const remoteEnv = await Promise.resolve(runtimeOptions.envPromise);
    const fallbackEnv = !hasProvidedEnvBindings(pluginOptions) && !hasProvidedEnvBindings(runtimeOptions) ? loadEnv(viteDevServer.config.mode, viteDevServer.config.envDir, "") : void 0;
    const env = Object.assign(
      {},
      fallbackEnv,
      remoteEnv,
      runtimeOptions.env,
      pluginOptions.env
    );
    return {
      entry,
      viteDevServer,
      crossBoundarySetup: runtimeOptions.crossBoundarySetup,
      env,
      debug: runtimeOptions.debug ?? pluginOptions.debug ?? false,
      inspectorPort: runtimeOptions.inspectorPort ?? pluginOptions.inspectorPort,
      requestHook: runtimeOptions.requestHook,
      entryPointErrorHandler: runtimeOptions.entryPointErrorHandler,
      compatibilityDate: runtimeOptions.compatibilityDate ?? getHydrogenCompatibilityDate(viteDevServer.config.root),
      logRequestLine: (
        // Give priority to the plugin option over the CLI option here,
        // since the CLI one is just a default, not a user-provided flag.
        pluginOptions.logRequestLine ?? runtimeOptions.logRequestLine
      )
    };
  };
  const applyRuntimeOptions = (newOptions) => {
    miniOxygenEnvironment?.configureRuntime(newOptions);
    apiOptions = mergeMiniOxygenRuntimeOptions(apiOptions, newOptions);
  };
  return [
    {
      name: "oxygen:main",
      config(config, env) {
        userTsconfigPaths = config.resolve?.tsconfigPaths;
        const build = {
          // When building, the CLI will set the `ssr` option to `true`
          // if no --entry flag is passed for the default SSR entry file.
          // Replace it here with a default value.
          ...env.isSsrBuild && config.build?.ssr && {
            ssr: config.build?.ssr === true ? (
              // No --entry flag passed by the user, use the
              // option passed to the plugin or the default value
              pluginOptions.entry ?? DEFAULT_SSR_ENTRY
            ) : (
              // --entry flag passed by the user, keep it
              config.build?.ssr
            )
          }
        };
        return {
          appType: "custom",
          ...Object.keys(build).length > 0 && { build },
          ssr: {
            noExternal: true,
            target: "webworker",
            resolve: {
              conditions: workerConditions
            }
          }
        };
      },
      configResolved(resolvedConfig) {
        root = resolvedConfig.root;
        isSsrBuild = Boolean(resolvedConfig.build.ssr);
      },
      configEnvironment(name) {
        if (name !== "ssr") return;
        return {
          resolve: {
            conditions: workerConditions,
            ...userTsconfigPaths != null && {
              tsconfigPaths: userTsconfigPaths
            }
          },
          dev: {
            createEnvironment(name2, config) {
              return miniOxygenEnvironment = createMiniOxygenDevEnvironment(
                name2,
                config,
                apiOptions,
                resolveMiniOxygenOptions
              );
            }
          }
        };
      },
      api: {
        registerPluginOptions(newOptions) {
          applyRuntimeOptions(newOptions);
        }
      },
      configureServer: {
        order: "pre",
        handler: (viteDevServer) => {
          return () => {
            setupOxygenMiddleware(
              viteDevServer,
              () => apiOptions.entryPointErrorHandler
            );
          };
        }
      },
      configurePreviewServer: {
        order: "pre",
        async handler(previewServer) {
          return setupOxygenPreviewServer(
            previewServer,
            pluginOptions,
            apiOptions
          );
        }
      },
      generateBundle() {
        if (!isSsrBuild) return;
        const compatibilityDate = apiOptions.compatibilityDate ?? getHydrogenCompatibilityDate(root);
        if (compatibilityDate) {
          if (!/^\d{4}-\d{2}-\d{2}$/.test(compatibilityDate)) {
            throw new Error(
              `Invalid compatibility date "${compatibilityDate}"`
            );
          }
          const oxygenJsonFile = "oxygen.json";
          const oxygenJsonContent = {
            version: 1,
            compatibility_date: compatibilityDate
          };
          this.emitFile({
            type: "asset",
            fileName: oxygenJsonFile,
            source: JSON.stringify(oxygenJsonContent, null, 2)
          });
        }
      }
    }
  ];
}
export {
  oxygen
};
