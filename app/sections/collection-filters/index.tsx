import { Pagination } from "@shopify/hydrogen";
import type { Filter } from "@shopify/hydrogen/storefront-api-types";
import { createSchema } from "@weaverse/hydrogen";
import { cva, type VariantProps } from "class-variance-authority";
import { type RefObject, useCallback, useState } from "react";
import { useInView } from "react-intersection-observer";
import { useLoaderData } from "react-router";
import type { CollectionDetailsQuery } from "storefront-api.generated";
import { Button } from "~/components/button";
import {
  AppliedFilters,
  DrawerFilter,
  FiltersDrawer,
} from "~/components/drawer-filter";
import { cn } from "~/utils/cn";
import type { AppliedFilter } from "~/utils/filter";
import { ProductsLoadedOnScroll } from "./products-loaded-on-scroll";

interface CollectionFiltersProps extends VariantProps<typeof variants> {
  expandFilters?: boolean;
  showFiltersCount?: boolean;
  enableSwatches?: boolean;
  displayAsButtonFor?: string;
  filterItemsLimit?: number;
  checkboxShape?: "square" | "circle";
}
let variants = cva("relative lg:pb-20 pb-12", {
  variants: {
    width: {
      full: "w-full h-full",
      stretch: "w-full h-full",
      fixed: "w-full h-full max-w-[var(--page-width,1440px)] mx-auto",
    },
    padding: {
      full: "",
      stretch: "px-3 md:px-10 lg:px-16",
      fixed: "px-3 md:px-4 lg:px-0 mx-auto",
    },
    gap: {
      0: "",
      4: "space-y-1",
      8: "space-y-2",
      12: "space-y-3",
      16: "space-y-4",
      20: "space-y-5",
      24: "space-y-3 lg:space-y-6",
      28: "space-y-3.5 lg:space-y-7",
      32: "space-y-4 lg:space-y-8",
      36: "space-y-4 lg:space-y-9",
      40: "space-y-5 lg:space-y-10",
      44: "space-y-5 lg:space-y-11",
      48: "space-y-6 lg:space-y-12",
      52: "space-y-6 lg:space-y-[52px]",
      56: "space-y-7 lg:space-y-14",
      60: "space-y-7 lg:space-y-[60px]",
    },
  },
});

let CollectionFilters = ({
  ref: sectionRef,
  ...props
}: CollectionFiltersProps & { ref?: RefObject<HTMLElement | null> }) => {
  let {
    width,
    gap,
    expandFilters = true,
    showFiltersCount = true,
    enableSwatches = true,
    displayAsButtonFor = "Size, More filters",
    filterItemsLimit = 10,
    checkboxShape = "square",
    ...rest
  } = props;
  let { ref, inView } = useInView();
  let { collection, collections, appliedFilters } = useLoaderData<
    CollectionDetailsQuery & {
      collections: Array<{ handle: string; title: string }>;
      appliedFilters: AppliedFilter[];
    }
  >();

  const [productNumber, setProductNumber] = useState(
    collection?.products.nodes.length ?? 0,
  );
  const updateProductNumber = useCallback((count: number) => {
    setProductNumber(count);
  }, []);
  const lowestPrice = Number(
    collection.lowestPriceProduct.nodes[0]?.priceRange.minVariantPrice.amount,
  );
  const highestPrice = Number(
    collection.highestPriceProduct.nodes[0]?.priceRange.maxVariantPrice.amount,
  );
  const priceRange = {
    min: Number.isFinite(lowestPrice) ? lowestPrice : undefined,
    max: Number.isFinite(highestPrice) ? highestPrice : undefined,
  };
  const storefrontFilters =
    (collection?.products.filters as Filter[] | undefined) ?? [];

  if (collection?.products && collections) {
    return (
      <section ref={sectionRef} {...rest} className="bg-background-basic">
        <DrawerFilter
          productNumber={productNumber}
          filters={storefrontFilters}
          appliedFilters={appliedFilters}
          collections={collections}
          priceRange={priceRange}
          expandFilters={expandFilters}
          showFiltersCount={showFiltersCount}
          enableSwatches={enableSwatches}
          displayAsButtonFor={displayAsButtonFor}
          filterItemsLimit={filterItemsLimit}
          checkboxShape={checkboxShape}
        />
        <div
          className={cn(
            "mx-auto flex w-full max-w-page items-start gap-5 px-5 py-8 md:flex-row md:px-6 lg:px-0",
            width === "full" && "max-w-none",
            width === "stretch" && "max-w-none lg:px-16",
          )}
        >
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
          <div className={cn(variants({ gap }), "min-w-0 flex-1")}>
            <AppliedFilters filters={appliedFilters} />
            <Pagination connection={collection.products}>
              {({
                nodes,
                isLoading,
                PreviousLink,
                NextLink,
                nextPageUrl,
                hasNextPage,
                hasPreviousPage,
                state,
              }) => (
                <div className="flex w-full flex-col items-center justify-center">
                  {hasPreviousPage && (
                    <Button
                      as={PreviousLink}
                      variant="outline"
                      className="mb-14!"
                    >
                      <span className="font-heading font-light">
                        {isLoading ? "Loading..." : "Load previous"}
                      </span>
                    </Button>
                  )}
                  <ProductsLoadedOnScroll
                    nodes={nodes}
                    onDisplayedCountChange={updateProductNumber}
                    collection={{
                      title: collection.title,
                      handle: collection.handle,
                    }}
                    inView={inView}
                    nextPageUrl={nextPageUrl}
                    hasNextPage={hasNextPage}
                    state={state}
                  />
                  {hasNextPage && (
                    <Button as={NextLink} variant="outline" className="mt-14!">
                      <span className="font-heading font-light my-0.5">
                        {isLoading ? "Loading..." : "Show more +"}
                      </span>
                    </Button>
                  )}
                </div>
              )}
            </Pagination>
          </div>
        </div>
      </section>
    );
  }
  return <section ref={ref} {...rest} />;
};

export default CollectionFilters;

export const schema = createSchema({
  type: "collection-filters",
  title: "Collection filters",
  limit: 1,
  enabledOn: {
    pages: ["COLLECTION"],
  },
  settings: [
    {
      group: "Collection filters",
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
        {
          type: "select",
          name: "width",
          label: "Content width",
          configs: {
            options: [
              { value: "full", label: "Full page" },
              { value: "stretch", label: "Stretch" },
              { value: "fixed", label: "Fixed" },
            ],
          },
          defaultValue: "fixed",
        },
        {
          type: "range",
          name: "gap",
          label: "Items spacing",
          configs: {
            min: 0,
            max: 60,
            step: 4,
            unit: "px",
          },
          defaultValue: 20,
        },
      ],
    },
  ],
});
