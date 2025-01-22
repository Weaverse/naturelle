import {Button} from '~/components/button';
import {
  Await,
  Form,
  useLoaderData,
  useLocation,
  useNavigate,
  type MetaFunction,
} from '@remix-run/react';
import {
  getPaginationVariables,
  getSeoMeta,
  Pagination,
  type SeoConfig,
} from '@shopify/hydrogen';
import {ProductFilter} from '@shopify/hydrogen/storefront-api-types';
import {defer, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {DrawerFilter} from '~/components/DrawerFilter';
import {Grid} from '~/components/Grid';
import {IconSearch} from '~/components/Icon';
import {ProductCard} from '~/components/ProductCard';
import {ProductSwimlane} from '~/components/ProductSwimlane';
import {PageHeader, Text} from '~/components/Text';
import {
  FILTER_URL_PREFIX,
  getImageLoadingPriority,
  PAGINATION_SIZE,
} from '~/lib/utils/const';
import {SortParam} from '~/lib/utils/filter';
import {seoPayload} from '~/lib/seo.server';
import {parseAsCurrency} from '~/lib/utils';
import {Suspense} from 'react';
import {getSortValuesFromParam} from './($locale).collections.$handle';
import {
  getFeaturedData,
  type FeaturedData,
} from './($locale).featured-products';
import { Input } from '~/components/input';
import { FILTER_QUERY, SEARCH_QUERY } from '~/graphql/data/queries';

export async function loader({request, context}: LoaderFunctionArgs) {
  const {storefront} = context;
  const searchParams = new URL(request.url).searchParams;
  const searchTerm = searchParams.get('q')! || '';
  const variables = getPaginationVariables(request, {pageBy: PAGINATION_SIZE});
  const {search} = await storefront.query(FILTER_QUERY, {
    variables: {
      query: '',
    },
  });
  const {sortKey, reverse} = getSortValuesFromParam(
    searchParams.get('sort') as SortParam,
  );

  const filters = [...searchParams.entries()].reduce(
    (filters, [key, value]) => {
      if (key.startsWith(FILTER_URL_PREFIX)) {
        const filterKey = key.substring(FILTER_URL_PREFIX.length);
        filters.push({
          [filterKey]: JSON.parse(value),
        });
      }
      return filters;
    },
    [] as ProductFilter[],
  );

  const {search: productSearch} = await storefront.query(SEARCH_QUERY, {
    variables: {
      searchTerm,
      productFilters: filters,
      sortKey,
      reverse,
      ...variables,
      country: storefront.i18n.country,
      language: storefront.i18n.language,
    },
  });
  let products = productSearch;
  console.log('🚀 ~ productSearch:', productSearch);

  const locale = context.storefront.i18n;
  const allFilterValues = search.productFilters.flatMap(
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
        // eslint-disable-next-line no-console
        console.error('Could not find filter value for filter', filter);
        return null;
      }

      if (foundValue.id === 'filter.v.price') {
        // Special case for price, we want to show the min and max values as the label.
        const input = JSON.parse(foundValue.input as string) as ProductFilter;
        const min = parseAsCurrency(input.price?.min ?? 0, locale);
        const max = input.price?.max
          ? parseAsCurrency(input.price.max, locale)
          : '';
        const label = min && max ? `${min} - ${max}` : 'Price';

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
      id: 'search',
      title: 'Search',
      handle: 'search',
      descriptionHtml: 'Search results',
      description: 'Search results',
      seo: {
        title: 'Search',
        description: `Showing ${products.nodes.length} search results for "${searchTerm}"`,
      },
      metafields: [],
      products,
      updatedAt: new Date().toISOString(),
    },
  });

  return defer({
    productfilters: search?.productFilters,
    appliedFilters,
    seo,
    searchTerm,
    products,
    noResultRecommendations: shouldGetRecommendations
      ? getNoResultRecommendations(storefront)
      : Promise.resolve(null),
  });
}

export const meta: MetaFunction<typeof loader> = ({data}) => {
  return getSeoMeta(data!.seo as SeoConfig);
};
export default function Search() {
  const {
    searchTerm,
    products,
    noResultRecommendations,
    productfilters,
    appliedFilters,
  } = useLoaderData<typeof loader>();
  const noResults = searchTerm && products?.nodes?.length === 0;
  let location = useLocation();
  let navigate = useNavigate();

  return (
    <>
      <PageHeader variant="search" className="bg-[#e0e5d6]">
        <h1 className="w-full text-center text-3xl font-medium md:text-4xl lg:text-5xl">
          {searchTerm
            ? `Search results for “${searchTerm}”`
            : 'Search our site'}
        </h1>
        <Form
          method="get"
          className="relative flex w-full items-center justify-center"
        >
          <Input
            defaultValue={searchTerm}
            onClear={() => navigate(location.pathname)}
            name="q"
            placeholder="What are you looking for?"
            className="w-full rounded border-2 md:w-96 lg:w-[400px]"
            type="search"
            prefixElement={
              <button type="submit" className="cursor-pointer">
                <IconSearch
                  className="h-6 w-6 opacity-55"
                  viewBox="0 0 24 24"
                />
              </button>
            }
            variant="search"
          />
        </Form>
      </PageHeader>
      <DrawerFilter
        showSearchSort
        appliedFilters={appliedFilters}
        productNumber={products.totalCount}
        filters={productfilters}
      />
      <div className="px-4 container md:px-6">
        {noResults ? (
          <NoResults
            noResults={noResults}
            recommendations={noResultRecommendations}
          />
        ) : (
          <Pagination connection={products}>
            {({nodes, isLoading, NextLink, PreviousLink}) => {
              const itemsMarkup = nodes.map((product: any, i: number) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  loading={getImageLoadingPriority(i)}
                  quickAdd
                />
              ));

              return (
                <>
                  <div className="my-11 flex w-full items-center justify-center">
                    <Button as={PreviousLink} variant="outline">
                      {isLoading ? 'Loading...' : 'Previous'}
                    </Button>
                  </div>
                  <Grid
                    data-test="product-grid"
                    layout="products"
                    className="!gap-y-10"
                  >
                    {itemsMarkup}
                  </Grid>
                  <div className="my-11 flex w-full items-center justify-center">
                    <Button as={NextLink} variant="outline">
                      {isLoading ? 'Loading...' : 'Show more +'}
                    </Button>
                  </div>
                </>
              );
            }}
          </Pagination>
        )}
      </div>
    </>
  );
}

function NoResults({
  noResults,
  recommendations,
}: {
  noResults: boolean;
  recommendations: Promise<null | FeaturedData>;
}) {
  return (
    <>
      {noResults && (
        <div className="py-4">
          <Text className="opacity-50">
            No results, try a different search.
          </Text>
        </div>
      )}
      <Suspense>
        <Await
          errorElement="There was a problem loading related products"
          resolve={recommendations}
        >
          {(result) => {
            if (!result) return null;
            const {featuredCollections, featuredProducts} = result;

            return (
              <>
                {/* <FeaturedCollections
                  title="Trending Collections"
                  collections={featuredCollections}
                /> */}
                <ProductSwimlane
                  title="Trending Products"
                  featuredProducts={featuredProducts}
                />
              </>
            );
          }}
        </Await>
      </Suspense>
    </>
  );
}

export function getNoResultRecommendations(
  storefront: LoaderFunctionArgs['context']['storefront'],
) {
  return getFeaturedData(storefront, {pageBy: PAGINATION_SIZE});
}
