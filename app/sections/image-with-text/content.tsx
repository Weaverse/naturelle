import type { HydrogenComponentProps } from "@weaverse/hydrogen";
import { createSchema } from "@weaverse/hydrogen";
import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import type { RefObject } from "react";

let variants = cva(
  "grow h-auto basis-full md:basis-1/2 flex flex-col justify-center gap-5 lg:h-full [&_.paragraph]:mx-[unset] [&_.paragraph]:w-auto",
  {
    variants: {
      alignment: {
        left: "items-start [&_.heading]:!text-left [&_.paragraph]:!text-left",
        center:
          "items-center [&_.heading]:!text-center [&_.paragraph]:!text-center [&_.paragraph]:!leading-[130%]",
        right: "items-end [&_.heading]:!text-right [&_.paragraph]:!text-right",
      },
      verticalPadding: {
        none: "p-0",
        small: "px-16 py-4",
        medium: "px-16 py-11 md:py-14 lg:py-16",
        large: "px-16 py-14 md:py-24 lg:py-20",
      },
    },
    defaultVariants: {
      alignment: "center",
      verticalPadding: "medium",
    },
  },
);

interface ImageWithTextContentProps
  extends VariantProps<typeof variants>,
    HydrogenComponentProps {}

let ImageWithTextContent = ({
  ref,
  ...props
}: ImageWithTextContentProps & { ref?: RefObject<HTMLDivElement | null> }) => {
  let { alignment, verticalPadding, children, ...rest } = props;
  return (
    <div
      ref={ref}
      {...rest}
      className={variants({ alignment, verticalPadding })}
    >
      {children}
    </div>
  );
};

export default ImageWithTextContent;

export const schema = createSchema({
  type: "image-with-text--content",
  title: "Content",
  limit: 1,
  settings: [
    {
      group: "Content",
      inputs: [
        {
          type: "select",
          name: "alignment",
          label: "Alignment",
          configs: {
            options: [
              { value: "left", label: "Left" },
              { value: "center", label: "Center" },
              { value: "right", label: "Right" },
            ],
          },
          helpText:
            "This will override the default alignment setting of all children components.",
        },
        {
          type: "select",
          name: "verticalPadding",
          label: "Content padding",
          configs: {
            options: [
              { value: "none", label: "None" },
              { value: "small", label: "Small" },
              { value: "medium", label: "Medium" },
              { value: "large", label: "Large" },
            ],
          },
          defaultValue: "medium",
        },
      ],
    },
  ],
  childTypes: ["subheading", "heading", "paragraph", "button"],
  presets: {
    alignment: "center",
    verticalPadding: "medium",
    children: [
      {
        type: "subheading",
        content: "Subheading",
      },
      {
        type: "heading",
        content: "Heading for image",
      },
      {
        type: "paragraph",
        content: "Pair large text with an image to tell a story.",
      },
      {
        type: "button",
        text: "Shop now",
      },
    ],
  },
});
