import type { HydrogenComponentSchema } from "@weaverse/hydrogen";
import { createSchema } from "@weaverse/hydrogen";
import type { RefObject } from "react";
import { backgroundInputs } from "~/components/background-image";
import { layoutInputs, Section, type SectionProps } from "~/components/section";

type ImageWithTextProps = SectionProps;

let ImageWithText = ({
  ref,
  ...props
}: ImageWithTextProps & { ref?: RefObject<HTMLElement | null> }) => {
  let { children, ...rest } = props;

  return (
    <Section
      ref={ref}
      {...rest}
      containerClassName="flex flex-col md:flex-row md:justify-between px-0 sm:px-0"
    >
      {children}
    </Section>
  );
};

export default ImageWithText;

export const schema = createSchema({
  type: "image-with-text",
  title: "Image with text",
  settings: [
    {
      group: "Layout",
      inputs: layoutInputs.filter(({ name }) => name !== "gap"),
    },
    { group: "Background", inputs: backgroundInputs },
  ],
  childTypes: ["image-with-text--content", "image-with-text--image"],
  presets: {
    verticalPadding: "none",
    children: [
      { type: "image-with-text--image" },
      { type: "image-with-text--content" },
    ],
  },
});
