import {
  createSchema,
  type HydrogenComponentProps,
  useChildInstances,
  useItemInstance,
  useParentInstance,
} from "@weaverse/hydrogen";
import { type RefObject, useContext, useEffect } from "react";
import { MapContext } from "./index";

type MapItemData = { title: string; address: string; paragraph: string };

export default function MapItem({
  ref,
  ...props
}: HydrogenComponentProps &
  MapItemData & { ref?: RefObject<HTMLDivElement | null> }) {
  const { title, address, paragraph, ...rest } = props;
  const { activeItem, selectAddress } = useContext(MapContext);
  const itemInstance = useItemInstance();
  const parentInstance = useParentInstance();
  const siblings = useChildInstances(parentInstance?._id);
  const instanceIndex = siblings.findIndex(
    (instance) => instance._id === itemInstance?._id,
  );
  const itemIndex = instanceIndex >= 0 ? instanceIndex : 0;
  const isActive = activeItem === itemIndex;

  useEffect(() => {
    if (isActive && address) {
      selectAddress(itemIndex, address);
    }
  }, [address, isActive, itemIndex, selectAddress]);

  return (
    <div
      ref={ref}
      {...rest}
      className="flex flex-col gap-2"
      data-motion="fade-up"
      onClick={() => selectAddress(itemIndex, address)}
    >
      {title && (
        <p className="font-body text-xs font-normal uppercase leading-none tracking-[-0.01em] text-text-primary/50">
          {title}
        </p>
      )}
      {paragraph && (
        <div className="text-sm leading-relaxed text-text">{paragraph}</div>
      )}
    </div>
  );
}

export const schema = createSchema({
  type: "map--item",
  title: "Map item",
  settings: [
    {
      group: "Content",
      inputs: [
        {
          type: "text",
          name: "title",
          label: "Title",
          defaultValue: "Opening hours",
        },
        {
          type: "text",
          name: "address",
          label: "Map address",
          defaultValue: "123 Naturelle Street, New York, NY 10001",
          helpText:
            "Use a complete street address so the embedded map can locate it accurately.",
        },
        {
          type: "text",
          name: "paragraph",
          label: "Paragraph",
          defaultValue: "Monday–Friday, 9:00 AM–6:00 PM",
        },
      ],
    },
  ],
  presets: {
    title: "Opening hours",
    address: "123 Naturelle Street, New York, NY 10001",
    paragraph: "Monday–Friday, 9:00 AM–6:00 PM",
  },
});
