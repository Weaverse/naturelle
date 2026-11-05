type Service = {
    fetch: typeof fetch;
};
type MiniOxygenHandlerEnv = {
    entry: Service;
    assets?: Service;
    hook?: Service;
    staticAssetExtensions?: string[];
    oxygenHeadersMap: Record<string, string>;
};
declare function getMiniOxygenHandlerScript(): string;
type RequestHookOptions = {
    handleRequest: () => Response | Promise<Response>;
    request: Request;
    headers?: Record<string, string>;
    context: ExecutionContext;
    hook: Service;
};
/**
 * @public
 */
type RequestHookInfo = {
    request: {
        url: string;
        method: string;
        headers: Record<string, string>;
    };
    response: {
        status: number;
        statusText: string;
        headers: Record<string, string>;
    };
    meta: {
        startTimeMs: number;
        endTimeMs: number;
        durationMs: number;
    };
};
declare function withRequestHook({ handleRequest, request, headers, hook, context, }: RequestHookOptions): Promise<Response>;

export { type MiniOxygenHandlerEnv, type RequestHookInfo, getMiniOxygenHandlerScript, withRequestHook };
