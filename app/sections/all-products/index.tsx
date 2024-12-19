import { Button } from "~/components/button";
import { useLoaderData } from "@remix-run/react";
import { Pagination } from "@shopify/hydrogen";
import type {
  HydrogenComponentProps,
  HydrogenComponentSchema,
} from "@weaverse/hydrogen";
import { Grid } from "~/components/Grid";
import { ProductCard } from "~/components/ProductCard";
import { getImageLoadingPriority } from "~/lib/const";
import { Children, forwardRef } from "react";
import type { AllProductsQuery } from "storefrontapi.generated";
import { layoutInputs, Section, SectionProps } from "../atoms/Section";

interface AllProductsProps extends HydrogenComponentProps {
  heading: string;
}

let AllProducts = forwardRef<HTMLElement, AllProductsProps & SectionProps>(
  (props, ref) => {
    let { heading, children, ...rest } = props;
    let { products } = useLoaderData<AllProductsQuery>();

    return (
      <Section ref={ref} {...rest}>
        {!!Children.count(children) && <div>{children}</div>}
        <Pagination connection={products}>
          {({ nodes, isLoading, NextLink, PreviousLink }) => {
            let itemsMarkup = nodes.map((product, i) => (
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
                  className="!gap-y-10"
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
);

export default AllProducts;

export let schema: HydrogenComponentSchema = {
  type: "all-products",
  title: "All products",
  limit: 1,
  enabledOn: {
    pages: ["ALL_PRODUCTS"],
  },
  toolbar: ["general-settings"],
  inspector: [
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
};
