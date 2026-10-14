import { createSchema } from "@weaverse/hydrogen";
import type { RefObject } from "react";
import { backgroundInputs } from "~/components/background-image";
import { layoutInputs, Section, type SectionProps } from "~/components/section";

type HighlightsProps = SectionProps;

const Highlights = ({
  ref,
  ...props
}: HighlightsProps & { ref?: RefObject<HTMLElement | null> }) => {
  let { children, className, ...rest } = props;

  return (
    <Section
      ref={ref}
      {...rest}
      className={className}
      containerClassName="py-20 lg:max-w-[1440px] lg:py-[120px]"
    >
      {children}
    </Section>
  );
};

export default Highlights;

export const schema = createSchema({
  type: "highlight",
  title: "Highlights",
  settings: [
    {
      group: "Layout",
      inputs: layoutInputs.filter((input) => input.name !== "borderRadius"),
    },
    {
      group: "Background",
      inputs: backgroundInputs.filter(
        (input) =>
          input.name !== "backgroundImage" &&
          input.name !== "backgroundFit" &&
          input.name !== "backgroundPosition",
      ),
    },
  ],
  childTypes: ["heading", "highlight-content--item"],
  presets: {
    backgroundColor: "#F3F3F3",
    children: [
      {
        type: "heading",
        content: "Highlights",
      },
      {
        type: "highlight-content--item",
      },
    ],
  },
});
