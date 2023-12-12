import type {WeaverseClientArgs} from '@weaverse/hydrogen';
import {WeaverseClient} from '@weaverse/hydrogen';
import {components} from '~/weaverse/components';
import {themeSchema} from '~/weaverse/schema';

export function createWeaverseClient(args: WeaverseClientArgs) {
  return new WeaverseClient({
    ...args,
    themeSchema,
    components,
  });
}

export function getWeaverseCsp(request: Request) {
  const url = new URL(request.url);
  // Get weaverse host from query params
  const localDirectives =
    process.env.NODE_ENV === 'development'
      ? ['localhost:*', 'ws://localhost:*', 'ws://127.0.0.1:*']
      : [];
  const weaverseHost = url.searchParams.get('weaverseHost');
  const weaverseHosts = ['weaverse.io', '*.weaverse.io'];
  if (weaverseHost) {
    weaverseHosts.push(weaverseHost);
  }
  return {
    frameAncestors: weaverseHosts,
    defaultSrc: [
      "'self'",
      'cdn.shopify.com',
      'shopify.com',
      ...localDirectives,
      ...weaverseHosts,
    ],
    imgSrc: [
      "'self'",
      'data:',
      'cdn.shopify.com',
      ...localDirectives,
      ...weaverseHosts,
    ],
    styleSrc: [
      "'self'",
      "'unsafe-inline'",
      'cdn.shopify.com',
      ...localDirectives,
      ...weaverseHosts,
    ],
    connectSrc: [
      "'self'",
      'https://monorail-edge.shopifysvc.com',
      ...localDirectives,
      ...weaverseHosts,
    ],
  };
}
