import { createSchema } from "@weaverse/hydrogen";
import type { RefObject } from "react";
import { layoutInputs, Section, type SectionProps } from "~/components/section";
import { cn } from "~/utils/cn";

type FeaturedProductsData = SectionProps;

const FeaturedProducts = ({
  ref,
  ...props
}: FeaturedProductsData & { ref?: RefObject<HTMLElement | null> }) => {
  let { children, className, containerClassName, style, ...rest } = props;

  return (
    <Section
      ref={ref}
      {...rest}
      overflow="unset"
      className={cn(className, "max-sm:px-5")}
      containerClassName={cn(containerClassName, "max-sm:space-y-10")}
      style={{
        ...style,
        backgroundColor: "var(--color-background-basic)",
      }}
    >
      {children}
    </Section>
  );
};

export default FeaturedProducts;

export const schema = createSchema({
  type: "featured-products",
  title: "Featured products",
  settings: [{ group: "Layout", inputs: layoutInputs }],
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
