import { createSchema } from "@weaverse/hydrogen";
import type { RefObject } from "react";
import {
  Section,
  type SectionProps,
  sectionInspector,
} from "~/components/section";

type ProductGridData = SectionProps;

export default function ProductGrid({
  ref,
  ...props
}: ProductGridData & { ref?: RefObject<HTMLElement | null> }) {
  const { children, gap, ...rest } = props;
  return (
    <Section
      ref={ref}
      {...rest}
      gap={0}
      className="px-5 py-20 lg:px-0 bg-background-basic"
    >
      <div
        className="mx-auto flex w-full max-w-lg flex-col gap-10 md:gap-(--section-gap)"
        style={
          {
            "--section-gap": typeof gap === "number" ? `${gap}px` : "10px",
          } as React.CSSProperties
        }
      >
        {children}
      </div>
    </Section>
  );
}

export const schema = createSchema({
  type: "product-grid",
  title: "Product grid",
  settings: sectionInspector.map((group) => ({
    ...group,
    inputs: group.inputs.filter((input) => input.name !== "verticalPadding"),
  })),
  childTypes: ["heading", "product-grid--list"],
  presets: {
    children: [
      { type: "heading", content: "New collection" },
      { type: "product-grid--list" },
    ],
  },
});
