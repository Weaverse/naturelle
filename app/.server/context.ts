import { createHydrogenContext } from "@shopify/hydrogen";
import { WeaverseClient } from "@weaverse/hydrogen";
import { AppSession } from "~/.server/session";
import {
  CART_MUTATION_FRAGMENT,
  CART_QUERY_FRAGMENT,
} from "~/graphql/fragments";
import { getLocaleFromRequest } from "~/utils/locale";
import { components } from "~/weaverse/components";
import { themeSchema } from "~/weaverse/schema.server";

const additionalContext = {
  // Additional context for custom properties, CMS clients, 3P SDKs, etc.
} as const;

type AdditionalContextType = typeof additionalContext;

declare global {
  interface HydrogenAdditionalContext extends AdditionalContextType {}
}

/**
 * The context implementation is separate from server.ts
 * so that type can be extracted for AppLoadContext
 */
export async function createHydrogenRouterContext(
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

  const hydrogenContext = createHydrogenContext(
    {
      env,
      request,
      cache,
      waitUntil,
      session,
      i18n: getLocaleFromRequest(request),
      cart: {
        queryFragment: CART_QUERY_FRAGMENT,
        mutateFragment: CART_MUTATION_FRAGMENT,
      },
    },
    additionalContext,
  );

  const weaverse = new WeaverseClient({
    ...hydrogenContext,
    request,
    cache,
    themeSchema,
    components,
  });

  // Add weaverse directly to the hydrogenContext instance
  // This preserves the RouterContextProvider class instance
  Object.assign(hydrogenContext, { weaverse });

  return hydrogenContext;
}
