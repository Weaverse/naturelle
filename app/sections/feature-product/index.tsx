import { createSchema } from "@weaverse/hydrogen";
import type { RefObject } from "react";
import {
  Section,
  type SectionProps,
  sectionInspector,
} from "~/components/section";

type FeaturedProductsData = SectionProps;

const FeaturedProducts = ({
  ref,
  ...props
}: FeaturedProductsData & { ref?: RefObject<HTMLElement | null> }) => {
  let { children, ...rest } = props;

  return (
    <Section
      ref={ref}
      {...rest}
      overflow="unset"
      style={{
        ...rest.style,
        backgroundColor: "var(--color-background-basic)",
      }}
      containerClassName="lg:max-w-page flex flex-col gap-10 lg:gap-16 [&>.heading]:!mb-0"
    >
      {children}
    </Section>
  );
};

export default FeaturedProducts;

export const schema = createSchema({
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
});
