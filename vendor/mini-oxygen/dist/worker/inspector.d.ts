import { SourceMapConsumer } from 'source-map';
import { WebSocket } from 'ws';
import { Protocol } from 'devtools-protocol';

/**
 * Huge part of this code comes from Wrangler:
 * @see https://github.com/cloudflare/workers-sdk/blob/main/packages/wrangler/src/inspect.ts
 */

/**
 * @see https://chromedevtools.github.io/devtools-protocol/#endpoints
 */
interface InspectorWebSocketTarget {
    id: string;
    title: string;
    type: 'node';
    description?: string;
    webSocketDebuggerUrl: string;
    devtoolsFrontendUrl: string;
    devtoolsFrontendUrlCompat: string;
    faviconUrl: string;
    url: string;
}
type MessageData = {
    id: number;
    result: unknown;
} & ({
    method: 'Debugger.scriptParsed';
    params: Protocol.Debugger.ScriptParsedEvent;
} | {
    method: 'Runtime.consoleAPICalled';
    params: Protocol.Runtime.ConsoleAPICalledEvent;
} | {
    method: 'Runtime.exceptionThrown';
    params: Protocol.Runtime.ExceptionThrownEvent;
});
interface ErrorProperties {
    message?: string;
    cause?: unknown;
    stack?: string;
}
/**
 * Creates a connection to the workerd inspector.
 *
 * The messages are sent via WebSockets following the Chrome DevTools Protocol:
 * @see https://chromedevtools.github.io/devtools-protocol/
 *
 * The inspector connection has two purposes:
 * 1. Attach debuggers to the workerd instance.
 * 2. Ingest logs (e.g. user's `console.log` calls) from workerd into
 *    the main Node.js process, so that we can display them in the terminal.
 *
 * @param options - Options for the inspector.
 * @returns A connector for reconnecting to and closing the inspector.
 */
declare function createInspectorConnector(options: {
    privateInspectorPort: number;
    publicInspectorPort?: number;
    sourceMapPath: string;
    workerName: string;
}): {
    close(): Promise<void>;
    reconnect(onBeforeConnect?: () => void | Promise<void>): Promise<void>;
};
type InspectorConnection = ReturnType<typeof connectToInspector>;
interface InspectorOptions {
    /**
     * The websocket URL exposed by Workers that the inspector should connect to.
     */
    inspectorUrl: string;
    /**
     * Sourcemap path, so that stacktraces can be interpretted
     */
    sourceMapPath?: string | undefined;
}
declare function connectToInspector({ inspectorUrl, sourceMapPath }: InspectorOptions): {
    ws: WebSocket;
    send: <Request = unknown, Response = unknown>(method: string, params?: Request) => Promise<Response> | Promise<undefined>;
    reconstructError: (initialProperties: ErrorProperties, ro?: Protocol.Runtime.RemoteObject) => Promise<Error>;
    sourceMapPath: string | undefined;
    getSourceMapConsumer: () => Promise<SourceMapConsumer | undefined>;
    cleanupMessageQueue: (data: {
        id: number;
        result: unknown;
    }) => boolean;
    isClosed: () => boolean;
    close: () => void;
};

export { type ErrorProperties, type InspectorConnection, type InspectorWebSocketTarget, type MessageData, createInspectorConnector };
