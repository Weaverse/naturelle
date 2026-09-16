import {
  AnalyticsPageType,
  flattenConnection,
  getPaginationVariables,
  getSeoMeta,
  type SeoConfig,
} from "@shopify/hydrogen";
import type { ProductCollectionSortKeys } from "@shopify/hydrogen/storefront-api-types";
import type { MetaFunction } from "react-router";
import { data, type LoaderFunctionArgs } from "react-router";
import invariant from "tiny-invariant";
import { redirectIfHandleIsLocalized } from "~/.server/redirect";
import { seoPayload } from "~/.server/seo";
import { COLLECTION_QUERY } from "~/graphql/queries";
import { routeHeaders } from "~/utils/cache";
import { PAGINATION_SIZE } from "~/utils/const";
import type { SortParam } from "~/utils/filter";
import {
  getAppliedFilters,
  getFiltersFromSearchParams,
  getPriceRangeFilters,
} from "~/utils/product-filters";
import { WeaverseContent } from "~/weaverse";

export const headers = routeHeaders;

export async function loader({ params, request, context }: LoaderFunctionArgs) {
  const paginationVariables = getPaginationVariables(request, {
    pageBy: PAGINATION_SIZE,
  });
  const { handle } = params;
  const locale = context.storefront.i18n;

  invariant(handle, "Missing collectionHandle param");

  const searchParams = new URL(request.url).searchParams;

  const { sortKey, reverse } = getSortValuesFromParam(
    searchParams.get("sort") as SortParam,
  );
  const filters = getFiltersFromSearchParams(searchParams);
  const priceRangeFilters = getPriceRangeFilters(filters);

  const [shopAndCollections, weaverseData] = await Promise.all([
    context.storefront.query(COLLECTION_QUERY, {
      variables: {
        ...paginationVariables,
        handle: handle,
        filters,
        priceRangeFilters,
        sortKey,
        reverse,
        country: context.storefront.i18n.country,
        language: context.storefront.i18n.language,
      },
    }),
    context.weaverse.loadPage({
      type: "COLLECTION",
      handle: handle,
    }),
  ]);

  const { collection, collections } = shopAndCollections;

  if (!collection) {
    throw new Response("collection", { status: 404 });
  }

  // Redirect if handle is localized
  redirectIfHandleIsLocalized(request, { handle, data: collection });

  const seo = seoPayload.collection({ collection, url: request.url });

  const allFilterValues = collection.products.filters.flatMap(
    (filter: any) => filter.values,
  );

  const appliedFilters = getAppliedFilters({
    filters,
    availableFilterValues: allFilterValues,
    locale,
  });

  return data({
    collection,
    appliedFilters,
    collections: flattenConnection(collections),
    analytics: {
      pageType: AnalyticsPageType.collection,
      handle,
      resourceId: collection.id,
    },
    seo,
    weaverseData,
  });
}

export const meta: MetaFunction<typeof loader> = ({ data: loaderData }) => {
  return getSeoMeta(loaderData?.seo as SeoConfig);
};
export default function Collection() {
  return <WeaverseContent />;
}

export function getSortValuesFromParam(
  sortParam: SortParam | null,
  defaultSort: "alphabetical" | "relevance" = "alphabetical",
): {
  sortKey: ProductCollectionSortKeys;
  reverse: boolean;
} {
  switch (sortParam) {
    case "alphabetical-a-z":
      return {
        sortKey: "TITLE",
        reverse: false,
      };
    case "alphabetical-z-a":
      return {
        sortKey: "TITLE",
        reverse: true,
      };
    case "price-high-low":
      return {
        sortKey: "PRICE",
        reverse: true,
      };
    case "price-low-high":
      return {
        sortKey: "PRICE",
        reverse: false,
      };
    case "best-selling":
      return {
        sortKey: "BEST_SELLING",
        reverse: false,
      };
    case "newest":
      return {
        sortKey: "CREATED",
        reverse: true,
      };
    case "oldest":
      return {
        sortKey: "CREATED",
        reverse: false,
      };
    case "featured":
      return {
        sortKey: "MANUAL",
        reverse: false,
      };
    default:
      return defaultSort === "relevance"
        ? { sortKey: "RELEVANCE", reverse: false }
        : { sortKey: "TITLE", reverse: false };
  }
}
