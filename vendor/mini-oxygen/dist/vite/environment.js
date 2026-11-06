import {
  createFetchableDevEnvironment
} from "vite";
import {
  WARMUP_PATHNAME,
  getViteUrl,
  startMiniOxygenRuntime
} from "./server-middleware.js";
import { toMiniflareRequest } from "./utils.js";
function hasProvidedEnvBindings(options) {
  return Object.prototype.hasOwnProperty.call(options, "env") || Object.prototype.hasOwnProperty.call(options, "envPromise");
}
function mergeMiniOxygenRuntimeOptions(current, next) {
  const merged = {
    ...current,
    ...next
  };
  if (hasProvidedEnvBindings(current) || hasProvidedEnvBindings(next)) {
    merged.env = { ...current.env, ...next.env };
  }
  if (current.crossBoundarySetup || next.crossBoundarySetup) {
    merged.crossBoundarySetup = [
      ...current.crossBoundarySetup || [],
      ...next.crossBoundarySetup || []
    ];
  }
  return merged;
}
function createMiniOxygenDevEnvironment(name, config, runtimeOptions, resolveRuntimeOptions) {
  let currentRuntimeOptions = runtimeOptions;
  let viteDevServer;
  let miniOxygen;
  let pendingRuntime;
  function runtimeHasStarted() {
    return Boolean(pendingRuntime || miniOxygen && !miniOxygen.isDisposed);
  }
  const environment = createFetchableDevEnvironment(name, config, {
    // Browser HMR uses the client environment. SSR updates are picked up on
    // the next request after Vite invalidates the SSR module graph.
    hot: false,
    handleRequest: async (request) => {
      if (miniOxygen?.isDisposed) {
        miniOxygen = void 0;
      }
      if (!miniOxygen) {
        if (!pendingRuntime) {
          pendingRuntime = startRuntime().catch((error) => {
            pendingRuntime = void 0;
            throw error;
          });
        }
        miniOxygen = await pendingRuntime;
        pendingRuntime = void 0;
      }
      const response = await miniOxygen.dispatchFetch(
        toMiniflareRequest(request)
      );
      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: Array.from(response.headers.entries())
      });
    }
  });
  const originalListen = environment.listen.bind(environment);
  const originalClose = environment.close.bind(environment);
  async function startRuntime() {
    if (!viteDevServer) {
      throw new Error(
        "MiniOxygen dev environment was used before the Vite server was ready."
      );
    }
    const options = await resolveRuntimeOptions(
      currentRuntimeOptions,
      viteDevServer
    );
    return startMiniOxygenRuntime(options);
  }
  async function warmup() {
    const WARMUP_SETTLE_DELAY_MS = 200;
    await new Promise((resolve) => setTimeout(resolve, WARMUP_SETTLE_DELAY_MS));
    const viteUrl = viteDevServer && getViteUrl(viteDevServer);
    if (!viteUrl) return;
    await environment.dispatchFetch(new Request(new URL(WARMUP_PATHNAME, viteUrl))).catch(() => {
    });
  }
  return Object.assign(environment, {
    configureRuntime(options) {
      if (runtimeHasStarted()) {
        throw new Error(
          "MiniOxygen runtime options cannot be updated after the runtime has started."
        );
      }
      currentRuntimeOptions = mergeMiniOxygenRuntimeOptions(
        currentRuntimeOptions,
        options
      );
    },
    async listen(server) {
      viteDevServer = server;
      await originalListen(server);
      void warmup();
    },
    async close() {
      await Promise.allSettled([originalClose(), miniOxygen?.dispose()]);
    }
  });
}
export {
  createMiniOxygenDevEnvironment,
  hasProvidedEnvBindings,
  mergeMiniOxygenRuntimeOptions
};
