import * as fs from "node:fs";
import { watch } from "node:fs";
import {
  Miniflare,
  NoOpLog
} from "miniflare";
import sourceMapSupport from "source-map-support";
import { createServer } from "./server.js";
import { isO2Verbose } from "../common/debug.js";
import { OXYGEN_COMPAT_PARAMS } from "../common/compat.js";
class MiniOxygen {
  miniflare;
  sourceMap;
  reloadListeners = [];
  workerName = "mini-oxygen-worker";
  currentWorkerConfig = {};
  fileWatcher;
  watchedFile;
  constructor({ sourceMap, globalFetch, ...options }, env) {
    this.sourceMap = sourceMap ?? false;
    if (sourceMap) {
      sourceMapSupport.install({ emptyCacheBetweenOperations: true });
    }
    const worker = {
      name: this.workerName,
      modules: options.modules !== void 0 ? options.modules : true,
      bindings: {
        ...env,
        ...options.bindings
      },
      // Apply oxygen compatibility params if not already set
      ...OXYGEN_COMPAT_PARAMS
    };
    if (options.script) {
      worker.script = options.script;
    } else if (options.scriptPath) {
      worker.script = fs.readFileSync(options.scriptPath, "utf-8");
      this.watchedFile = options.scriptPath;
    }
    this.currentWorkerConfig = worker;
    const {
      script,
      scriptPath,
      modules,
      bindings,
      buildCommand,
      buildWatchPaths,
      envPath,
      logUnhandledRejections,
      ...miniflareOptions
    } = options;
    const miniflareConfig = {
      verbose: isO2Verbose(),
      log: isO2Verbose() ? void 0 : new NoOpLog(),
      cf: false,
      workers: [worker],
      ...miniflareOptions
    };
    if (globalFetch) {
      this.globalFetch = globalFetch;
      worker.outboundService = async (request) => {
        return globalFetch(request.url);
      };
    }
    this.miniflare = new Miniflare(miniflareConfig);
    if (options.watch && this.watchedFile) {
      this.setupFileWatcher();
    }
  }
  async ready() {
    return this.miniflare.ready;
  }
  async dispatchFetch(request) {
    const response = await this.miniflare.dispatchFetch(request, {
      redirect: "manual"
    });
    return response;
  }
  async setOptions(options) {
    const {
      script,
      scriptPath,
      modules,
      bindings,
      globalFetch,
      ...otherOptions
    } = options;
    const worker = {
      ...this.currentWorkerConfig,
      name: this.workerName
    };
    if (script !== void 0) {
      worker.script = script;
    } else if (scriptPath !== void 0) {
      worker.script = fs.readFileSync(scriptPath, "utf-8");
      if (this.watchedFile !== scriptPath) {
        if (this.fileWatcher) {
          this.fileWatcher.close();
        }
        this.watchedFile = scriptPath;
        if (otherOptions.watch) {
          this.setupFileWatcher();
        }
      }
    }
    if (modules !== void 0) {
      worker.modules = modules;
    }
    if (bindings !== void 0) {
      worker.bindings = bindings;
    }
    const storedGlobalFetch = this.globalFetch;
    if (globalFetch !== void 0) {
      this.globalFetch = globalFetch;
    }
    if (!otherOptions.compatibilityDate && !worker.compatibilityDate) {
      Object.assign(worker, OXYGEN_COMPAT_PARAMS);
    }
    this.currentWorkerConfig = worker;
    const setOptionsConfig = {
      workers: [worker],
      ...otherOptions
    };
    const currentGlobalFetch = this.globalFetch;
    if (globalFetch !== void 0) {
      this.globalFetch = globalFetch;
    }
    const fetchToUse = globalFetch !== void 0 ? globalFetch : currentGlobalFetch;
    if (fetchToUse) {
      worker.outboundService = async (request) => {
        return fetchToUse(request.url);
      };
    }
    return this.miniflare.setOptions(setOptionsConfig);
  }
  async getPlugins() {
    await this.ready();
  }
  addEventListener(event, listener) {
    if (event === "reload") {
      this.reloadListeners.push(listener);
    }
  }
  async reload(options) {
    if (options) {
      const { env, ...otherOptions } = options;
      if (env) {
        await this.setOptions({
          ...otherOptions,
          bindings: env
        });
      } else {
        await this.setOptions(otherOptions);
      }
    }
    for (const listener of this.reloadListeners) {
      listener();
    }
  }
  setupFileWatcher() {
    if (!this.watchedFile) return;
    let debounceTimer = null;
    this.fileWatcher = watch(this.watchedFile, async (eventType) => {
      if (eventType === "change") {
        if (debounceTimer) clearTimeout(debounceTimer);
        debounceTimer = setTimeout(async () => {
          try {
            let retries = 3;
            let newScript = null;
            while (retries > 0 && !newScript) {
              if (fs.existsSync(this.watchedFile)) {
                try {
                  newScript = fs.readFileSync(this.watchedFile, "utf-8");
                  break;
                } catch (readErr) {
                  retries--;
                  if (retries > 0) {
                    await new Promise((resolve) => setTimeout(resolve, 50));
                  }
                }
              } else {
                retries--;
                if (retries > 0) {
                  await new Promise((resolve) => setTimeout(resolve, 50));
                }
              }
            }
            if (!newScript) {
              console.error(
                "Worker file not found or could not be read:",
                this.watchedFile
              );
              return;
            }
            await this.reload({ script: newScript });
          } catch (err) {
            console.error("Error reloading worker:", err);
          }
        }, 200);
      }
    });
  }
  async dispose() {
    if (this.fileWatcher) {
      this.fileWatcher.close();
    }
    return this.miniflare.dispose();
  }
  createServer(options) {
    return createServer(this, options);
  }
}
export {
  MiniOxygen
};
