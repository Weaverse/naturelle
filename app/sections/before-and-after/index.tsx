import type { HydrogenComponentSchema } from "@weaverse/hydrogen";
import { createSchema } from "@weaverse/hydrogen";
import type React from "react";
import { layoutInputs, Section, type SectionProps } from "~/components/section";

export interface BeforeAndAfterProps extends SectionProps {
  ref?: React.Ref<HTMLElement>;
}

export default function BeforeAndAfter(props: BeforeAndAfterProps) {
  let { ref, children, ...rest } = props;
  return (
    <Section ref={ref as any} {...rest}>
      {children}
    </Section>
  );
}

export const schema = createSchema({
  type: "before-and-after",
  title: "Before & after",
  settings: [
    {
      group: "Layout",
      inputs: layoutInputs.filter(
        ({ name }) => name !== "divider" && name !== "borderRadius",
      ),
    },
  ],
  childTypes: ["heading", "before-after-slider"],
  presets: {
    children: [
      {
        type: "heading",
        content: "Before & After",
      },
      {
        type: "before-after-slider",
      },
    ],
  },
});
