import { ServerResponse } from 'node:http';
import { ViteDevServer } from 'vite';

declare function isEntrypointError(webResponse: Response): boolean;
type CustomEntryPointErrorHandler = (params: {
    optimizableDependency?: string;
    stack: string;
}) => void | Promise<{
    status?: number;
    body?: string;
    headers?: Record<string, string>;
} | void>;
declare function handleEntrypointError(viteDevServer: ViteDevServer, webResponse: Response, res: ServerResponse, entryPointErrorHandler?: CustomEntryPointErrorHandler): Promise<boolean>;

export { type CustomEntryPointErrorHandler, handleEntrypointError, isEntrypointError };
