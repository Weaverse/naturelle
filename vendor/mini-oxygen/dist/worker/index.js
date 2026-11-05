import {
  Miniflare,
  NoOpLog,
  Request,
  Response,
  fetch
} from "miniflare";
import { createInspectorConnector } from "./inspector.js";
import {
  fetch as undiciFetch,
  ProxyAgent
} from "undici";
import {
  STATIC_ASSET_EXTENSIONS,
  buildAssetsUrl,
  createAssetsServer
} from "./assets.js";
import {
  getMiniOxygenHandlerScript
} from "./handler.js";
import { OXYGEN_HEADERS_MAP } from "../common/headers.js";
import { findPort } from "../common/find-port.js";
import { OXYGEN_COMPAT_PARAMS } from "../common/compat.js";
import { isO2Verbose } from "../common/debug.js";
const DEFAULT_PUBLIC_INSPECTOR_PORT = 9229;
const DEFAULT_ASSETS_PORT = 9100;
function createMiniOxygen({
  debug = false,
  inspectorPort,
  assets,
  sourceMapPath = "",
  requestHook,
  inspectWorkerName,
  ...miniflareOptions
}) {
  const mf = new Miniflare(
    buildMiniflareOptions(miniflareOptions, requestHook, assets)
  );
  if (!sourceMapPath) {
    const mainWorker = inspectWorkerName && miniflareOptions.workers.find(
      ({ name }) => name === inspectWorkerName
    ) || miniflareOptions.workers[0];
    if (mainWorker) {
      if ("scriptPath" in mainWorker) {
        sourceMapPath = mainWorker.scriptPath + ".map";
      } else if (Array.isArray(mainWorker?.modules)) {
        const modulePath = mainWorker?.modules[0].path;
        sourceMapPath = modulePath + ".map";
      }
    }
  }
  let inspectorConnector;
  const ready = mf.ready.then(async (workerUrl) => {
    const [privateInspectorUrl, publicInspectorPort] = await Promise.all([
      mf.getInspectorURL(),
      debug ? inspectorPort ?? findPort(DEFAULT_PUBLIC_INSPECTOR_PORT) : void 0
    ]);
    inspectorConnector = createInspectorConnector({
      sourceMapPath,
      publicInspectorPort,
      privateInspectorPort: Number(privateInspectorUrl.port),
      workerName: inspectWorkerName ?? miniflareOptions.workers[0]?.name ?? ROUTING_WORKER_NAME
    });
    await inspectorConnector.reconnect();
    return {
      workerUrl,
      inspectorUrl: debug ? new URL(
        privateInspectorUrl.href.replace(
          privateInspectorUrl.port,
          String(publicInspectorPort)
        )
      ) : void 0
    };
  });
  const assetsServer = assets?.directory ? createAssetsServer(assets.directory) : void 0;
  assetsServer?.listen(assets?.port ?? DEFAULT_ASSETS_PORT);
  let isDisposed = false;
  return {
    ready,
    dispatchFetch: async (request) => {
      const response = await mf.dispatchFetch(request, { redirect: "manual" });
      return response;
    },
    getBindings: mf.getBindings,
    getCaches: mf.getCaches,
    getWorker: mf.getWorker,
    async reload(getNewOptions) {
      const newOptions = await getNewOptions?.({
        workers: miniflareOptions.workers
      });
      await inspectorConnector?.reconnect(
        () => mf.setOptions(
          buildMiniflareOptions(
            { ...miniflareOptions, ...newOptions },
            requestHook,
            assets
          )
        )
      );
    },
    async dispose() {
      assetsServer?.closeAllConnections();
      assetsServer?.close();
      await inspectorConnector?.close();
      await mf.dispose();
      isDisposed = true;
    },
    get isDisposed() {
      return isDisposed;
    }
  };
}
const defaultLogRequestLine = ({ request, response }) => {
  console.log(
    `${request.method}  ${response.status}  ${request.url.replace(
      new URL(request.url).origin,
      ""
    )}`
  );
};
const ROUTING_WORKER_NAME = "mini-oxygen";
const oxygenHeadersMap = Object.values(OXYGEN_HEADERS_MAP).reduce(
  (acc, item) => {
    acc[item.name] = item.defaultValue;
    return acc;
  },
  {}
);
const OUTBOUND_SERVICE = {
  async outboundService(request) {
    try {
      const proxy = process.env["SHOPIFY_HTTP_PROXY"] ?? process.env["SHOPIFY_HTTPS_PROXY"] ?? null;
      const url = new URL(request.url);
      if (proxy && url.hostname !== "localhost" && url.hostname !== "127.0.0.1") {
        request.dispatcher = new ProxyAgent(
          proxy
        );
      }
      return undiciFetch(request.url, request);
    } catch (e) {
      console.error(`[h2:error:outboundservice] ${request.url}`);
      console.error(e);
      throw e;
    }
  }
};
function buildMiniflareOptions({ workers, ...mfOverwriteOptions }, requestHook = defaultLogRequestLine, assetsOptions) {
  const entryWorker = workers.find((worker) => !!worker.name);
  if (!entryWorker?.name) {
    throw new Error("You must provide at least 1 named worker.");
  }
  const handleAssets = assetsOptions && createAssetHandler(assetsOptions);
  const staticAssetExtensions = handleAssets ? STATIC_ASSET_EXTENSIONS.slice() : null;
  const wrappedHook = requestHook ? async (request) => {
    await requestHook(await request.json());
    return new Response("ok");
  } : null;
  const wrappedBindings = new Set(
    workers.flatMap((worker) => Object.values(worker.wrappedBindings || {})).filter(
      (wrappedBinding) => typeof wrappedBinding === "string"
    )
  );
  return {
    cf: false,
    port: 0,
    // Avoid using 'host' here, there's a bug when mixed with port:0 in Node 18:
    // https://github.com/cloudflare/workers-sdk/issues/4563
    // host: 'localhost',
    inspectorPort: 0,
    liveReload: false,
    ...isO2Verbose() ? { verbose: true } : {
      verbose: false,
      log: new NoOpLog(),
      handleRuntimeStdio(stdout, stderr) {
        stdout.destroy();
        stderr.destroy();
      }
    },
    ...mfOverwriteOptions,
    workers: [
      {
        name: ROUTING_WORKER_NAME,
        modules: true,
        script: getMiniOxygenHandlerScript(),
        bindings: {
          staticAssetExtensions,
          oxygenHeadersMap
        },
        serviceBindings: {
          entry: entryWorker.name,
          ...wrappedHook && { hook: wrappedHook },
          ...handleAssets && { assets: handleAssets }
        }
      },
      ...workers.map((worker) => {
        const isNormalWorker = !wrappedBindings.has(worker.name);
        const useOutboundService = isNormalWorker && (process.env.NODE_TLS_REJECT_UNAUTHORIZED === "0" || process.env.SHOPIFY_HTTP_PROXY || process.env.SHOPIFY_HTTPS_PROXY);
        return {
          ...isNormalWorker && !worker.compatibilityDate && OXYGEN_COMPAT_PARAMS,
          ...useOutboundService && OUTBOUND_SERVICE,
          ...worker
        };
      })
    ]
  };
}
function createAssetHandler(options) {
  const assetsServerOrigin = options.origin ?? buildAssetsUrl(options.port ?? DEFAULT_ASSETS_PORT);
  return async (request) => {
    return fetch(
      new Request(
        request.url.replace(
          new URL(request.url).origin + "/",
          assetsServerOrigin
        ),
        request
      )
    );
  };
}
export {
  Request,
  Response,
  buildAssetsUrl,
  createMiniOxygen,
  defaultLogRequestLine,
  fetch
};
