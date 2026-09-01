import {
  createSchema,
  type HydrogenComponentProps,
  IMAGES_PLACEHOLDERS,
  type WeaverseImage,
} from "@weaverse/hydrogen";
import type { RefObject } from "react";
import { Button } from "~/components/button";
import Heading from "~/components/heading";
import { Image } from "~/components/image";
import { cn } from "~/utils/cn";

type MapData = {
  mapImage: WeaverseImage | string;
  mapPosition: "left" | "right";
  heading: string;
  buttonText: string;
  buttonLink: string;
  buttonTarget: "_self" | "_blank";
};

type MapProps = HydrogenComponentProps & MapData;

export default function MapSection({
  ref,
  ...props
}: MapProps & { ref?: RefObject<HTMLElement | null> }) {
  const {
    mapImage = IMAGES_PLACEHOLDERS.image,
    mapPosition,
    heading,
    buttonText,
    buttonLink,
    buttonTarget,
    children,
    ...rest
  } = props;
  const imageData: Partial<WeaverseImage> =
    typeof mapImage === "string"
      ? { url: mapImage, altText: "Store location map" }
      : mapImage;

  return (
    <section
      ref={ref}
      {...rest}
      className="w-full bg-(--color-background-basic)"
    >
      <div
        className={cn(
          "flex min-h-140 flex-col md:flex-row",
          mapPosition === "right" && "flex-col-reverse md:flex-row-reverse",
        )}
      >
        <div className="map-media min-h-90 min-w-0 overflow-hidden md:min-h-140 md:flex-[1_1_var(--container-xl)]">
          <Image
            data={imageData}
            sizes="(min-width: 72rem) calc(100vw - 36rem), (min-width: 49.125em) 50vw, 100vw"
            className="h-full w-full object-cover"
          />
        </div>

        <div className="flex w-full min-w-0 p-12 md:max-w-xl md:flex-[0_1_var(--container-xl)] lg:py-20">
          <div className="flex w-full flex-col items-start gap-6">
            {heading && (
              <Heading
                as="h2"
                content={heading}
                size="custom"
                mobileSize="4xl"
                desktopSize="5xl"
                alignment="left"
                className="leading-tight"
              />
            )}
            {children && (
              <div className="flex w-full max-w-lg flex-col gap-5">
                {children}
              </div>
            )}
            {buttonText && (
              <Button
                to={buttonLink || "#"}
                target={buttonTarget}
                variant="primary"
                data-motion="fade-up"
                className="rounded-2xl"
              >
                {buttonText}
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export const schema = createSchema({
  type: "map",
  title: "Map",
  settings: [
    {
      group: "Map",
      inputs: [
        {
          type: "image",
          name: "mapImage",
          label: "Map image",
        },
        {
          type: "select",
          name: "mapPosition",
          label: "Map position",
          configs: {
            options: [
              { value: "left", label: "Left" },
              { value: "right", label: "Right" },
            ],
          },
          defaultValue: "left",
        },
      ],
    },
    {
      group: "Content",
      inputs: [
        {
          type: "text",
          name: "heading",
          label: "Heading",
          defaultValue: "Visit our store",
        },
        {
          type: "text",
          name: "buttonText",
          label: "Button text",
          defaultValue: "Get directions",
        },
        {
          type: "url",
          name: "buttonLink",
          label: "Button link",
          defaultValue: "https://maps.google.com",
        },
        {
          type: "select",
          name: "buttonTarget",
          label: "Open link in",
          configs: {
            options: [
              { value: "_self", label: "Current tab" },
              { value: "_blank", label: "New tab" },
            ],
          },
          defaultValue: "_blank",
        },
      ],
    },
  ],
  childTypes: ["map--item"],
  presets: {
    mapImage: IMAGES_PLACEHOLDERS.image,
    mapPosition: "left",
    heading: "Visit our store",
    buttonText: "Get directions",
    buttonLink: "https://maps.google.com",
    buttonTarget: "_blank",
    children: [
      {
        type: "map--item",
        title: "Our address",
        paragraph: "123 Naturelle Street, New York, NY 10001",
      },
      {
        type: "map--item",
        title: "Opening hours",
        paragraph: "Monday–Friday, 9:00 AM–6:00 PM",
      },
    ],
  },
});
