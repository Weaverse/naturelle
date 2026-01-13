import {
  getPaginationVariables,
  getSeoMeta,
  type SeoConfig,
} from "@shopify/hydrogen";
import type { LoaderFunctionArgs, MetaFunction } from "react-router";
import { data as response } from "react-router";
import invariant from "tiny-invariant";
import { seoPayload } from "~/.server/seo";
import { ALL_PRODUCTS_QUERY } from "~/graphql/queries";
import { routeHeaders } from "~/utils/cache";
import { PAGINATION_SIZE } from "~/utils/const";
import { WeaverseContent } from "~/weaverse";

export const headers = routeHeaders;

export async function loader({
  request,
  context: { storefront, weaverse },
}: LoaderFunctionArgs) {
  const variables = getPaginationVariables(request, {
    pageBy: PAGINATION_SIZE,
  });

  const data = await storefront.query(ALL_PRODUCTS_QUERY, {
    variables: {
      ...variables,
      country: storefront.i18n.country,
      language: storefront.i18n.language,
    },
  });

  invariant(data, "No data returned from Shopify API");

  const seo = seoPayload.collection({
    url: request.url,
    collection: {
      id: "all-products",
      title: "All Products",
      handle: "products",
      descriptionHtml: "All the store products",
      description: "All the store products",
      seo: {
        title: "All Products",
        description: "All the store products",
      },
      metafields: [],
      products: data.products,
      updatedAt: "",
    },
  });

  return response({
    products: data.products,
    seo,
    weaverseData: await weaverse.loadPage({
      type: "ALL_PRODUCTS",
    }),
  });
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return getSeoMeta(data?.seo as SeoConfig);
};
export default function AllProducts() {
  return <WeaverseContent />;
}
