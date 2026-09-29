import type { HydrogenComponentProps } from "@weaverse/hydrogen";
import { createSchema } from "@weaverse/hydrogen";
import clsx from "clsx";
import React from "react";

interface ContactHighlightsContentProps extends HydrogenComponentProps {
  itemsPerRow: number;
}

const itemsPerRowClasses: Record<number, string> = {
  1: "md:grid-cols-1",
  2: "md:grid-cols-2",
  3: "md:grid-cols-3",
  4: "md:grid-cols-4",
};

const ContactHighlightsContent = ({
  ref,
  itemsPerRow,
  children,
  ...rest
}: ContactHighlightsContentProps & {
  ref?: React.RefObject<HTMLDivElement | null>;
}) => {
  const actualItemsPerRow = Math.min(
    itemsPerRow,
    React.Children.count(children),
  );

  return (
    <div
      ref={ref}
      {...rest}
      className={clsx(
        "flex flex-col gap-4 md:grid",
        itemsPerRowClasses[actualItemsPerRow],
      )}
    >
      {children}
    </div>
  );
};

export default ContactHighlightsContent;

export const schema = createSchema({
  type: "contact-highlights--content",
  title: "Contact highlight list",
  settings: [
    {
      group: "Layout",
      inputs: [
        {
          type: "range",
          name: "itemsPerRow",
          label: "Items per row",
          defaultValue: 3,
          configs: {
            min: 1,
            max: 4,
            step: 1,
          },
        },
      ],
    },
  ],
  childTypes: ["contact-highlights--item"],
  presets: {
    itemsPerRow: 3,
    children: [
      { type: "contact-highlights--item" },
      { type: "contact-highlights--item" },
      { type: "contact-highlights--item" },
    ],
  },
});
