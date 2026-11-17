import {
  getPaginationVariables,
  getSeoMeta,
  type SeoConfig,
} from "@shopify/hydrogen";
import type { SearchSortKeys } from "@shopify/hydrogen/storefront-api-types";
import {
  type LoaderFunctionArgs,
  type MetaFunction,
  redirect,
} from "react-router";
import { seoPayload } from "~/.server/seo";
import SearchResults from "~/components/search-results";
import { SEARCH_QUERY } from "~/graphql/queries";
import { PAGINATION_SIZE } from "~/utils/const";
import {
  clearFilterParams,
  clearPaginationParams,
  type SortParam,
} from "~/utils/filter";
import {
  getAppliedFilters,
  getFiltersFromSearchParams,
  getPriceRangeFilters,
} from "~/utils/product-filters";
import { skipRevalidationForCartActions } from "~/utils/revalidation";

export const shouldRevalidate = skipRevalidationForCartActions;

export async function loader({ request, context }: LoaderFunctionArgs) {
  const { storefront } = context;
  const searchParams = new URL(request.url).searchParams;
  const searchTerm = searchParams.get("q")?.trim() ?? "";

  if (!searchTerm) {
    const cleanSearchParams = new URLSearchParams(searchParams);
    cleanSearchParams.delete("q");
    clearFilterParams(cleanSearchParams);
    clearPaginationParams(cleanSearchParams);

    if (cleanSearchParams.toString() !== searchParams.toString()) {
      const url = new URL(request.url);
      const pathname = url.pathname.replace(/\.data$/i, "");
      const query = cleanSearchParams.toString();
      throw redirect(`${pathname}${query ? `?${query}` : ""}`);
    }

    return {
      productfilters: [],
      appliedFilters: [],
      seo: {
        title: "Search",
        description: "Search products",
      } satisfies SeoConfig,
      searchTerm,
      products: null,
      lowestPriceProduct: null,
      highestPriceProduct: null,
    };
  }
  const variables = getPaginationVariables(request, {
    pageBy: PAGINATION_SIZE,
  });
  const { sortKey, reverse } = getSearchSortValuesFromParam(
    searchParams.get("sort") as SortParam,
  );

  const filters = getFiltersFromSearchParams(searchParams);
  const priceRangeFilters = getPriceRangeFilters(filters);

  const productSearchData = await storefront.query(SEARCH_QUERY, {
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
  });

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
  };
}

export const meta: MetaFunction<typeof loader> = ({ data: loaderData }) => {
  return getSeoMeta(loaderData?.seo as SeoConfig);
};
export default function Search() {
  return <SearchResults />;
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
