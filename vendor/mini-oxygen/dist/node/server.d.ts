import * as http from 'http';
import { Request, Response, fetch } from 'miniflare';
export { Request, Response, fetch } from 'miniflare';
import http$1 from 'node:http';
import { OXYGEN_HEADERS_MAP } from '../common/headers.js';

type DispatchFetch = (request: Request) => Promise<Response>;
interface MiniOxygenServerHooks {
    onRequest?: (request: Request, defaultDispatcher: DispatchFetch) => void | Response | Promise<void | Response>;
    onResponse?: (request: Request, response: Response) => void | Promise<void>;
    onResponseError?: (request: Request, error: unknown) => void;
}
type OxygenHeaderParams = keyof typeof OXYGEN_HEADERS_MAP;
interface MiniOxygenServerOptions extends MiniOxygenServerHooks {
    assetsDir?: string;
    autoReload?: boolean;
    publicPath?: string;
    proxyServer?: string;
    oxygenHeaders?: Partial<{
        [key in OxygenHeaderParams]: string;
    }>;
}
declare function createServer(mf: MiniOxygen, { assetsDir, publicPath, autoReload, proxyServer, ...rest }: MiniOxygenServerOptions): http$1.Server<typeof http$1.IncomingMessage, typeof http$1.ServerResponse>;

type MiniOxygenOptions = {
    sourceMap?: boolean;
    globalFetch?: typeof fetch;
    script?: string;
    scriptPath?: string;
    modules?: boolean;
    bindings?: Record<string, unknown>;
    buildCommand?: string;
    buildWatchPaths?: string[];
    envPath?: string;
    watch?: boolean;
    logUnhandledRejections?: boolean;
    [key: string]: any;
};
declare class MiniOxygen {
    private miniflare;
    private sourceMap;
    private reloadListeners;
    private workerName;
    private currentWorkerConfig;
    private fileWatcher?;
    private watchedFile?;
    constructor({ sourceMap, globalFetch, ...options }: MiniOxygenOptions, env: {
        [key: string]: unknown;
    });
    ready(): Promise<URL>;
    dispatchFetch(request: Request): Promise<Response>;
    setOptions(options: Partial<MiniOxygenOptions> & {
        bindings?: Record<string, unknown>;
    }): Promise<void>;
    getPlugins(): Promise<void>;
    addEventListener(event: string, listener: () => void): void;
    reload(options?: Partial<MiniOxygenOptions> & {
        bindings?: Record<string, unknown>;
        env?: Record<string, unknown>;
    }): Promise<void>;
    private setupFileWatcher;
    dispose(): Promise<void>;
    createServer(options: MiniOxygenServerOptions): http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;
}

export { type DispatchFetch, MiniOxygen as M, type MiniOxygenServerHooks, type MiniOxygenServerOptions, type OxygenHeaderParams, type MiniOxygenOptions as a, createServer };
