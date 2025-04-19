import { useLoaderData } from "@remix-run/react";
import { Pagination } from "@shopify/hydrogen";
import type { Filter } from "@shopify/hydrogen/storefront-api-types";
import type { HydrogenComponentSchema } from "@weaverse/hydrogen";
import { type VariantProps, cva } from "class-variance-authority";
import { forwardRef } from "react";
import { useInView } from "react-intersection-observer";
import type { CollectionDetailsQuery } from "storefrontapi.generated";
import { DrawerFilter } from "~/components/DrawerFilter";
import { Button } from "~/components/button";
import { cn } from "~/lib/utils";
import type { AppliedFilter } from "~/lib/utils/filter";
import { ProductsLoadedOnScroll } from "./products-loaded-on-scroll";

interface CollectionFiltersProps extends VariantProps<typeof variants> {}
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

let CollectionFilters = forwardRef<HTMLElement, CollectionFiltersProps>(
  (props, sectionRef) => {
    let { width, gap, ...rest } = props;
    let { ref, inView } = useInView();
    let { collection, collections, appliedFilters } = useLoaderData<
      CollectionDetailsQuery & {
        collections: Array<{ handle: string; title: string }>;
        appliedFilters: AppliedFilter[];
      }
    >();

    let productNumber = collection?.products.nodes.length;

    if (collection?.products && collections) {
      return (
        <section ref={sectionRef} {...rest}>
          <DrawerFilter
            productNumber={productNumber}
            filters={collection.products.filters as Filter[]}
            appliedFilters={appliedFilters}
            collections={collections}
          />
          <div className={cn(variants({ gap, width, padding: width }))}>
            <Pagination connection={collection.products}>
              {({
                nodes,
                isLoading,
                PreviousLink,
                NextLink,
                nextPageUrl,
                hasNextPage,
                state,
              }) => (
                <div className="flex flex-col w-full items-center justify-center lg:!mt-16 mt-9">
                  <Button
                    as={PreviousLink}
                    variant="outline"
                    className="!mb-14"
                  >
                    <span className="font-heading font-light">
                      {isLoading ? "Loading..." : "Load previous"}
                    </span>
                  </Button>
                  <ProductsLoadedOnScroll
                    nodes={nodes}
                    inView={inView}
                    nextPageUrl={nextPageUrl}
                    hasNextPage={hasNextPage}
                    state={state}
                  />
                  <Button as={NextLink} variant="outline" className="!mt-14">
                    <span className="font-heading font-light my-0.5">
                      {isLoading ? "Loading..." : "Show more +"}
                    </span>
                  </Button>
                </div>
              )}
            </Pagination>
          </div>
        </section>
      );
    }
    return <section ref={ref} {...rest} />;
  },
);

export default CollectionFilters;

export let schema: HydrogenComponentSchema = {
  type: "collection-filters",
  title: "Collection filters",
  limit: 1,
  enabledOn: {
    pages: ["COLLECTION"],
  },
  toolbar: ["general-settings"],
  inspector: [
    {
      group: "Collection filters",
      inputs: [
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
};
