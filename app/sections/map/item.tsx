import type { HydrogenComponentProps } from "@weaverse/hydrogen";
import { createSchema } from "@weaverse/hydrogen";
import type { RefObject } from "react";

type MapItemData = {
  title: string;
  paragraph: string;
};

type MapItemProps = HydrogenComponentProps & MapItemData;

export default function MapItem({
  ref,
  ...props
}: MapItemProps & { ref?: RefObject<HTMLDivElement | null> }) {
  const { title, paragraph, ...rest } = props;

  return (
    <div
      ref={ref}
      {...rest}
      className="flex flex-col gap-2"
      data-motion="fade-up"
    >
      {title && (
        <p className="font-body text-xs font-normal uppercase leading-none tracking-[-0.01em] text-text-primary/50">
          {title}
        </p>
      )}
      {paragraph && (
        <div
          className="text-sm leading-relaxed text-text"
          dangerouslySetInnerHTML={{ __html: paragraph }}
        />
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
          type: "richtext",
          name: "paragraph",
          label: "Paragraph",
          defaultValue: "Monday–Friday, 9:00 AM–6:00 PM",
        },
      ],
    },
  ],
  presets: {
    title: "Opening hours",
    paragraph: "Monday–Friday, 9:00 AM–6:00 PM",
  },
});
