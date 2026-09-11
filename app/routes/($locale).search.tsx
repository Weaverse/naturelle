import {
  getPaginationVariables,
  getSeoMeta,
  type SeoConfig,
} from "@shopify/hydrogen";
import type {
  ProductFilter,
  SearchSortKeys,
} from "@shopify/hydrogen/storefront-api-types";
import type { LoaderFunctionArgs, MetaFunction } from "react-router";
import { seoPayload } from "~/.server/seo";
import { SEARCH_QUERY } from "~/graphql/queries";
import { FILTER_URL_PREFIX, PAGINATION_SIZE } from "~/utils/const";
import type { SortParam } from "~/utils/filter";
import { parseAsCurrency } from "~/utils/locale";
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

  const filters = [...searchParams.entries()].reduce((acc, [key, value]) => {
    if (key.startsWith(FILTER_URL_PREFIX)) {
      const filterKey = key.substring(FILTER_URL_PREFIX.length);
      acc.push({
        [filterKey]: JSON.parse(value),
      });
    }
    return acc;
  }, [] as ProductFilter[]);
  const priceRangeFilters = filters.filter((filter) => !filter.price);

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
  // todo merge into 1 function
  const appliedFilters = filters
    .map((filter) => {
      const foundValue = allFilterValues.find((value: any) => {
        const valueInput = JSON.parse(value.input as string) as ProductFilter;
        // special case for price, the user can enter something freeform (still a number, though)
        // that may not make sense for the locale/currency.
        // Basically just check if the price filter is applied at all.
        if (valueInput.price && filter.price) {
          return true;
        }
        return (
          // This comparison should be okay as long as we're not manipulating the input we
          // get from the API before using it as a URL param.
          JSON.stringify(valueInput) === JSON.stringify(filter)
        );
      });
      if (!foundValue) {
        if (filter.variantOption) {
          return {
            filter,
            label: filter.variantOption.value,
          };
        }
        // eslint-disable-next-line no-console
        console.error("Could not find filter value for filter", filter);
        return null;
      }

      if (foundValue.id === "filter.v.price") {
        // Special case for price, we want to show the min and max values as the label.
        const input = JSON.parse(foundValue.input as string) as ProductFilter;
        const min = parseAsCurrency(input.price?.min ?? 0, locale);
        const max = input.price?.max
          ? parseAsCurrency(input.price.max, locale)
          : "";
        const label = min && max ? `${min} - ${max}` : "Price";

        return {
          filter,
          label,
        };
      }
      return {
        filter,
        label: foundValue.label,
      };
    })
    .filter((filter): filter is NonNullable<typeof filter> => filter !== null);

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
