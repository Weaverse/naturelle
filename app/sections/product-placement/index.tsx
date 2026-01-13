import type { HydrogenComponentSchema } from "@weaverse/hydrogen";
import { createSchema } from "@weaverse/hydrogen";
import type { RefObject } from "react";
import {
  Section,
  type SectionProps,
  sectionInspector,
} from "~/components/section";

type ProductPlacementProps = SectionProps;

const ProductPlacement = ({
  ref,
  ...props
}: ProductPlacementProps & { ref?: RefObject<HTMLElement | null> }) => {
  let { children, ...rest } = props;
  return (
    <Section ref={ref} {...rest}>
      {children}
    </Section>
  );
};

export default ProductPlacement;

export const schema = createSchema({
  type: "product-placement",
  title: "Product placement",
  settings: sectionInspector,
  childTypes: [
    "subheading",
    "heading",
    "paragraph",
    "product-placement--items",
  ],
  presets: {
    children: [
      {
        type: "heading",
        content: "Shop the look",
      },
      {
        type: "product-placement--items",
      },
    ],
  },
});
