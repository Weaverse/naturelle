import type { HydrogenComponentSchema } from "@weaverse/hydrogen";
import type { RefObject } from "react";
import { layoutInputs, Section, type SectionProps } from "../atoms/Section";

type BeforeAndAfterProps = SectionProps;

const BeforeAndAfter = ({
  ref,
  ...props
}: BeforeAndAfterProps & { ref?: RefObject<HTMLElement | null> }) => {
  let { children, ...rest } = props;
  return (
    <Section ref={ref} {...rest}>
      {children}
    </Section>
  );
};

export default BeforeAndAfter;

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
