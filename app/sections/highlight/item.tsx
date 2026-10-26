import { Image } from "@shopify/hydrogen";
import type { HydrogenComponentProps, WeaverseImage } from "@weaverse/hydrogen";
import { createSchema, useParentInstance } from "@weaverse/hydrogen";
import React from "react";
import {
  IconHighlightLeaf,
  IconHighlightPaw,
  IconHighlightSparkle,
} from "~/components/icon";

interface HightlightProps extends HydrogenComponentProps {
  iconImage?: WeaverseImage;
  iconColor: string;
}

const HighlightItem = ({
  ref,
  ...props
}: HightlightProps & { ref?: React.RefObject<HTMLDivElement | null> }) => {
  let { iconImage, iconColor, children, ...rest } = props;

  let parentInstance = useParentInstance();
  let firstChild = React.Children.toArray(children)[0] as
    | React.ReactElement<{ parentId?: string }>
    | undefined;
  let itemIndex = (
    parentInstance?._store?.children as { id: string }[] | undefined
  )?.findIndex((child) => child.id === firstChild?.props.parentId);
  let safeIndex = itemIndex !== undefined && itemIndex >= 0 ? itemIndex : 0;
  let icons = [IconHighlightPaw, IconHighlightLeaf, IconHighlightSparkle];
  let Icon = icons[safeIndex % icons.length];
  const iconImageUrl = iconImage?.url?.trim();
  const content = React.Children.toArray(children);

  return (
    <div
      ref={ref}
      {...rest}
      data-motion="slide-in"
      className="row-span-3 grid w-full grid-rows-subgrid justify-items-center gap-y-0 rounded-2xl bg-background-basic px-6 py-10"
    >
      <div className="mb-6 flex size-12 shrink-0 items-center justify-center">
        {iconImageUrl ? (
          <Image
            data={iconImage}
            className="size-full object-contain"
            sizes="48px"
          />
        ) : (
          <Icon
            aria-hidden="true"
            className="size-full"
            style={{ color: iconColor }}
          />
        )}
      </div>
      <div className="flex w-full items-center justify-center text-center">
        {content[0]}
      </div>
      <div className="w-full">
        {content.slice(1).map((child) => (
          <div
            key={(child as React.ReactElement).key}
            className="mt-6 border-t border-border-subtle pt-6 text-center"
          >
            {child}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HighlightItem;

export const schema = createSchema({
  type: "highlight--item",
  title: "Highlight",
  limit: 8,
  settings: [
    {
      group: "Highlight",
      inputs: [
        {
          type: "image",
          label: "Icon image",
          name: "iconImage",
        },
        {
          type: "color",
          label: "Icon color",
          name: "iconColor",
          defaultValue: "#4BAE42",
          condition: (data: HightlightProps) => !data.iconImage?.url?.trim(),
        },
      ],
    },
  ],
  childTypes: ["heading", "paragraph"],
  presets: {
    children: [
      {
        type: "heading",
        content: "Heading",
      },
      {
        type: "paragraph",
        content:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
      },
    ],
  },
});
