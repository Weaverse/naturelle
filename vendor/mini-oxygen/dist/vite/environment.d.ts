import { FetchableDevEnvironment, ResolvedConfig, ViteDevServer } from 'vite';
import { MiniOxygenViteOptions, InternalMiniOxygenOptions } from './server-middleware.js';
import '../worker/index.js';
import 'miniflare';
import '../worker/assets.js';
import 'http';
import 'node:http';
import '../worker/handler.js';
import './entry-error.js';

type MiniOxygenRuntimeOptions = Partial<Pick<MiniOxygenViteOptions, 'entry' | 'env' | 'inspectorPort' | 'logRequestLine' | 'debug'>> & InternalMiniOxygenOptions & {
    envPromise?: Promise<Record<string, any>>;
};
type EnvOptions = {
    env?: Record<string, any>;
    envPromise?: Promise<Record<string, any>>;
};
declare function hasProvidedEnvBindings(options: EnvOptions): boolean;
type RuntimeOptionsResolver = (options: MiniOxygenRuntimeOptions, viteDevServer: ViteDevServer) => Promise<MiniOxygenViteOptions>;
type MiniOxygenDevEnvironment = FetchableDevEnvironment & {
    configureRuntime(options: MiniOxygenRuntimeOptions): void;
};
declare function mergeMiniOxygenRuntimeOptions(current: MiniOxygenRuntimeOptions, next: MiniOxygenRuntimeOptions): MiniOxygenRuntimeOptions;
declare function createMiniOxygenDevEnvironment(name: string, config: ResolvedConfig, runtimeOptions: MiniOxygenRuntimeOptions, resolveRuntimeOptions: RuntimeOptionsResolver): MiniOxygenDevEnvironment;

export { type MiniOxygenDevEnvironment, type MiniOxygenRuntimeOptions, createMiniOxygenDevEnvironment, hasProvidedEnvBindings, mergeMiniOxygenRuntimeOptions };
