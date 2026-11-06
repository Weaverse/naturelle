import { MiniOxygenServerOptions, DispatchFetch } from './server.js';
import { fetch } from 'miniflare';
export { Request, Response, fetch } from 'miniflare';
import 'http';
import 'node:http';
import '../common/headers.js';

type MiniOxygenOptions = Partial<{
    log(message: string): unknown;
    workerFile?: string;
    script?: string;
    rootPath: string;
    watch: boolean;
    modules: boolean;
    buildCommand: string;
    buildWatchPaths: string[];
    sourceMap: boolean;
    envPath: string;
    env: {
        [key: string]: unknown;
    };
    globalFetch?: typeof fetch;
}>;
type MiniOxygenCreateServerOptions = MiniOxygenServerOptions & {
    port?: number;
};
type MiniOxygenPreviewOptions = MiniOxygenOptions & MiniOxygenCreateServerOptions;
interface MiniOxygenPublicInstance {
    ready: () => Promise<void>;
    dispatchFetch: DispatchFetch;
    dispose: () => Promise<void>;
    reload: (options?: Partial<Pick<MiniOxygenPreviewOptions, 'env' | 'script'>>) => Promise<void>;
    createServer: (opts: MiniOxygenCreateServerOptions) => Promise<{
        port: number;
        close: () => Promise<void>;
    }>;
}
declare function createMiniOxygen(opts: MiniOxygenOptions): MiniOxygenPublicInstance;
declare function startServer(opts: MiniOxygenPreviewOptions): Promise<{
    port: number;
    reload: (options?: Partial<Pick<MiniOxygenPreviewOptions, "env" | "script">>) => Promise<void>;
    close: () => Promise<void>;
}>;

export { type MiniOxygenCreateServerOptions, type MiniOxygenOptions, type MiniOxygenPreviewOptions, createMiniOxygen, startServer };
