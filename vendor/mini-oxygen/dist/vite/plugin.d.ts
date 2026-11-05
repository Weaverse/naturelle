import { Plugin } from 'vite';
import { MiniOxygenRuntimeOptions } from './environment.js';
export { MiniOxygenDevEnvironment } from './environment.js';
import { MiniOxygenViteOptions } from './server-middleware.js';
import { OxygenPreviewOptions } from './preview.js';
import '../worker/index.js';
import 'miniflare';
import '../worker/assets.js';
import 'http';
import 'node:http';
import '../worker/handler.js';
import './entry-error.js';

type OxygenPluginOptions = Partial<Pick<MiniOxygenViteOptions, 'entry' | 'env' | 'inspectorPort' | 'logRequestLine' | 'debug'>> & OxygenPreviewOptions;
type OxygenApiOptions = MiniOxygenRuntimeOptions;
/**
 * For internal use only.
 * @private
 */
type OxygenPlugin = Plugin<{
    registerPluginOptions(newOptions: OxygenApiOptions): void;
}>;

/**
 * Runs backend code in an Oxygen worker instead of Node.js during development.
 * If used with `remix`, place it before it in the Vite plugin list.
 */
declare function oxygen(pluginOptions?: OxygenPluginOptions): Plugin[];

export { type OxygenPlugin, type OxygenPluginOptions, oxygen };
