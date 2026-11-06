import { PreviewServer } from 'vite';
import { MiniOxygenRuntimeOptions } from './environment.js';
import './server-middleware.js';
import '../worker/index.js';
import 'miniflare';
import '../worker/assets.js';
import 'http';
import 'node:http';
import '../worker/handler.js';
import './entry-error.js';

type OxygenPreviewOptions = {
    /**
     * Built worker module used by `vite preview`.
     * Defaults to the detected server output entry, then dist/server/index.js.
     */
    previewEntry?: string;
};
type PreviewRuntimePluginOptions = OxygenPreviewOptions & Partial<Pick<MiniOxygenRuntimeOptions, 'env' | 'inspectorPort' | 'logRequestLine' | 'debug'>>;
declare function setupOxygenPreviewServer(previewServer: PreviewServer, pluginOptions: PreviewRuntimePluginOptions, apiOptions: MiniOxygenRuntimeOptions): Promise<() => void>;

export { type OxygenPreviewOptions, setupOxygenPreviewServer };
