import { type LoaderFunctionArgs, data } from "@shopify/remix-oxygen";
import invariant from "tiny-invariant";
import { FEATURED_ITEMS_QUERY } from "~/graphql/data/queries";

export async function loader({ context: { storefront } }: LoaderFunctionArgs) {
  return data(await getFeaturedData(storefront));
}

export async function getFeaturedData(
  storefront: LoaderFunctionArgs["context"]["storefront"],
  variables: { pageBy?: number } = {},
) {
  const data = await storefront.query(FEATURED_ITEMS_QUERY, {
    variables: {
      pageBy: 12,
      country: storefront.i18n.country,
      language: storefront.i18n.language,
      ...variables,
    },
  });

  invariant(data, "No featured items data returned from Shopify API");

  return data;
}

export type FeaturedData = Awaited<ReturnType<typeof getFeaturedData>>;
