import type { HydrogenComponentSchema } from "@weaverse/hydrogen";
import type React from "react";
import { layoutInputs, Section, type SectionProps } from "../atoms/Section";

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

export let schema: HydrogenComponentSchema = {
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
};
