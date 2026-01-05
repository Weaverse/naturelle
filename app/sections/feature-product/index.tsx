import type { HydrogenComponentSchema } from "@weaverse/hydrogen";
import type { RefObject } from "react";
import { Section, type SectionProps, sectionInspector } from "../atoms/Section";

type FeaturedProductsData = SectionProps;

const FeaturedProducts = ({
  ref,
  ...props
}: FeaturedProductsData & { ref?: RefObject<HTMLElement | null> }) => {
  let { children, ...rest } = props;

  return (
    <Section ref={ref} {...rest}>
      {children}
    </Section>
  );
};

export default FeaturedProducts;

export let schema: HydrogenComponentSchema = {
  type: "featured-products",
  title: "Featured products",
  settings: sectionInspector,
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
