import { createSchema } from "@weaverse/hydrogen";
import type { RefObject } from "react";
import {
  Section,
  type SectionProps,
  sectionInspector,
} from "~/components/section";
import { useIsContactPage } from "~/hooks/use-is-contact-page";
import { cn } from "~/utils/cn";

type HighlightsProps = SectionProps;

const Highlights = ({
  ref,
  ...props
}: HighlightsProps & { ref?: RefObject<HTMLElement | null> }) => {
  let {
    children,
    className,
    containerClassName,
    backgroundColor,
    width,
    ...rest
  } = props;
  const isContactPage = useIsContactPage();

  return (
    <Section
      ref={ref}
      {...rest}
      width={isContactPage ? "full" : width}
      backgroundColor={isContactPage ? undefined : backgroundColor}
      className={className}
      containerClassName={cn(
        isContactPage
          ? "mx-auto w-full max-w-230 space-y-12 px-4 pt-10 pb-12 md:px-6 lg:px-0"
          : "py-20 lg:max-w-[1440px] lg:py-[120px]",
        containerClassName,
      )}
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
