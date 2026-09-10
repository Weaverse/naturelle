import { createSchema } from "@weaverse/hydrogen";
import type { RefObject } from "react";
import { backgroundInputs } from "~/components/background-image";
import { layoutInputs, Section, type SectionProps } from "~/components/section";
import { cn } from "~/utils/cn";

interface ImageWithTextProps extends SectionProps {
  imagePosition: "first" | "last";
}

let ImageWithText = ({
  ref,
  ...props
}: ImageWithTextProps & { ref?: RefObject<HTMLElement | null> }) => {
  let { children, imagePosition, ...rest } = props;

  return (
    <Section
      ref={ref}
      {...rest}
      containerClassName={cn(
        "flex gap-10 px-6 py-10 md:gap-0 md:justify-between lg:p-10",
        imagePosition === "last"
          ? "flex-col-reverse md:flex-row-reverse"
          : "flex-col md:flex-row",
      )}
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
      inputs: [
        ...layoutInputs.filter(
          ({ name }) => name !== "gap" && name !== "verticalPadding",
        ),
        {
          type: "select",
          name: "imagePosition",
          label: "Image position",
          configs: {
            options: [
              { value: "first", label: "Image first" },
              { value: "last", label: "Image last" },
            ],
          },
          defaultValue: "first",
        },
      ],
    },
    { group: "Background", inputs: backgroundInputs },
  ],
  childTypes: ["image-with-text--content", "image-with-text--image"],
  presets: {
    imagePosition: "first",
    children: [
      { type: "image-with-text--image" },
      { type: "image-with-text--content" },
    ],
  },
});
