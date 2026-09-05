import {
  createSchema,
  type HydrogenComponentProps,
  useChildInstances,
} from "@weaverse/hydrogen";
import {
  createContext,
  type RefObject,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Button } from "~/components/button";
import Heading from "~/components/heading";
import { cn } from "~/utils/cn";

type MapData = {
  mapPosition: "left" | "right";
  heading: string;
  buttonText: string;
  buttonLink: string;
  buttonTarget: "_self" | "_blank";
};

type MapContextValue = {
  activeItem: number;
  selectAddress: (index: number, address: string) => void;
};

export const MapContext = createContext<MapContextValue>({
  activeItem: 0,
  selectAddress: () => undefined,
});

function MapFrame({ address }: { address: string }) {
  return (
    <div className="map-media relative min-h-90 min-w-0 overflow-hidden bg-background-subtle-1 md:min-h-140 md:flex-[1_1_var(--container-xl)]">
      <iframe
        key={address}
        title="Store location map"
        src={`https://maps.google.com/maps?t=m&q=${encodeURIComponent(address)}&ie=UTF8&output=embed`}
        className="absolute inset-0 h-full w-full border-0"
        loading="lazy"
        allowFullScreen
      />
    </div>
  );
}

export default function MapSection({
  ref,
  ...props
}: HydrogenComponentProps & MapData & { ref?: RefObject<HTMLElement | null> }) {
  const {
    mapPosition = "right",
    heading,
    buttonText,
    buttonLink,
    buttonTarget,
    children,
    ...rest
  } = props;
  const childInstances = useChildInstances();
  const firstItem = childInstances.find(
    (instance) => instance.data.type === "map--item",
  );
  const firstAddress = (firstItem?.data.address as string | undefined) || "";
  const [activeItem, setActiveItem] = useState(0);
  const [activeAddress, setActiveAddress] = useState(firstAddress);

  useEffect(() => {
    setActiveItem(0);
    setActiveAddress(firstAddress);
  }, [firstAddress]);

  const contextValue = useMemo(
    () => ({
      activeItem,
      selectAddress: (index: number, address: string) => {
        setActiveItem(index);
        setActiveAddress(address);
      },
    }),
    [activeItem],
  );

  return (
    <MapContext.Provider value={contextValue}>
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
          <MapFrame address={activeAddress} />
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
    </MapContext.Provider>
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
          type: "select",
          name: "mapPosition",
          label: "Map position",
          configs: {
            options: [
              { value: "left", label: "Left" },
              { value: "right", label: "Right" },
            ],
          },
          defaultValue: "right",
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
    mapPosition: "right",
    heading: "Visit our store",
    buttonText: "Get directions",
    buttonLink: "https://maps.google.com",
    buttonTarget: "_blank",
    children: [
      {
        type: "map--item",
        title: "Our address",
        address: "123 Naturelle Street, New York, NY 10001",
        paragraph: "123 Naturelle Street, New York, NY 10001",
      },
      {
        type: "map--item",
        title: "Opening hours",
        address: "123 Naturelle Street, New York, NY 10001",
        paragraph: "Monday–Friday, 9:00 AM–6:00 PM",
      },
    ],
  },
});
