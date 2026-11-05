import { AddressInfo } from 'node:net';
import { InspectorConnection } from './inspector.js';
import 'source-map';
import 'ws';
import 'devtools-protocol';

type InspectorProxy = ReturnType<typeof createInspectorProxy>;
/**
 * Creates a proxy server that forwards messages between the local
 * debugger (e.g. VSCode, Browser DevTools) and the Workerd inspector.
 * It also serves a custom in-browser DevTools UI for MiniOxygen by
 * proxying the Cloudflare DevTools (used in Wrangler / Miniflare),
 * and fixes a few issues related to serving this tool locally.
 *
 */
declare function createInspectorProxy(port: number, newInspectorConnection: InspectorConnection): {
    ready: Promise<AddressInfo>;
    close(): Promise<void>;
    updateInspectorConnection(newConnection: InspectorConnection): void;
};

export { type InspectorProxy, createInspectorProxy };
