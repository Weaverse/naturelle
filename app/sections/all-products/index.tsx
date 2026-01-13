import { Pagination } from "@shopify/hydrogen";
import type { HydrogenComponentSchema } from "@weaverse/hydrogen";
import { createSchema } from "@weaverse/hydrogen";
import type { RefObject } from "react";
import { Children } from "react";
import { useLoaderData } from "react-router";
import type { AllProductsQuery } from "storefront-api.generated";
import { Button } from "~/components/button";
import { Grid } from "~/components/grid";
import { ProductCard } from "~/components/product/product-card";
import { layoutInputs, Section, type SectionProps } from "~/components/section";
import { getImageLoadingPriority } from "~/utils/image";

interface AllProductsProps extends SectionProps {
  heading: string;
  ref?: React.Ref<HTMLElement>;
}

export default function AllProducts(props: AllProductsProps) {
  const { ref, heading, children, ...rest } = props;
  const { products } = useLoaderData<AllProductsQuery>();

  return (
    <Section ref={ref} {...rest}>
      {Boolean(Children.count(children)) && <div>{children}</div>}
      <Pagination connection={products}>
        {({ nodes, isLoading, NextLink, PreviousLink }) => {
          const itemsMarkup = nodes.map((product, i) => (
            <ProductCard
              quickAdd
              key={product.id}
              product={product}
              loading={getImageLoadingPriority(i)}
            />
          ));

          return (
            <div className="flex flex-col items-center justify-center gap-11">
              <Button as={PreviousLink} variant="outline">
                <span className="font-heading font-light">
                  {isLoading ? "Loading..." : "Load previous"}
                </span>
              </Button>
              <Grid
                className="gap-y-10!"
                layout="products"
                data-test="product-grid"
              >
                {itemsMarkup}
              </Grid>
              <Button as={NextLink} variant="outline">
                <span className="font-heading font-light">
                  {isLoading ? "Loading..." : "Show more +"}
                </span>
              </Button>
            </div>
          );
        }}
      </Pagination>
    </Section>
  );
}

export const schema = createSchema({
  type: "all-products",
  title: "All products",
  limit: 1,
  enabledOn: {
    pages: ["ALL_PRODUCTS"],
  },
  settings: [
    {
      group: "All products",
      inputs: layoutInputs.filter(({ name }) => name !== "borderRadius"),
    },
  ],
  childTypes: ["heading"],
  presets: {
    children: [
      {
        type: "heading",
        content: "All products",
      },
    ],
  },
});
