/// <reference types="vite/client" />
/// <reference types="@shopify/oxygen-workers-types" />

// Enhance TypeScript's built-in typings.
import "@total-typescript/ts-reset";
import type { HydrogenEnv, HydrogenSessionData } from "@shopify/hydrogen";
import type { WeaverseClient } from "@weaverse/hydrogen";
import type { createAppLoadContext } from "./app/lib/utils/context";

declare global {
  /**
   * A global `process` object is only available during build to access NODE_ENV.
   */
  const process: { env: { NODE_ENV: "production" | "development" } };

  interface Env extends HydrogenEnv {
    // declare additional Env parameter use in the fetch handler and Remix loader context here
    PUBLIC_GOOGLE_GTM_ID: string;
    JUDGEME_PRIVATE_API_TOKEN: string;
    PRODUCT_CUSTOM_DATA_METAFIELD: string;
  }
}

import type { Storefront } from "~/lib/types/type-locale";

declare module "react-router" {
  interface AppLoadContext
    extends Awaited<ReturnType<typeof createAppLoadContext>> {
    // to change context type, change the return of createAppLoadContext() instead
    weaverse: WeaverseClient;
    storefront: Storefront;
  }

  // TODO: remove this once we've migrated our loaders to `Route.ActionArgs`
  interface LoaderFunctionArgs {
    context: AppLoadContext;
  }

  // TODO: remove this once we've migrated our loaders to `Route.ActionArgs`
  interface ActionFunctionArgs {
    context: AppLoadContext;
  }

  interface SessionData extends HydrogenSessionData {
    // declare local additions to the Remix session data here
  }
}

declare global {
  interface Window {
    dataLayer: any[];
  }
}
