import type { HydrogenComponentProps } from "@weaverse/hydrogen";
import { createSchema } from "@weaverse/hydrogen";
import { useLoaderData } from "react-router";
import type { CollectionDetailsQuery } from "storefront-api.generated";
import { cn } from "~/utils/cn";

interface CollectionBannerProps extends HydrogenComponentProps {
  sectionHeightDesktop: number;
  sectionHeightMobile: number;
  enableBackground: boolean;
  overlayOpacity: number;
  enableOverlay: boolean;
  contentPosition: string;
  ref?: React.Ref<HTMLElement>;
}

const CollectionBanner = (props: CollectionBannerProps) => {
  const {
    ref,
    sectionHeightDesktop,
    sectionHeightMobile,
    enableBackground,
    overlayOpacity,
    enableOverlay,
    contentPosition,
    ...rest
  } = props;

  const { collection } = useLoaderData<
    CollectionDetailsQuery & {
      collections: Array<{ handle: string; title: string }>;
    }
  >();

  const positionClass: Record<string, string> = {
    "top left": "items-start justify-start",
    "top right": "items-start justify-end",
    "top center": "items-start justify-center",
    "center left": "items-center justify-start",
    "center center": "items-center justify-center",
    "center right": "items-center justify-end",
    "bottom left": "items-end justify-start",
    "bottom center": "items-end justify-center",
    "bottom right": "items-end justify-end",
  };

  const imageUrl = collection?.image?.url;

  return (
    <section
      ref={ref}
      {...rest}
      style={
        {
          "--header-height-desktop": `${sectionHeightDesktop}px`,
          "--header-height-mobile": `${sectionHeightMobile}px`,
          backgroundImage:
            enableBackground && imageUrl ? `url('${imageUrl}')` : undefined,
        } as React.CSSProperties
      }
      className={cn(
        "flex relative overflow-hidden bg-center bg-no-repeat bg-cover h-(--header-height-mobile) sm:h-(--header-height-desktop)",
        positionClass[contentPosition],
      )}
    >
      {enableOverlay && enableBackground && (
        <div
          className="absolute inset-0 z-10 bg-black"
          style={{ opacity: overlayOpacity }}
        />
      )}
      <div
        className={cn(
          "text-center w-5/6 z-20 relative p-6",
          enableBackground ? "text-white" : "text-text-primary",
        )}
      >
        <h3 className="leading-tight font-medium text-4xl sm:text-5xl">
          {collection?.title}
        </h3>
        {collection?.description && (
          <p className="mt-4 text-base md:text-lg max-w-2xl mx-auto opacity-90">
            {collection.description}
          </p>
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
      group: "Banner",
      inputs: [
        {
          type: "switch",
          name: "enableBackground",
          label: "Enable background",
          defaultValue: true,
        },
        {
          type: "range",
          name: "sectionHeightDesktop",
          label: "Section height desktop",
          defaultValue: 450,
          configs: {
            min: 350,
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
          type: "switch",
          name: "enableOverlay",
          label: "Enable overlay",
          defaultValue: true,
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
          condition: `enableOverlay.eq.true`,
        },
        {
          type: "position",
          name: "contentPosition",
          label: "Content position",
          defaultValue: "center center",
        },
      ],
    },
  ],
});
