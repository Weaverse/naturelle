import * as miniflare from 'miniflare';
import { SharedOptions, CORE_PLUGIN, Request, Response } from 'miniflare';
export { Request, RequestInit, Response, ResponseInit, fetch } from 'miniflare';
export { buildAssetsUrl } from './assets.js';
import { RequestHookInfo } from './handler.js';
import 'http';
import 'node:http';

type AssetOptions = {
    /** Directory to serve files. If omitted, no asset server is created. */
    directory: string;
    /** Port to serve files from. Defaults to 9100. */
    port?: number;
    origin?: never;
} | {
    directory?: never;
    port?: never;
    /** Optional origin for an external asset server. */
    origin: string;
};
type InputMiniflareOptions = Omit<SharedOptions, 'cf'> & {
    workers: Array<typeof CORE_PLUGIN.options._output & {
        name: string;
    }>;
};
type ReloadableOptions = Pick<MiniOxygenOptions, 'workers'>;
type GetNewOptions = (previousOptions: ReloadableOptions) => ReloadableOptions | Promise<ReloadableOptions>;
type MiniOxygenOptions = InputMiniflareOptions & {
    /**
     * Allows attaching a debugger to the worker instance.
     * @default false
     */
    debug?: boolean;
    /**
     * Path to the source map file to use in debuggers, if needed.
     * @default undefined
     */
    sourceMapPath?: string;
    /**
     * Allows serving static assets from a directory or another origin.
     * @default undefined
     */
    assets?: AssetOptions;
    /**
     * Hook into requests and responses. Useful for debugging and logging.
     * @default undefined
     */
    requestHook?: RequestHook | null;
    /**
     * Name of the worker used for attaching a debugger.
     * @default undefined The first worker in the array is used.
     */
    inspectWorkerName?: string;
};
type MiniOxygenInstance = ReturnType<typeof createMiniOxygen>;
/**
 * Creates a MiniOxygen instance using the Workers runtime (workerd).
 *
 * @param options - Options for the MiniOxygen instance.
 * @returns A MiniOxygen instance.
 */
declare function createMiniOxygen({ debug, inspectorPort, assets, sourceMapPath, requestHook, inspectWorkerName, ...miniflareOptions }: MiniOxygenOptions): {
    ready: Promise<{
        workerUrl: URL;
        inspectorUrl: URL | undefined;
    }>;
    dispatchFetch: (request: Request) => Promise<Response>;
    getBindings: <Env = Record<string, unknown>>(workerName?: string) => Promise<Env>;
    getCaches: () => Promise<miniflare.ReplaceWorkersTypes<CacheStorage>>;
    getWorker: (workerName?: string) => Promise<miniflare.ReplaceWorkersTypes<Fetcher>>;
    reload(getNewOptions?: GetNewOptions): Promise<void>;
    dispose(): Promise<void>;
    readonly isDisposed: boolean;
};
type RequestHook = (info: RequestHookInfo) => void | Promise<void>;
declare const defaultLogRequestLine: RequestHook;

export { type MiniOxygenInstance, type MiniOxygenOptions, type RequestHook, RequestHookInfo, createMiniOxygen, defaultLogRequestLine };
