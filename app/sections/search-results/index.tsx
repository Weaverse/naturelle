import { Pagination } from "@shopify/hydrogen";
import type { Filter } from "@shopify/hydrogen/storefront-api-types";
import { createSchema, type HydrogenComponentProps } from "@weaverse/hydrogen";
import { Suspense, useCallback, useEffect, useState } from "react";
import {
  Await,
  Form,
  useLoaderData,
  useLocation,
  useNavigate,
} from "react-router";
import type { ProductCardFragment } from "storefront-api.generated";
import { Button } from "~/components/button";
import {
  AppliedFilters,
  DrawerFilter,
  FiltersDrawer,
} from "~/components/drawer-filter";
import { Grid } from "~/components/grid";
import { IconSearch } from "~/components/icon";
import { Input } from "~/components/input";
import { ProductCard } from "~/components/product/product-card";
import { ProductSwimlane } from "~/components/product/product-swimlane";
import { PageHeader, Text } from "~/components/text";
import type { FeaturedData } from "~/routes/($locale).featured-products";
import type { loader as searchLoader } from "~/routes/($locale).search";
import { getImageLoadingPriority } from "~/utils/image";

interface SearchResultsProps extends HydrogenComponentProps {
  ref?: React.Ref<HTMLElement>;
  expandFilters?: boolean;
  showFiltersCount?: boolean;
  enableSwatches?: boolean;
  displayAsButtonFor?: string;
  filterItemsLimit?: number;
  checkboxShape?: "square" | "circle";
}

