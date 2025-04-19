import { Image } from "@shopify/hydrogen";
import type {
  HydrogenComponentProps,
  HydrogenComponentSchema,
  WeaverseImage,
} from "@weaverse/hydrogen";
import clsx from "clsx";
import { type CSSProperties, forwardRef } from "react";
import { IconImageBlank } from "~/components/Icon";
import { Section, type SectionProps, layoutInputs } from "../atoms/Section";

interface TestimonialsProps extends HydrogenComponentProps {
  backgroundImage?: WeaverseImage;
  reviewsPosition: string;
  textColor?: string;
  borderColor?: string;
  desktopContentPadding?: number;
}

let reviewsPositionContent: { [reviewsPosition: string]: string } = {
  left: "justify-start",
  right: "justify-end",
};

const Testimonials = forwardRef<HTMLElement, TestimonialsProps & SectionProps>(
  (props, ref) => {
    let {
      backgroundImage,
      reviewsPosition,
      textColor,
      borderColor,
      desktopContentPadding,
      children,
      ...rest
    } = props;

    let sectionStyle: CSSProperties = {
      "--text-color": textColor,
      "--border-color": borderColor,
      "--desktop-content-padding": `${desktopContentPadding}px`,
    } as CSSProperties;
    return (
      <Section
        ref={ref}
        {...rest}
        className="relative bg-[#f8f8f0] overflow-hidden px-0"
        style={sectionStyle}
      >
        <div className="absolute inset-0">
          {backgroundImage ? (
            <Image
              data={backgroundImage}
              className="w-full h-full object-cover"
              sizes="auto"
            />
          ) : (
            <div className="flex justify-center items-center bg-[#e5e6d4] w-full h-full">
              <IconImageBlank
                className="w-96 h-96 opacity-80"
                viewBox="0 0 526 526"
              />
            </div>
          )}
        </div>
        <div
          className={clsx(
            "container !mt-0 w-full flex gap-3 items-center",
            reviewsPositionContent[reviewsPosition],
          )}
        >
          <div
            className={clsx(
              "h-fit z-10 bg-[rgba(238,239,234,0.10)] backdrop-blur-2xl",
              reviewsPosition === "full" ? "sm:w-full" : "sm:w-1/2",
            )}
          >
            <div className="flex flex-col gap-10 px-6 py-12 sm:py-16 sm:px-[var(--desktop-content-padding)] text-[var(--text-color)]">
              {children}
            </div>
          </div>
        </div>
      </Section>
    );
  },
);

export default Testimonials;

export let schema: HydrogenComponentSchema = {
  type: "testimonials",
  title: "Testimonials",
  toolbar: ["general-settings", ["duplicate", "delete"]],
  inspector: [
    {
      group: "Layout",
      inputs: layoutInputs.filter(
        ({ name }) =>
          name !== "divider" && name !== "borderRadius" && name !== "gap",
      ),
    },
    {
      group: "Testimonials",
      inputs: [
        {
          type: "image",
          name: "backgroundImage",
          label: "Background image",
        },
        {
          type: "toggle-group",
          label: "Reviews position",
          name: "reviewsPosition",
          configs: {
            options: [
              { label: "Left", value: "left" },
              { label: "Right", value: "right" },
              { label: "Full width", value: "full" },
            ],
          },
          defaultValue: "right",
        },
        {
          type: "color",
          name: "textColor",
          label: "Text color",
        },
        {
          type: "color",
          name: "borderColor",
          label: "Border color",
          defaultValue: "#3D490B",
        },
        {
          type: "range",
          label: "Desktop content padding horizontal",
          name: "desktopContentPadding",
          configs: {
            min: 30,
            max: 100,
            step: 5,
            unit: "px",
          },
          defaultValue: 30,
        },
      ],
    },
  ],
  childTypes: ["heading", "content-reviews--review"],
  presets: {
    children: [
      {
        type: "heading",
        content: "Testimonials",
      },
      {
        type: "content-reviews--review",
      },
    ],
  },
};
