import { createSchema, IMAGES_PLACEHOLDERS } from "@weaverse/hydrogen";
import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import type { RefObject } from "react";
import { backgroundInputs } from "~/components/background-image";
import { overlayInputs } from "~/components/overlay";
import { layoutInputs, Section, type SectionProps } from "~/components/section";
import { sectionImageSource } from "~/utils/section-placeholder";

export type SlideShowBannerItemProps = VariantProps<typeof variants> & {
  /** @deprecated Hero images are always full width. */
  horizontalPadding?: number;
};

let variants = cva(
  "flex flex-col px-10 md:px-12 lg:px-20 [&_.paragraph]:mx-[unset]",
  {
    variants: {
      height: {
        small: "min-h-[40vh] lg:min-h-[50vh]",
        medium: "min-h-[50vh] lg:min-h-[60vh]",
        large: "min-h-[70vh] lg:min-h-[80vh]",
        full: "h-screen-no-nav",
      },
      contentPosition: {
        "top left":
          "justify-start items-start [&_.paragraph]:[text-align:left]",
        "top center":
          "justify-start items-center [&_.paragraph]:[text-align:center]",
        "top right":
          "justify-start items-end [&_.paragraph]:[text-align:right]",
        "center left":
          "justify-center items-start [&_.paragraph]:[text-align:left]",
        "center center":
          "justify-center items-center [&_.paragraph]:[text-align:center]",
        "center right":
          "justify-center items-end [&_.paragraph]:[text-align:right]",
        "bottom left":
          "justify-end items-start [&_.paragraph]:[text-align:left]",
        "bottom center":
          "justify-end items-center [&_.paragraph]:[text-align:center]",
        "bottom right":
          "justify-end items-end [&_.paragraph]:[text-align:right]",
      },
    },
    defaultVariants: {
      height: "large",
      contentPosition: "center center",
    },
  },
);

let HeaderImage = ({
  ref,
  ...props
}: SlideShowBannerItemProps &
  SectionProps & { ref?: RefObject<HTMLElement | null> }) => {
  let {
    children,
    height,
    contentPosition,
    horizontalPadding: _horizontalPadding,
    width: _width,
    borderRadius,
    backgroundImage,
    ...rest
  } = props;
  let style = {
    "--image-banner-border-radius": `${borderRadius || 0}px`,
  } as React.CSSProperties;
  return (
    <div
      ref={ref as RefObject<HTMLDivElement | null>}
      style={style}
      className="w-full"
    >
      <div className="overflow-hidden rounded-none lg:rounded-(--image-banner-border-radius)">
        <Section
          {...rest}
          width="full"
          backgroundImage={sectionImageSource(
            backgroundImage,
            IMAGES_PLACEHOLDERS.image,
          )}
          borderRadius={0}
          containerClassName={variants({ contentPosition, height })}
        >
          {children}
        </Section>
      </div>
    </div>
  );
};

export default HeaderImage;

export const schema = createSchema({
  type: "image-banner",
  title: "Hero image",
  settings: [
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
        ...layoutInputs.filter((input) => input.name !== "width"),
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
});
