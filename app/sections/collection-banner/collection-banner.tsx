import { Image } from "@shopify/hydrogen";
import {
  createSchema,
  type HydrogenComponentProps,
  type WeaverseImage,
} from "@weaverse/hydrogen";
import { useLoaderData } from "react-router";
import type { CollectionDetailsQuery } from "storefront-api.generated";
import { cn } from "~/utils/cn";

interface CollectionBannerProps extends HydrogenComponentProps {
  image?: WeaverseImage;
  imagePosition: "left" | "right";
  heading?: string;
  description?: string;
  sectionHeightDesktop: number;
  sectionHeightMobile: number;
  enableBackground: boolean;
  overlayOpacity: number;
  enableOverlay: boolean;
  contentPosition: string;
  contentBackgroundColor?: string;
  ref?: React.Ref<HTMLElement>;
}

const CollectionBanner = (props: CollectionBannerProps) => {
  const {
    ref,
    image,
    imagePosition = "right",
    heading,
    description,
    sectionHeightDesktop = 300,
    sectionHeightMobile = 450,
    enableBackground = true,
    overlayOpacity = 0.5,
    enableOverlay = true,
    contentPosition = "center left",
    contentBackgroundColor = "#FFFFFF",
    ...rest
  } = props;

  const { collection } = useLoaderData<
    CollectionDetailsQuery & {
      collections: Array<{ handle: string; title: string }>;
    }
  >();

  const bannerImage = image || collection?.image;
  const bannerHeading = heading || collection?.title;
  const bannerDescription = description || collection?.description;

  const contentPositionClass: Record<string, string> = {
    "top left": "items-start justify-start text-left",
    "top center": "items-start justify-center text-center",
    "top right": "items-start justify-end text-right",
    "center left": "items-center justify-start text-left",
    "center center": "items-center justify-center text-center",
    "center right": "items-center justify-end text-right",
    "bottom left": "items-end justify-start text-left",
    "bottom center": "items-end justify-center text-center",
    "bottom right": "items-end justify-end text-right",
  };

  const showImage = enableBackground && Boolean(bannerImage);

  return (
    <section
      ref={ref}
      {...rest}
      style={
        {
          "--banner-height-desktop": `${sectionHeightDesktop}px`,
          "--banner-height-mobile": `${sectionHeightMobile}px`,
        } as React.CSSProperties
      }
      className="bg-background-basic py-6"
    >
      <div
        className={cn(
          "mx-auto px-5 md:px-6 lg:px-0 flex h-(--banner-height-mobile) w-full max-w-page flex-col overflow-hidden rounded-2xl md:h-(--banner-height-desktop) md:flex-row",
          imagePosition === "left" && "md:flex-row-reverse",
        )}
      >
        <div
          style={{ backgroundColor: contentBackgroundColor }}
          className={cn(
            "flex w-full flex-1 p-10 md:w-1/2 md:flex-none md:px-20 md:py-0",
            contentPositionClass[contentPosition],
          )}
        >
          <div className="w-full text-text-primary">
            {bannerHeading && (
              <h1 className="h3 font-normal text-text">{bannerHeading}</h1>
            )}
            {bannerDescription && (
              <p className="mt-6 max-w-full text-base leading-[1.6] tracking-[-0.16px]">
                {bannerDescription}
              </p>
            )}
          </div>
        </div>

        {showImage && bannerImage && (
          <div className="relative w-full flex-1 overflow-hidden md:w-1/2 md:flex-none">
            <Image
              data={bannerImage}
              sizes="(min-width: 90rem) 720px, (min-width: 49.125em) 50vw, 100vw"
              className="h-full w-full object-cover"
            />
            {enableOverlay && (
              <div
                className="pointer-events-none absolute inset-0 bg-black"
                style={{ opacity: overlayOpacity }}
              />
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default CollectionBanner;

export const schema = createSchema({
  type: "collection-banner",
  title: "Collection banner",
  enabledOn: {
    pages: ["COLLECTION"],
  },
  settings: [
    {
      group: "Content",
      inputs: [
        {
          type: "color",
          name: "contentBackgroundColor",
          label: "Content background color",
          defaultValue: "#FFFFFF",
        },
        {
          type: "text",
          name: "heading",
          label: "Heading",
          helpText: "Leave blank to use the collection title.",
        },
        {
          type: "textarea",
          name: "description",
          label: "Description",
          helpText: "Leave blank to use the collection description.",
        },
      ],
    },
    {
      group: "Image",
      inputs: [
        {
          type: "image",
          name: "image",
          label: "Banner image",
          helpText: "Leave blank to use the collection image.",
        },
        {
          type: "select",
          name: "imagePosition",
          label: "Image position",
          defaultValue: "right",
          configs: {
            options: [
              { value: "left", label: "Left" },
              { value: "right", label: "Right" },
            ],
          },
        },
        {
          type: "switch",
          name: "enableBackground",
          label: "Enable background",
          defaultValue: true,
        },
      ],
    },
    {
      group: "Layout",
      inputs: [
        {
          type: "range",
          name: "sectionHeightDesktop",
          label: "Section height desktop",
          defaultValue: 300,
          configs: {
            min: 300,
            max: 650,
            step: 10,
          },
        },
        {
          type: "range",
          name: "sectionHeightMobile",
          label: "Section height mobile",
          defaultValue: 450,
          configs: {
            min: 300,
            max: 550,
            step: 10,
          },
        },
        {
          type: "position",
          name: "contentPosition",
          label: "Content position",
          defaultValue: "center left",
        },
      ],
    },
    {
      group: "Overlay",
      inputs: [
        {
          type: "switch",
          name: "enableOverlay",
          label: "Enable overlay",
          defaultValue: true,
          condition: "enableBackground.eq.true",
        },
        {
          type: "range",
          name: "overlayOpacity",
          label: "Overlay opacity",
          defaultValue: 0.5,
          configs: {
            min: 0,
            max: 1,
            step: 0.1,
          },
          condition: "enableOverlay.eq.true",
        },
      ],
    },
  ],
});
