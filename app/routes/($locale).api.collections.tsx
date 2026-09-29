import { CacheNone } from "@shopify/hydrogen";
import { data, type LoaderFunctionArgs } from "react-router";
import { COLLECTIONS_QUERY } from "~/graphql/queries";

export function shouldRevalidate() {
  return false;
}

export async function loader({ context }: LoaderFunctionArgs) {
  const { collections } = await context.storefront.query(COLLECTIONS_QUERY, {
    cache: CacheNone(),
    variables: { first: 6 },
  });

  return data(
    { collections },
    { headers: { "Cache-Control": "public, max-age=60" } },
  );
}
