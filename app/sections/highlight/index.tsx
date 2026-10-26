import { createSchema } from "@weaverse/hydrogen";
import type { RefObject } from "react";
import { backgroundInputs } from "~/components/background-image";
import { layoutInputs, Section, type SectionProps } from "~/components/section";
import { cn } from "~/utils/cn";

interface HighlightsProps extends SectionProps {
  visibleOnMobile?: boolean;
}

const Highlights = ({
  ref,
  ...props
}: HighlightsProps & { ref?: RefObject<HTMLElement | null> }) => {
  let { children, className, visibleOnMobile = true, ...rest } = props;

  return (
    <Section
      ref={ref}
      {...rest}
      className={cn(className, !visibleOnMobile && "hidden md:block")}
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
      inputs: [
        {
          type: "switch",
          label: "Visible on mobile",
          name: "visibleOnMobile",
          defaultValue: true,
        },
        ...layoutInputs.filter((input) => input.name !== "borderRadius"),
      ],
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
    visibleOnMobile: true,
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
