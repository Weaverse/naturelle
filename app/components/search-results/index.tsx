import type { Filter } from "@shopify/hydrogen/storefront-api-types";
import { useTranslation } from "@weaverse/hydrogen";
import { Form, useLoaderData, useLocation, useNavigate } from "react-router";
import type { ProductCardFragment } from "storefront-api.generated";
import { Button } from "~/components/button";
import { Grid } from "~/components/grid";
import { IconSearch } from "~/components/icon";
import { Input } from "~/components/input";
import { Link } from "~/components/link";
import { ProductCard } from "~/components/product/product-card";
import { ProductListingFilterToolbar } from "~/components/product-listing/filter-toolbar";
import { ProductListingPagination } from "~/components/product-listing/pagination";
import { PageHeader } from "~/components/text";
import type { loader as searchLoader } from "~/routes/($locale).search";
import { FILTER_URL_PREFIX } from "~/utils/const";
import { clearFilterParams, clearPaginationParams } from "~/utils/filter";
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
  const location = useLocation();
  const navigate = useNavigate();
  const searchFormParams = new URLSearchParams(location.search);
  searchFormParams.delete("q");
  clearPaginationParams(searchFormParams);
  const hasAppliedFilterParams = [...searchFormParams.keys()].some((key) =>
    key.startsWith(FILTER_URL_PREFIX),
  );
  const noResults =
    products?.totalCount === 0 && Boolean(searchTerm || hasAppliedFilterParams);

  const clearFiltersParams = new URLSearchParams(location.search);
  clearFilterParams(clearFiltersParams);
  clearPaginationParams(clearFiltersParams);
  const clearFiltersQuery = clearFiltersParams.toString();
  const clearFiltersTo = `${location.pathname}${clearFiltersQuery ? `?${clearFiltersQuery}` : ""}`;

  const clearSearch = () => {
    const nextParams = new URLSearchParams(location.search);
    nextParams.delete("q");
    clearFilterParams(nextParams);
    clearPaginationParams(nextParams);
    const query = nextParams.toString();
    navigate(`${location.pathname}${query ? `?${query}` : ""}`, {
      preventScrollReset: true,
    });
  };
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

  return (
    <section className="bg-background-basic">
      <PageHeader variant="search">
        <div className="flex w-full flex-col items-center gap-6 px-6">
          <h1 className="h2 w-full text-center font-normal text-text">
            {!searchTerm
              ? t("search.title")
              : noResults
                ? t("search.noResultsFor", { term: searchTerm })
                : t("search.resultsFor", {
                    count: products?.totalCount ?? 0,
                    term: searchTerm,
                  })}
          </h1>
          <Form
            method="get"
            className="relative flex w-full items-center justify-center"
          >
            {[...searchFormParams.entries()].map(([name, value], index) => (
              <input
                key={`${name}-${value}-${index}`}
                type="hidden"
                name={name}
                value={value}
              />
            ))}
            <Input
              defaultValue={searchTerm}
              onClear={clearSearch}
              clearLabel={t("accessibility.clearSearch")}
              name="q"
              placeholder={t("search.placeholder")}
              className="w-full rounded-xl border border-border-subtle bg-background-basic px-3 py-3.5 md:w-[560px]"
              type="search"
              prefixElement={
                <button type="submit" aria-label={t("search.title")}>
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
          {!searchTerm && (
            <p className="text-center text-base text-text-subtle">
              {t("search.emptyPrompt")}
            </p>
          )}
          {noResults &&
            (hasAppliedFilterParams ? (
              <div className="flex flex-col items-center gap-3 text-center text-base text-text-subtle">
                <p>{t("search.noResultsWithFilters")}</p>
                <Link
                  to={clearFiltersTo}
                  className="text-text underline underline-offset-4"
                >
                  {t("search.clearFilters")}
                </Link>
              </div>
            ) : (
              <p className="text-center text-base text-text-subtle">
                {t("search.noResultsHint")}
              </p>
            ))}
        </div>
      </PageHeader>
      {products && !noResults && (
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
          <ProductListingPagination
            connection={products}
            renderPrevious={({ PreviousLink, isLoading }) => (
              <div className="mb-11 flex w-full items-center justify-center">
                <Button
                  as={PreviousLink}
                  variant="outline"
                  className="font-normal"
                >
                  {isLoading ? t("system.loading") : t("search.loadPrevious")}
                </Button>
              </div>
            )}
            renderNext={({ NextLink, isLoading }) => (
              <div className="my-11 flex w-full items-center justify-center">
                <Button as={NextLink} variant="outline" className="font-normal">
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
        </ProductListingFilterToolbar>
      )}
    </section>
  );
}