export default function SearchResults({
  ref,
  expandFilters = true,
  showFiltersCount = true,
  enableSwatches = true,
  displayAsButtonFor = "Size, More filters",
  filterItemsLimit = 10,
  checkboxShape = "square",
  ...props
}: SearchResultsProps) {
  const {
    searchTerm,
    products,
    noResultRecommendations,
    productfilters,
    appliedFilters,
    lowestPriceProduct,
    highestPriceProduct,
  } = useLoaderData<typeof searchLoader>();
  const noResults = Boolean(searchTerm && products?.nodes?.length === 0);
  const [displayedProductCount, setDisplayedProductCount] = useState(
    products.nodes.length,
  );
  const updateDisplayedProductCount = useCallback((count: number) => {
    setDisplayedProductCount(count);
  }, []);
  const location = useLocation();
  const navigate = useNavigate();
  const clearFiltersParams = new URLSearchParams();
  if (searchTerm) {
    clearFiltersParams.set("q", searchTerm);
  }
  const clearFiltersTo = `${location.pathname}?${clearFiltersParams.toString()}`;
  const lowestPrice = Number(
    lowestPriceProduct.nodes[0]?.priceRange.minVariantPrice.amount,
  );
  const highestPrice = Number(
    highestPriceProduct.nodes[0]?.priceRange.maxVariantPrice.amount,
  );
  const priceRange = {
    min: Number.isFinite(lowestPrice) ? lowestPrice : undefined,
    max: Number.isFinite(highestPrice) ? highestPrice : undefined,
  };
  const storefrontFilters = (productfilters as Filter[] | undefined) ?? [];

  return (
    <section ref={ref} {...props} className="bg-background-basic">
      <PageHeader variant="search">
        <div className="w-full flex flex-col items-center gap-6 px-4 md:px-6">
          <h1 className="w-full text-center text-3xl font-medium md:text-4xl lg:text-5xl">
            {searchTerm
              ? `Search results for “${searchTerm}”`
              : "Search our site"}
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
        </div>
      </PageHeader>
      <DrawerFilter
        showSearchSort
        appliedFilters={appliedFilters}
        productNumber={displayedProductCount}
        filters={storefrontFilters}
        priceRange={priceRange}
        expandFilters={expandFilters}
        showFiltersCount={showFiltersCount}
        enableSwatches={enableSwatches}
        displayAsButtonFor={displayAsButtonFor}
        filterItemsLimit={filterItemsLimit}
        checkboxShape={checkboxShape}
      />
      <div className="container flex items-start gap-5 px-5 py-8 md:px-6 lg:px-0">
        {noResults ? (
          <NoResults recommendations={noResultRecommendations} />
        ) : (
          <>
            <div className="hidden w-[320px] shrink-0 md:block">
              <div className="sticky top-(--height-nav) flex max-h-[calc(100vh-var(--height-nav)-20px)] flex-col overflow-x-hidden overflow-y-auto pr-5">
                <FiltersDrawer
                  desktop
                  filters={storefrontFilters}
                  appliedFilters={appliedFilters}
                  priceRange={priceRange}
                  expandFilters={expandFilters}
                  showFiltersCount={showFiltersCount}
                  enableSwatches={enableSwatches}
                  displayAsButtonFor={displayAsButtonFor}
                  filterItemsLimit={filterItemsLimit}
                  checkboxShape={checkboxShape}
                />
              </div>
            </div>
            <div className="min-w-0 flex-1 space-y-5 pb-12 lg:pb-20">
              <AppliedFilters
                filters={appliedFilters}
                clearTo={clearFiltersTo}
              />
              <Pagination connection={products}>
                {({
                  nodes,
                  isLoading,
                  NextLink,
                  PreviousLink,
                  hasNextPage,
                  hasPreviousPage,
                }) => (
                  <>
                    <DisplayedCountSync
                      count={nodes.length}
                      onChange={updateDisplayedProductCount}
                    />
                    {hasPreviousPage && (
                      <div className="mb-11 flex w-full items-center justify-center">
                        <Button as={PreviousLink} variant="outline">
                          {isLoading ? "Loading..." : "Previous"}
                        </Button>
                      </div>
                    )}
                    <Grid
                      data-test="product-grid"
                      layout="products"
                      className="w-full! gap-y-10!"
                    >
                      {nodes.map((product: ProductCardFragment, index) => (
                        <ProductCard
                          key={product.id}
                          product={product}
                          loading={getImageLoadingPriority(index)}
                          enableQuickView
                        />
                      ))}
                    </Grid>
                    {hasNextPage && (
                      <div className="my-11 flex w-full items-center justify-center">
                        <Button as={NextLink} variant="outline">
                          {isLoading ? "Loading..." : "Show more +"}
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </Pagination>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

function DisplayedCountSync({
  count,
  onChange,
}: {
  count: number;
  onChange: (count: number) => void;
}) {
  useEffect(() => {
    onChange(count);
  }, [count, onChange]);
  return null;
}

function NoResults({
  recommendations,
}: {
  recommendations: Promise<FeaturedData | null> | null;
}) {
  return (
    <div className="w-full space-y-10 py-4">
      <div>
        <Text className="opacity-50">No results, try a different search.</Text>
      </div>
      <Suspense>
        <Await
          errorElement="There was a problem loading related products"
          resolve={recommendations}
        >
          {(result) => {
            if (!result) {
              return null;
            }
            return (
              <ProductSwimlane
                title="Trending Products"
                featuredProducts={result.featuredProducts}
              />
            );
          }}
        </Await>
      </Suspense>
    </div>
  );
}

export const schema = createSchema({
  type: "search-results",
  title: "Search results",
  limit: 1,
  enabledOn: {
    pages: ["CUSTOM"],
  },
  settings: [
    {
      group: "Search filters",
      inputs: [
        {
          type: "switch",
          name: "expandFilters",
          label: "Expand filter groups",
          defaultValue: true,
        },
        {
          type: "switch",
          name: "showFiltersCount",
          label: "Show option counts",
          defaultValue: true,
        },
        {
          type: "switch",
          name: "enableSwatches",
          label: "Enable color swatches",
          defaultValue: true,
        },
        {
          type: "text",
          name: "displayAsButtonFor",
          label: "Display as buttons",
          defaultValue: "Size, More filters",
          helpText: "Enter filter names separated by commas.",
        },
        {
          type: "range",
          name: "filterItemsLimit",
          label: "Options shown before Show more",
          defaultValue: 10,
          configs: {
            min: 1,
            max: 30,
            step: 1,
          },
        },
        {
          type: "select",
          name: "checkboxShape",
          label: "Checkbox shape",
          configs: {
            options: [
              { value: "square", label: "Square" },
              { value: "circle", label: "Circle" },
            ],
          },
          defaultValue: "square",
        },
      ],
    },
  ],
});
