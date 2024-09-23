import {
  IMAGES_PLACEHOLDERS,
  type HydrogenComponentSchema,
} from "@weaverse/hydrogen";
import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import { forwardRef } from "react";
import { Section, SectionProps, layoutInputs } from "../atoms/Section";
import { backgroundInputs } from "../atoms/BackgroundImage";
import { overlayInputs } from "../atoms/Overlay";

export interface SlideShowBannerItemProps
  extends VariantProps<typeof variants> {
  horizontalPadding: string;
}

let variants = cva("flex flex-col [&_.paragraph]:mx-[unset]", {
  variants: {
    height: {
      small: "min-h-[40vh] lg:min-h-[50vh]",
      medium: "min-h-[50vh] lg:min-h-[60vh]",
      large: "min-h-[70vh] lg:min-h-[80vh]",
      full: "h-screen-no-nav",
    },
    contentPosition: {
      "top left": "justify-start items-start [&_.paragraph]:[text-align:left]",
      "top center":
        "justify-start items-center [&_.paragraph]:[text-align:center]",
      "top right": "justify-start items-end [&_.paragraph]:[text-align:right]",
      "center left":
        "justify-center items-start [&_.paragraph]:[text-align:left]",
      "center center":
        "justify-center items-center [&_.paragraph]:[text-align:center]",
      "center right":
        "justify-center items-end [&_.paragraph]:[text-align:right]",
      "bottom left": "justify-end items-start [&_.paragraph]:[text-align:left]",
      "bottom center":
        "justify-end items-center [&_.paragraph]:[text-align:center]",
      "bottom right": "justify-end items-end [&_.paragraph]:[text-align:right]",
    },
  },
  defaultVariants: {
    height: "large",
    contentPosition: "center center",
  },
});

let HeaderImage = forwardRef<
  HTMLElement,
  SlideShowBannerItemProps & SectionProps
>((props, ref) => {
  let { children, height, contentPosition, horizontalPadding, ...rest } = props;
  let style = {
    "--horizontal-padding": `${horizontalPadding}px`,
  } as React.CSSProperties;
  return (
    <div style={style} className="px-[var(--horizontal-padding)] md:px-[calc(var(--horizontal-padding) * 1.5)] lg:px-[calc(var(--horizontal-padding) * 2)]">
      <Section
        ref={ref}
        {...rest}
        containerClassName={variants({ contentPosition, height })}
      >
        {children}
      </Section>
    </div>
  );
});

export default HeaderImage;

export let schema: HydrogenComponentSchema = {
  type: "image-banner",
  title: "Image banner",
  toolbar: ["general-settings", ["duplicate", "delete"]],
  inspector: [
    {
      group: "Image",
      inputs: [
        {
          type: "select",
          name: "height",
          label: "Section height",
          configs: {
            options: [
              { value: "small", label: "Small" },
              { value: "medium", label: "Medium" },
              { value: "large", label: "Large" },
              { value: "full", label: "Fullscreen" },
            ],
          },
        },
        {
          type: "position",
          name: "contentPosition",
          label: "Content position",
          defaultValue: "center center",
        },
        ...layoutInputs,
        {
          type: "range",
          name: "horizontalPadding",
          label: "Horizontal padding",
          configs: {
            min: 0,
            max: 100,
            step: 1,
            unit: "px",
          },
          defaultValue: 0,
          helpText: "Set the horizontal padding value for the entire section",
        },
      ],
    },
    {
      group: "Background",
      inputs: [
        ...backgroundInputs.filter(
          (inp) =>
            inp.name !== "backgroundFor" && inp.name !== "backgroundColor",
        ),
      ],
    },
    { group: "Overlay", inputs: overlayInputs },
  ],
  childTypes: ["subheading", "heading", "paragraph", "button"],
  presets: {
    height: "large",
    contentPosition: "bottom left",
    backgroundImage: IMAGES_PLACEHOLDERS.image,
    backgroundFit: "cover",
    enableOverlay: true,
    overlayOpacity: 35,
    children: [
      {
        type: "subheading",
        content: "Subheading",
        color: "#ffffff",
      },
      {
        type: "heading",
        content: "Hero image with text overlay",
        color: "#ffffff",
        size: "scale",
        minSize: 16,
        maxSize: 56,
      },
      {
        type: "paragraph",
        content:
          "Use this text to share information about your brand with your customers. Describe a product, share announcements, or welcome customers to your store.",
        color: "#ffffff",
      },
    ],
  },
};
