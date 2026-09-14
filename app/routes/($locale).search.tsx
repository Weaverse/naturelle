import {
  getPaginationVariables,
  getSeoMeta,
  type SeoConfig,
} from "@shopify/hydrogen";
import type { SearchSortKeys } from "@shopify/hydrogen/storefront-api-types";
import type { LoaderFunctionArgs, MetaFunction } from "react-router";
import { seoPayload } from "~/.server/seo";
import { SEARCH_QUERY } from "~/graphql/queries";
import { PAGINATION_SIZE } from "~/utils/const";
import type { SortParam } from "~/utils/filter";
import {
  getAppliedFilters,
  getFiltersFromSearchParams,
  getPriceRangeFilters,
} from "~/utils/product-filters";
import { validateWeaverseData, WeaverseContent } from "~/weaverse";
import { getFeaturedData } from "./($locale).featured-products";

export async function loader({ request, context }: LoaderFunctionArgs) {
  const { storefront } = context;
  const searchParams = new URL(request.url).searchParams;
  const searchTerm = searchParams.get("q") ?? "";
  const variables = getPaginationVariables(request, {
    pageBy: PAGINATION_SIZE,
  });
  const { sortKey, reverse } = getSearchSortValuesFromParam(
    searchParams.get("sort") as SortParam,
  );

  const filters = getFiltersFromSearchParams(searchParams);
  const priceRangeFilters = getPriceRangeFilters(filters);

  const [productSearchData, weaverseData] = await Promise.all([
    storefront.query(SEARCH_QUERY, {
      variables: {
        searchTerm,
        productFilters: filters,
        priceRangeFilters,
        sortKey,
        reverse,
        ...variables,
        country: storefront.i18n.country,
        language: storefront.i18n.language,
      },
    }),
    context.weaverse.loadPage({
      type: "CUSTOM",
    }),
  ]);

  validateWeaverseData(weaverseData);

  const { search: productSearch } = productSearchData;
  const products = productSearch;

  const locale = context.storefront.i18n;
  const allFilterValues = products.productFilters.flatMap(
    (filter: any) => filter.values,
  );
  const appliedFilters = getAppliedFilters({
    filters,
    availableFilterValues: allFilterValues,
    locale,
  });

  const shouldGetRecommendations = !searchTerm || products?.nodes?.length === 0;

  const seo = seoPayload.collection({
    url: request.url,
    collection: {
      id: "search",
      title: "Search",
      handle: "search",
      descriptionHtml: "Search results",
      description: "Search results",
      seo: {
        title: "Search",
        description: `Showing ${products.nodes.length} search results for "${searchTerm}"`,
      },
      metafields: [],
      products,
      updatedAt: new Date().toISOString(),
    },
  });

  return {
    productfilters: products.productFilters,
    appliedFilters,
    seo,
    searchTerm,
    products,
    lowestPriceProduct: productSearchData.lowestPriceProduct,
    highestPriceProduct: productSearchData.highestPriceProduct,
    weaverseData,
    noResultRecommendations: shouldGetRecommendations
      ? await getNoResultRecommendations(storefront)
      : null,
  };
}

export const meta: MetaFunction<typeof loader> = ({ data: loaderData }) => {
  return getSeoMeta(loaderData?.seo as SeoConfig);
};
export default function Search() {
  return <WeaverseContent />;
}

export function getNoResultRecommendations(
  storefront: LoaderFunctionArgs["context"]["storefront"],
) {
  return getFeaturedData(storefront, { pageBy: PAGINATION_SIZE });
}

function getSearchSortValuesFromParam(sortParam: SortParam | null): {
  sortKey: SearchSortKeys;
  reverse: boolean;
} {
  switch (sortParam) {
    case "price-high-low":
      return { sortKey: "PRICE", reverse: true };
    case "price-low-high":
      return { sortKey: "PRICE", reverse: false };
    default:
      return { sortKey: "RELEVANCE", reverse: false };
  }
}
