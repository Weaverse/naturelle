import type { Filter } from "@shopify/hydrogen/storefront-api-types";
import { useTranslation } from "@weaverse/hydrogen";
import { Form, useLoaderData, useLocation, useNavigate } from "react-router";
import type { ProductCardFragment } from "storefront-api.generated";
import { Button } from "~/components/button";
import { Grid } from "~/components/grid";
import { IconSearch } from "~/components/icon";
import { Input } from "~/components/input";
import { ProductCard } from "~/components/product/product-card";
import { ProductListingFilterToolbar } from "~/components/product-listing/filter-toolbar";
import { ProductListingPagination } from "~/components/product-listing/pagination";
import { PageHeader, Text } from "~/components/text";
import type { loader as searchLoader } from "~/routes/($locale).search";
import { getImageLoadingPriority } from "~/utils/image";

export default function SearchResults() {
  const { t } = useTranslation();
  const {
    searchTerm,
    products,
    productfilters,
    appliedFilters,
    lowestPriceProduct,
    highestPriceProduct,
  } = useLoaderData<typeof searchLoader>();
  const noResults = Boolean(searchTerm && products?.nodes?.length === 0);
  const location = useLocation();
  const navigate = useNavigate();
  const clearFiltersParams = new URLSearchParams();
  if (searchTerm) {
    clearFiltersParams.set("q", searchTerm);
  }
  const clearFiltersTo = `${location.pathname}?${clearFiltersParams.toString()}`;
  const lowestPrice = Number(
    lowestPriceProduct?.nodes[0]?.priceRange.minVariantPrice.amount,
  );
  const highestPrice = Number(
    highestPriceProduct?.nodes[0]?.priceRange.maxVariantPrice.amount,
  );
  const priceRange = {
    min: Number.isFinite(lowestPrice) ? lowestPrice : undefined,
    max: Number.isFinite(highestPrice) ? highestPrice : undefined,
  };
  const storefrontFilters = (productfilters as Filter[] | undefined) ?? [];

  if (!products) {
    return null;
  }

  return (
    <section className="bg-background-basic">
      <PageHeader variant="search">
        <div className="flex w-full flex-col items-center gap-6 px-6">
          <h1 className="w-full text-center text-3xl font-medium md:text-4xl lg:text-5xl">
            {searchTerm
              ? t("search.resultsFor", { term: searchTerm })
              : t("search.title")}
          </h1>
          <Form
            method="get"
            className="relative flex w-full items-center justify-center"
          >
            <Input
              defaultValue={searchTerm}
              onClear={() => navigate(location.pathname)}
              name="q"
              placeholder={t("search.placeholder")}
              className="w-full rounded-xl border border-border-subtle bg-background-basic p-3! md:w-[560px]"
              type="search"
              prefixElement={
                <button
                  type="submit"
                  aria-label={t("search.title")}
                  className="cursor-pointer"
                >
                  <IconSearch
                    aria-hidden="true"
                    className="size-6"
                    viewBox="0 0 24 24"
                  />
                </button>
              }
              variant="search"
            />
          </Form>
        </div>
      </PageHeader>
      <ProductListingFilterToolbar
        showSearchSort
        appliedFilters={appliedFilters}
        productNumber={products.totalCount}
        filters={storefrontFilters}
        priceRange={priceRange}
        expandFilters
        showFiltersCount
        enableSwatches
        displayAsButtonFor="Size, More filters"
        filterItemsLimit={10}
        checkboxShape="square"
        clearFiltersTo={clearFiltersTo}
        contentClassName="min-w-0 flex-1 space-y-5 pb-12 lg:pb-20"
      >
        {noResults ? (
          <NoResults />
        ) : (
          <ProductListingPagination
            connection={products}
            renderPrevious={({ PreviousLink, isLoading }) => (
              <div className="mb-11 flex w-full items-center justify-center">
                <Button as={PreviousLink} variant="outline">
                  {isLoading ? t("system.loading") : t("search.loadPrevious")}
                </Button>
              </div>
            )}
            renderNext={({ NextLink, isLoading }) => (
              <div className="my-11 flex w-full items-center justify-center">
                <Button as={NextLink} variant="outline">
                  {isLoading ? t("system.loading") : t("search.loadMore")}
                </Button>
              </div>
            )}
            renderPageContent={({ nodes }) => (
              <Grid
                data-test="product-grid"
                layout="products"
                className="w-full! gap-3!"
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
            )}
          />
        )}
      </ProductListingFilterToolbar>
    </section>
  );
}

function NoResults() {
  const { t } = useTranslation();
  return (
    <div className="w-full py-4">
      <Text className="opacity-50">{t("search.empty")}</Text>
    </div>
  );
}
