import type { LoaderFunctionArgs } from "react-router";
import { data } from "react-router";
import { CACHE_LONG } from "~/utils/cache";
import { skipRevalidationForCartActions } from "~/utils/revalidation";

export const shouldRevalidate = skipRevalidationForCartActions;

export async function loader({ context }: LoaderFunctionArgs) {
  return data(context.localization.availableLocales, {
    headers: {
      "cache-control": CACHE_LONG,
    },
  });
}

// no-op
export default function CountriesApiRoute() {
  return null;
}
