import type { HydrogenComponentProps, WeaverseImage } from "@weaverse/hydrogen";
import { createSchema, IMAGES_PLACEHOLDERS } from "@weaverse/hydrogen";
import {
  type CSSProperties,
  createContext,
  type RefObject,
  useMemo,
  useState,
} from "react";
import { Image } from "~/components/image";

interface HotspotsContextValue {
  activeItem: number;
  panelTarget: HTMLDivElement | null;
  selectItem: (index: number) => void;
}

export const HotspotsContext = createContext<HotspotsContextValue>({
  activeItem: 0,
  panelTarget: null,
  selectItem: () => undefined,
});

interface HotspotsImageProps extends HydrogenComponentProps {
  image: string;
}

const HotspotsImage = ({
  ref,
  ...props
}: HotspotsImageProps & { ref?: RefObject<HTMLDivElement | null> }) => {
  let { image, children, ...rest } = props;
  let imageData: Partial<WeaverseImage> =
    typeof image === "string"
      ? { url: image, altText: "Hotspots image" }
      : image;
  const [activeIndex, setActiveIndex] = useState(0);
  const [panelTarget, setPanelTarget] = useState<HTMLDivElement | null>(null);
  const contextValue = useMemo(
    () => ({
      activeItem: activeIndex,
      panelTarget,
      selectItem: setActiveIndex,
    }),
    [activeIndex, panelTarget],
  );

  return (
    <HotspotsContext.Provider value={contextValue}>
      <div
        ref={ref}
        {...rest}
        style={
          {
            "--hotspot-background-image": imageData.url
              ? `url("${imageData.url}")`
              : "none",
          } as CSSProperties
        }
        className="grid w-full md:grid-cols-2"
      >
        <div className="relative aspect-square w-full overflow-visible md:aspect-auto md:min-h-[clamp(780px,50vw,863px)]">
          <Image
            data={imageData}
            sizes="auto"
            className="z-0 h-full w-full object-cover"
            imageClassName="rounded-none"
          />
          {children}
        </div>
        <div ref={setPanelTarget} className="min-w-0" />
      </div>
    </HotspotsContext.Provider>
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
      ],
    },
  ],
  presets: {
    image: IMAGES_PLACEHOLDERS.collection_4,
    children: [
      {
        type: "hotspots--item",
        offsetX: 25,
        offsetY: 30,
      },
    ],
  },
});
