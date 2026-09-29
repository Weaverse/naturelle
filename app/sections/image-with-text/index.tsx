import { createSchema } from "@weaverse/hydrogen";
import type { CSSProperties, RefObject } from "react";
import { backgroundInputs } from "~/components/background-image";
import { layoutInputs, Section, type SectionProps } from "~/components/section";
import { cn } from "~/utils/cn";

interface ImageWithTextProps extends SectionProps {
  imagePosition: "first" | "last";
  sectionPadding: "default" | "none";
  contentGap: number;
}

let ImageWithText = ({
  ref,
  ...props
}: ImageWithTextProps & { ref?: RefObject<HTMLElement | null> }) => {
  let { children, imagePosition, sectionPadding, contentGap, style, ...rest } =
    props;
  const sectionStyle = {
    ...style,
    "--image-with-text-gap": `${contentGap ?? 0}px`,
  } as CSSProperties;

  return (
    <Section
      ref={ref}
      {...rest}
      style={sectionStyle}
      containerClassName={cn(
        "flex gap-10 md:gap-(--image-with-text-gap) md:justify-between",
        sectionPadding === "none" ? "p-0" : "px-6 py-10 lg:p-10",
        imagePosition === "last"
          ? "flex-col md:flex-row-reverse"
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
        {
          type: "select",
          name: "sectionPadding",
          label: "Section padding",
          configs: {
            options: [
              { value: "default", label: "Default" },
              { value: "none", label: "None" },
            ],
          },
          defaultValue: "default",
        },
        {
          type: "range",
          name: "contentGap",
          label: "Desktop image/content gap",
          configs: {
            min: 0,
            max: 40,
            step: 1,
            unit: "px",
          },
          defaultValue: 0,
        },
      ],
    },
    { group: "Background", inputs: backgroundInputs },
  ],
  childTypes: ["image-with-text--content", "image-with-text--image"],
  presets: {
    imagePosition: "first",
    sectionPadding: "default",
    contentGap: 0,
    children: [
      { type: "image-with-text--image" },
      { type: "image-with-text--content" },
    ],
  },
});
