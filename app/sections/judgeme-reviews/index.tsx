import { createSchema } from "@weaverse/hydrogen";
import type { RefObject } from "react";
import { layoutInputs, Section, type SectionProps } from "~/components/section";

type JudgemeReviewProps = SectionProps;
const JudgemeReviewSection = ({
  ref,
  ...props
}: JudgemeReviewProps & { ref?: RefObject<HTMLElement | null> }) => {
  let { children, loaderData, ...rest } = props;
  return (
    <Section
      ref={ref}
      {...rest}
      width="full"
      overflow="unset"
      verticalPadding="none"
      containerClassName="mx-auto flex flex-col gap-6 px-5 pt-20 pb-30 md:px-6 md:py-20 lg:max-w-[var(--page-width,1440px)] lg:px-0 [&>.heading]:!m-0"
    >
      {children}
    </Section>
  );
};

export default JudgemeReviewSection;

export const schema = createSchema({
  type: "judgeme-reviews",
  title: "Judgeme Reviews",
  enabledOn: {
    pages: ["PRODUCT"],
  },
  settings: [
    {
      group: "Layout",
      inputs: layoutInputs.filter((inp) => inp.name !== "borderRadius"),
    },
  ],
  childTypes: ["heading", "paragraph", "judgeme-review--index"],
  presets: {
    children: [
      {
        type: "heading",
        Content: "What our customers say",
      },
      {
        type: "judgeme-review--index",
      },
    ],
  },
});
