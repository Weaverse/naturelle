import * as http from 'http';
import { IncomingMessage, ServerResponse } from 'node:http';

/**
 * Returns a URL to the static assets server.
 */
declare function buildAssetsUrl(assetsPort: number): string;
/**
 * Creates a server that serves static assets from the build directory.
 * Mimics Shopify CDN URLs for Oxygen v2.
 * Note: this is not used when running with Vite because it already
 * serves transformed assets before reaching MiniOxygen.
 * See the following for more details:
 * @see https://github.com/Shopify/hydrogen/pull/2078#issuecomment-2121705993
 */
declare function createAssetsServer(assetsDirectory: string): http.Server<typeof IncomingMessage, typeof ServerResponse>;
declare const STATIC_ASSET_EXTENSIONS: readonly string[];

export { STATIC_ASSET_EXTENSIONS, buildAssetsUrl, createAssetsServer };
