import { createElement } from "react";
import { renderToString } from "react-dom/server";
import storefront from "../../server";

// Used only by check-dev-runtime.mjs, never by the production entry point.
// Importing the real server exercises its complete SSR module graph.
export default {
  async fetch(request: Request, env: Env, context: ExecutionContext) {
    if (new URL(request.url).pathname === "/__naturelle_runtime_probe") {
      // Exercise the real fetch handler without querying a merchant store.
      // A generic HTTP 500 is insufficient: require the exact config guard.
      const errors: unknown[] = [];
      const reportError = console.error;
      console.error = (...items: unknown[]) => errors.push(...items);
      let response: Response;
      try {
        response = await storefront.fetch(
          request,
          { ...env, SESSION_SECRET: "" },
          context,
        );
      } finally {
        console.error = reportError;
      }
      const guarded =
        response.status === 500 &&
        errors.some(
          (error) =>
            error instanceof Error &&
            error.message === "SESSION_SECRET environment variable is not set",
        );
      if (!guarded) {
        for (const error of errors) {
          reportError(error);
        }
        throw new Error(
          "Storefront fetch did not reach its configuration guard",
        );
      }
      return Response.json({
        serverConfigurationGuard: true,
        html: renderToString(
          createElement("p", null, "Naturelle runtime check"),
        ),
      });
    }
    return storefront.fetch(request, env, context);
  },
};
