import { createSchema } from "@weaverse/hydrogen";
import clsx from "clsx";
import type { RefObject } from "react";
import {
  Section,
  type SectionProps,
  sectionInspector,
} from "~/components/section";

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
      className={clsx("bg-[#F3F3F3]", className)}
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
  settings: sectionInspector,
  childTypes: ["heading", "highlight-content--item"],
  presets: {
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
