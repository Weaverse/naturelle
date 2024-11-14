import { Image } from "@shopify/hydrogen";
import { IMAGES_PLACEHOLDERS } from "@weaverse/hydrogen";
import type {
  WeaverseImage,
  HydrogenComponentSchema,
} from "@weaverse/hydrogen";
import { forwardRef } from "react";
import { Section, SectionProps } from "../atoms/Section";
import Heading from "../atoms/Heading";
import Description from "../atoms/Description";
import { getImageAspectRatio } from "~/lib/utils";

type HotspotsProps = SectionProps & {
  heading?: string;
  description?: string;
  image: string;
  image2: string;
  aspectRatio: "adapt" | "1/1" | "4/3" | "3/4" | "16/9";
  duplicateImage: boolean;
};

let Hotspots = forwardRef<HTMLElement, HotspotsProps>((props, ref) => {
  let {
    heading,
    description,
    image,
    image2,
    aspectRatio,
    duplicateImage,
    children,
    ...rest
  } = props;
  let imageData: Partial<WeaverseImage> =
    typeof image === "string"
      ? { url: image, altText: "Hotspots image" }
      : image;
  let image2Data: Partial<WeaverseImage> =
    typeof image2 === "string"
      ? { url: image2, altText: "Hotspots image" }
      : image2;
  return (
    <Section ref={ref} {...rest} overflow="hidden">
      {heading && <Heading as="h2" content={heading} />}
      {description && (
        <Description as="p" content={description} alignment="center" />
      )}
      <div className="flex sm:flex-row flex-col gap-8 w-full h-full relative">
        <Image
          data={imageData}
          sizes="auto"
          className="object-cover z-0 w-full h-full"
          style={{ aspectRatio: getImageAspectRatio(imageData, aspectRatio) }}
        />
        {duplicateImage && (
          <Image
            data={image2Data}
            sizes="auto"
            className="object-cover z-0 w-full h-full"
            style={{
              aspectRatio: getImageAspectRatio(image2Data, aspectRatio),
            }}
          />
        )}
        {children}
      </div>
    </Section>
  );
});

export default Hotspots;

export let schema: HydrogenComponentSchema = {
  type: "hotspots",
  title: "Hotspots",
  childTypes: ["hotspots--item"],
  inspector: [
    {
      group: "Layout",
      inputs: [
        {
          type: "select",
          name: "width",
          label: "Content width",
          configs: {
            options: [
              { value: "full", label: "Full page" },
              { value: "stretch", label: "Stretch" },
              { value: "fixed", label: "Fixed" },
            ],
          },
          defaultValue: "fixed",
        },
        {
          type: "range",
          name: "gap",
          label: "Items spacing",
          configs: {
            min: 0,
            max: 60,
            step: 4,
            unit: "px",
          },
          defaultValue: 20,
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
    {
      group: "Image",
      inputs: [
        {
          type: "image",
          name: "image",
          label: "Image",
        },
        {
          type: "image",
          name: "image2",
          label: "Image #2",
          condition: "duplicateImage.eq.true",
        },
        {
          type: "switch",
          name: "duplicateImage",
          label: "Duplicate image",
          defaultValue: false,
        },
        {
          type: "select",
          name: "aspectRatio",
          label: "Aspect ratio",
          defaultValue: "adapt",
          configs: {
            options: [
              { value: "adapt", label: "Adapt to image" },
              { value: "1/1", label: "1/1" },
              { value: "4/3", label: "4/3" },
              { value: "3/4", label: "3/4" },
              { value: "16/9", label: "16/9" },
            ],
          },
          helpText:
            'Learn more about image <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/aspect-ratio" target="_blank" rel="noopener noreferrer">aspect ratio</a> property.',
        },
      ],
    },
    {
      group: "Heading (optional)",
      inputs: [
        {
          type: "text",
          name: "heading",
          label: "Heading",
          defaultValue: "Shop the look",
          placeholder: "Shop the look",
        },
        {
          type: "richtext",
          name: "description",
          label: "Description",
        },
      ],
    },
  ],
  toolbar: ["general-settings", ["duplicate", "delete"]],
  presets: {
    heading: "Shop the look",
    image: IMAGES_PLACEHOLDERS.collection_4,
    image2: IMAGES_PLACEHOLDERS.collection_4,
    aspectRatio: "16/9",
    gap: 40,
    children: [
      {
        type: "hotspots--item",
        offsetX: 25,
        offsetY: 30,
      },
      {
        type: "hotspots--item",
        offsetX: 55,
        offsetY: 65,
      },
    ],
  },
};
