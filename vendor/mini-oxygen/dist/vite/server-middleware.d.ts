import { ViteDevServer } from 'vite';
import { RequestHook, createMiniOxygen } from '../worker/index.js';
import { CustomEntryPointErrorHandler } from './entry-error.js';
import 'miniflare';
import '../worker/assets.js';
import 'http';
import 'node:http';
import '../worker/handler.js';

declare const WARMUP_PATHNAME = "/__vite_warmup";
type InternalMiniOxygenOptions = {
    /**
     * A compatibility date to choose a version of the Oxygen worker.
     */
    compatibilityDate?: string;
    /**
     * A function called asynchronously when the worker gets a response.
     */
    requestHook?: RequestHook;
    /**
     * Allows setting up global state in the worker process
     * that can optionally run code from the parent process.
     */
    crossBoundarySetup?: Array<{
        /**
         * Function that is stringified and runs in the worker.
         */
        script: () => void;
        binding?: never;
    } | {
        /**
         * Function that is stringified and runs in the worker.
         * It gets the binding function as its first argument.
         */
        script: (binding: (...args: unknown[]) => Promise<unknown | void>) => void;
        /**
         * The binding function that runs in the parent process.
         */
        binding: (...args: unknown[]) => unknown | Promise<unknown> | void;
    }>;
    /**
     * Callback that runs when detecting a dependency that can be optimized in Vite.
     */
    entryPointErrorHandler?: CustomEntryPointErrorHandler;
};
type MiniOxygenViteOptions = InternalMiniOxygenOptions & {
    viteDevServer: ViteDevServer;
    entry: string;
    env?: {
        [key: string]: string;
    };
    debug?: boolean;
    inspectorPort?: number;
    logRequestLine?: null | RequestHook;
};
type MiniOxygen = ReturnType<typeof createMiniOxygen>;
declare function startMiniOxygenRuntime({ viteDevServer, env, debug, inspectorPort, crossBoundarySetup, entry: workerEntryFile, requestHook, logRequestLine, compatibilityDate, }: MiniOxygenViteOptions): MiniOxygen;
declare function setupOxygenMiddleware(viteDevServer: ViteDevServer, getEntryPointErrorHandler?: () => CustomEntryPointErrorHandler | undefined): void;
declare function getViteUrl(viteDevServer: ViteDevServer): string | undefined;

export { type InternalMiniOxygenOptions, type MiniOxygen, type MiniOxygenViteOptions, WARMUP_PATHNAME, getViteUrl, setupOxygenMiddleware, startMiniOxygenRuntime };
