import {Button} from '@/components/button';
import {Await, Form, useLoaderData} from '@remix-run/react';
import {getPaginationVariables, Pagination} from '@shopify/hydrogen';
import {ProductFilter} from '@shopify/hydrogen/storefront-api-types';
import {defer, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {DrawerFilter} from '~/components/DrawerFilter';
import {Grid} from '~/components/Grid';
import {IconSearch} from '~/components/Icon';
import {Input} from '~/components/Input';
import {ProductCard} from '~/components/ProductCard';
import {Heading, PageHeader, Section, Text} from '~/components/Text';
import {PRODUCT_CARD_FRAGMENT} from '~/data/fragments';
import {
  FILTER_URL_PREFIX,
  getImageLoadingPriority,
  PAGINATION_SIZE,
} from '~/lib/const';
import {seoPayload} from '~/lib/seo.server';
import {parseAsCurrency} from '~/lib/utils';
import {Suspense} from 'react';
import {
  getFeaturedData,
  type FeaturedData,
} from './($locale).featured-products';

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
      ...variables,
      country: storefront.i18n.country,
      language: storefront.i18n.language,
    },
  });
  let products = productSearch;

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

export default function Search() {
  const {
    searchTerm,
    products,
    noResultRecommendations,
    productfilters,
    appliedFilters,
  } = useLoaderData<typeof loader>();
  const noResults = products?.nodes?.length === 0;

  return (
    <>
      <PageHeader className="items-center justify-center bg-background-subtle-1">
        <Heading
          as="h1"
          size="display"
          className="flex items-center justify-center"
        >
          {searchTerm && `Search results for “${searchTerm}”`}
          {!searchTerm && 'Search our site'}
        </Heading>
        <Form
          method="get"
          className="relative flex w-full items-center justify-center"
        >
          <button
            type="submit"
            className="absolute left-0 ml-3 mt-2 cursor-pointer"
          >
            <IconSearch className=" !h-8 !w-8 opacity-55" viewBox="0 0 24 24" />
          </button>
          <Input
            defaultValue={searchTerm}
            name="q"
            placeholder="What are you looking for?"
            className="!w-[400px] !rounded border-2 border-bar-subtle !bg-inherit pl-11"
            type="search"
            variant="search"
          />
        </Form>
      </div>
      <div className="container">
        <DrawerFilter
          appliedFilters={appliedFilters}
          productNumber={products.nodes.length}
          filters={productfilters}
        >
          {!searchTerm || noResults ? (
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
                  />
                ));

                return (
                  <>
                    <div className="mt-6 flex items-center justify-center">
                      <Button as={PreviousLink} variant="secondary">
                        {isLoading ? 'Loading...' : 'Previous'}
                      </Button>
                    </div>
                    <Grid data-test="product-grid">{itemsMarkup}</Grid>
                    <div className="mt-6 flex items-center justify-center">
                      <Button as={NextLink} variant="secondary">
                        {isLoading ? 'Loading...' : 'Show more +'}
                      </Button>
                    </div>
                  </>
                );
              }}
            </Pagination>
          )}
        </DrawerFilter>
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
  const {products} = useLoaderData<typeof loader>();
  return (
    <>
      {noResults && (
        <Section padding="x">
          <Text className="opacity-50">
            No results, try a different search.
          </Text>
        </Section>
      )}
      <Suspense>
        <Await
          errorElement="There was a problem loading related products"
          resolve={recommendations}
        >
          {(result) => {
            if (!result) return null;
            // const { featuredCollections, featuredProducts } = result;

            return (
              <>
                {/* <FeaturedCollections
                  title="Trending Collections"
                  collections={featuredCollections}
                /> */}
                {/* <ProductSwimlane
                  title="Trending Products"
                  products={featuredProducts}
                /> */}
                <Section>
                  <Pagination connection={products}>
                    {({nodes, isLoading, NextLink, PreviousLink}) => {
                      const itemsMarkup = nodes.map(
                        (product: any, i: number) => (
                          <ProductCard
                            key={product.id}
                            product={product}
                            loading={getImageLoadingPriority(i)}
                          />
                        ),
                      );

                      return (
                        <>
                          <div className="mt-6 flex items-center justify-center">
                            <Button as={PreviousLink} variant="secondary">
                              {isLoading ? 'Loading...' : 'Previous'}
                            </Button>
                          </div>
                          <Grid data-test="product-grid">{itemsMarkup}</Grid>
                          <div className="mt-6 flex items-center justify-center">
                            <Button as={NextLink} variant="secondary">
                              {isLoading ? 'Loading...' : 'Show more +'}
                            </Button>
                          </div>
                        </>
                      );
                    }}
                  </Pagination>
                </Section>
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

const SEARCH_QUERYOLD = `#graphql
  query PaginatedProductsSearch(
    $country: CountryCode
    $endCursor: String
    $first: Int
    $language: LanguageCode
    $last: Int
    $searchTerm: String
    $startCursor: String
  ) @inContext(country: $country, language: $language) {
    products(
      first: $first,
      last: $last,
      before: $startCursor,
      after: $endCursor,
      sortKey: RELEVANCE,
      query: $searchTerm
    ) {
      nodes {
        ...ProductCard
      }
      pageInfo {
        startCursor
        endCursor
        hasNextPage
        hasPreviousPage
      }
    }
  }

  ${PRODUCT_CARD_FRAGMENT}
` as const;

const SEARCH_QUERY = `#graphql
  query PaginatedProductsSearch(
    $endCursor: String
    $first: Int
    $last: Int
    $searchTerm: String!
    $productFilters: [ProductFilter!]
    $startCursor: String
  ) {
    search(
      first: $first,
      last: $last,
      before: $startCursor,
      after: $endCursor,
      sortKey: RELEVANCE,
      query: $searchTerm
      productFilters: $productFilters
    ) {
      nodes {
        ...ProductCard
      }
      pageInfo {
        startCursor
        endCursor
        hasNextPage
        hasPreviousPage
      }
    }
  }

  ${PRODUCT_CARD_FRAGMENT}
` as const;

const FILTER_QUERY = `#graphql
query SearchFilter($query: String!)
{
  search(first: 0, query: $query) {
    productFilters {
      id
      label
      type
      values {
        id
        label
        count
        input
      }
    }
  }
}
`;
