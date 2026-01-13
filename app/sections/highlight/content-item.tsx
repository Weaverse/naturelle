import type { HydrogenComponentProps } from "@weaverse/hydrogen";
import { createSchema } from "@weaverse/hydrogen";
import clsx from "clsx";
import React, { type CSSProperties } from "react";

interface ContentProps extends HydrogenComponentProps {
  itemPerRow: number;
  gap: number;
  borderColor: string;
}

let itemsPerRowClasses: { [item: number]: string } = {
  1: "sm:grid-cols-1",
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-3",
  4: "sm:grid-cols-4",
};

const HighlightContent = ({
  ref,
  ...props
}: ContentProps & { ref?: React.RefObject<HTMLDivElement | null> }) => {
  let { itemPerRow, gap, borderColor, children, ...rest } = props;
  let style: CSSProperties = {
    "--item-gap": `${gap}px`,
    "--border-color": borderColor,
  } as CSSProperties;
  let actualItemPerRow = Math.min(itemPerRow, React.Children.count(children));
  return (
    <div
      ref={ref}
      {...rest}
      className={clsx(
        "flex flex-col sm:grid gap-y-6 gap-x-(--item-gap)",
        itemsPerRowClasses[actualItemPerRow],
      )}
      style={style}
    >
      {children}
    </div>
  );
};

export default HighlightContent;

export const schema = createSchema({
  type: "highlight-content--item",
  title: "List items",
  settings: [
    {
      group: "Highlights",
      inputs: [
        {
          type: "range",
          name: "itemPerRow",
          label: "Items per row",
          defaultValue: 3,
          configs: {
            min: 1,
            max: 4,
            step: 1,
          },
        },
        {
          type: "range",
          label: "Gap",
          name: "gap",
          configs: {
            min: 16,
            max: 40,
            step: 6,
          },
          defaultValue: 16,
        },
        {
          type: "color",
          label: "Border color",
          name: "borderColor",
          defaultValue: "#9AA473",
        },
      ],
    },
  ],
  childTypes: ["highlight--item"],
  presets: {
    children: [
      {
        type: "highlight--item",
      },
      {
        type: "highlight--item",
      },
      {
        type: "highlight--item",
      },
    ],
  },
});
