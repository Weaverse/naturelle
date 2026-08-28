import type { HydrogenComponentProps, WeaverseImage } from "@weaverse/hydrogen";
import { createSchema, IMAGES_PLACEHOLDERS } from "@weaverse/hydrogen";
import type { CSSProperties, RefObject } from "react";
import { Image } from "~/components/image";

interface HotspotsImageProps extends HydrogenComponentProps {
  image: string;
  aspectRatio: "adapt" | "1/1" | "4/3" | "3/4" | "16/9";
}

const HotspotsImage = ({
  ref,
  ...props
}: HotspotsImageProps & { ref?: RefObject<HTMLDivElement | null> }) => {
  let { image, aspectRatio, children, ...rest } = props;
  let imageData: Partial<WeaverseImage> =
    typeof image === "string"
      ? { url: image, altText: "Hotspots image" }
      : image;
  return (
    <div
      ref={ref}
      {...rest}
      data-aspect-ratio={aspectRatio}
      style={
        {
          "--hotspot-background-image": imageData.url
            ? `url("${imageData.url}")`
            : "none",
        } as CSSProperties
      }
      className="relative mb-[900px] w-full md:mb-0 md:h-[clamp(780px,50vw,863px)] md:w-1/2"
    >
      <div className="relative aspect-square w-full overflow-visible md:h-full md:aspect-auto">
        <Image
          data={imageData}
          sizes="auto"
          className="z-0 h-full w-full object-cover"
        />
        {children}
      </div>
    </div>
  );
};

export default HotspotsImage;

export const schema = createSchema({
  type: "image-hotspots",
  title: "Image hotspots",
  limit: 2,
  childTypes: ["hotspots--item"],
  settings: [
    {
      group: "Image",
      inputs: [
        {
          type: "image",
          name: "image",
          label: "Image",
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
  ],
  presets: {
    image: IMAGES_PLACEHOLDERS.collection_4,
    aspectRatio: "16/9",
    children: [
      {
        type: "hotspots--item",
        offsetX: 25,
        offsetY: 30,
      },
    ],
  },
});
