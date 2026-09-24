import { createSchema, type HydrogenComponentProps } from "@weaverse/hydrogen";
import type { CSSProperties, Ref } from "react";
import { cn } from "~/utils/cn";
import { PRODUCT_DETAIL_METAFIELDS } from "./product-metafield";

interface ProductDetailsProps extends HydrogenComponentProps {
  textColor: string;
  backgroundColor: string;
  style?: CSSProperties;
  className?: string;
}

export default function ProductDetails({
  ref,
  children,
  textColor,
  backgroundColor,
  style,
  className,
  ...rest
}: ProductDetailsProps & { ref?: Ref<HTMLElement> }) {
  return (
    <section
      ref={ref}
      {...rest}
      className={cn(
        "mx-auto w-full max-w-page rounded-2xl bg-background-basic px-5 pt-20 pb-30 md:px-12 lg:px-0",
        className,
      )}
      style={
        {
          ...style,
          "--product-detail-text-color": textColor,
          "--product-detail-background-color": backgroundColor,
        } as CSSProperties
      }
    >
      <div className="mx-auto w-full max-w-300 space-y-20">{children}</div>
    </section>
  );
}

export const schema = createSchema({
  type: "product-details",
  title: "Product details",
  settings: [
    {
      group: "Theme",
      inputs: [
        {
          type: "color",
          name: "textColor",
          label: "Text color",
          defaultValue: "#6B5B66",
        },
        {
          type: "color",
          name: "backgroundColor",
          label: "Content background color",
          defaultValue: "#F4E8EF",
        },
      ],
    },
  ],
  childTypes: [
    "product-details--benefits",
    "product-details--story",
    "product-details--ingredients",
    "product-details--how-to-use",
    "product-details--results",
    "product-details--badges",
  ],
  presets: {
    children: [
      {
        type: "product-details--benefits",
        metafield: PRODUCT_DETAIL_METAFIELDS.benefits,
      },
      {
        type: "product-details--story",
        metafield: PRODUCT_DETAIL_METAFIELDS.story,
      },
      {
        type: "product-details--ingredients",
        metafield: PRODUCT_DETAIL_METAFIELDS.ingredients,
      },
      {
        type: "product-details--how-to-use",
        metafield: PRODUCT_DETAIL_METAFIELDS.howToUse,
      },
      {
        type: "product-details--results",
        metafield: PRODUCT_DETAIL_METAFIELDS.results,
      },
      { type: "product-details--badges" },
    ],
  },
});
