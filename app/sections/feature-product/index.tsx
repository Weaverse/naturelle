import type { HydrogenComponentSchema } from "@weaverse/hydrogen";
import { forwardRef } from "react";
import { Section, type SectionProps, sectionInspector } from "../atoms/Section";

type FeaturedProductsData = SectionProps;

const FeaturedProducts = forwardRef<HTMLElement, FeaturedProductsData>(
  (props, ref) => {
    let { children, ...rest } = props;

    return (
      <Section ref={ref} {...rest}>
        {children}
      </Section>
    );
  },
);

export default FeaturedProducts;

export let schema: HydrogenComponentSchema = {
  type: "featured-products",
  title: "Featured products",
  inspector: sectionInspector,
  toolbar: ["general-settings", ["duplicate", "delete"]],
  childTypes: ["heading", "featured-products--list"],
  presets: {
    children: [
      {
        type: "heading",
        content: "Best Sellers",
      },
      {
        type: "featured-products--list",
      },
    ],
  },
};
