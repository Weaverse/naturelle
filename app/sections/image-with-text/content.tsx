import type {
  HydrogenComponentProps,
  HydrogenComponentSchema,
} from "@weaverse/hydrogen";
import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import clsx from "clsx";
import { forwardRef } from "react";

let variants = cva(
  "grow h-auto basis-full md:basis-1/2 flex flex-col justify-center gap-5 px-4 md:px-8 [&_.paragraph]:mx-[unset] [&_.paragraph]:w-auto",
  {
    variants: {
      alignment: {
        left: "items-start",
        center: "items-center",
        right: "items-end",
      },
      verticalPadding: {
        none: "",
        small: "py-9 md:py-11 lg:py-14",
        medium: "py-11 md:py-14 lg:py-24",
        large: "py-14 md:py-24 lg:py-32",
      },
    },
    defaultVariants: {
      alignment: "center",
    },
  },
);

interface ImageWithTextContentProps
  extends VariantProps<typeof variants>,
    HydrogenComponentProps {}

let ImageWithTextContent = forwardRef<
  HTMLDivElement,
  ImageWithTextContentProps
>((props, ref) => {
  let { alignment, verticalPadding, children, ...rest } = props;
  return (
    <div
      ref={ref}
      {...rest}
      className={clsx(variants({ alignment, verticalPadding }))}
    >
      {children}
    </div>
  );
});

export default ImageWithTextContent;

export let schema: HydrogenComponentSchema = {
  type: "image-with-text--content",
  title: "Content",
  limit: 1,
  inspector: [
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
          label: "Vertical padding",
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
  childTypes: ["subheading", "heading", "description", "button"],
  presets: {
    alignment: "center",
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
        type: "description",
        content: "Pair large text with an image to tell a story.",
      },
      {
        type: "button",
        text: "Shop now",
      },
    ],
  },
};
