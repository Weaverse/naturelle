import { createHydrogenContext, type HydrogenCart } from "@shopify/hydrogen";
import { WeaverseClient } from "@weaverse/hydrogen";
import { CART_QUERY_FRAGMENT } from "~/graphql/data/fragments";
import { AppSession } from "~/lib/session";
import type { I18nLocale } from "~/lib/types/type-locale";
import { getLocaleFromRequest } from "~/lib/utils";
import { components } from "~/weaverse/components";
import { themeSchema } from "~/weaverse/schema.server";

/**
 * The context implementation is separate from server.ts
 * so that type can be extracted for AppLoadContext
 * */
export async function createAppLoadContext(
  request: Request,
  env: Env,
  executionContext: ExecutionContext,
) {
  /**
   * Open a cache instance in the worker and a custom session instance.
   */
  if (!env?.SESSION_SECRET) {
    throw new Error("SESSION_SECRET environment variable is not set");
  }

  const waitUntil = executionContext.waitUntil.bind(executionContext);
  const [cache, session] = await Promise.all([
    caches.open("hydrogen"),
    AppSession.init(request, [env.SESSION_SECRET]),
  ]);

  const hydrogenContext = createHydrogenContext<
    AppSession,
    HydrogenCart,
    I18nLocale
  >({
    env,
    request,
    cache,
    waitUntil,
    session,
    i18n: getLocaleFromRequest(request),
    cart: {
      queryFragment: CART_QUERY_FRAGMENT,
    },
  });

  /*
   * Use Object.assign to preserve the prototype chain of the hydrogenContext
   * which is required for React Router v7 middleware integration.
   */
  Object.assign(hydrogenContext, {
    weaverse: new WeaverseClient({
      ...hydrogenContext,
      request,
      cache,
      themeSchema,
      components,
    }),
  });

  return hydrogenContext;
}
