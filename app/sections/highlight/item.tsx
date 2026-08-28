import type { HydrogenComponentProps } from "@weaverse/hydrogen";
import { createSchema, useParentInstance } from "@weaverse/hydrogen";
import clsx from "clsx";
import React from "react";
import {
  IconHighlightLeaf,
  IconHighlightPaw,
  IconHighlightSparkle,
} from "~/components/icon";

interface HightlightProps extends HydrogenComponentProps {
  visibleOnMobile: boolean;
}

const HighlightItem = ({
  ref,
  ...props
}: HightlightProps & { ref?: React.RefObject<HTMLDivElement | null> }) => {
  let { visibleOnMobile, children, ...rest } = props;

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

  return (
    <div
      ref={ref}
      {...rest}
      data-motion="slide-in"
      className={clsx(
        "flex w-full flex-col items-center rounded-2xl bg-white px-6 py-10",
        !visibleOnMobile && "hidden md:flex",
      )}
    >
      <Icon
        aria-hidden="true"
        className="mb-6 size-12 shrink-0 text-[#4BAE42]"
      />
      {React.Children.map(children, (child, index) => (
        <React.Fragment key={child?.key ?? index}>
          <div className="flex w-full items-center justify-center text-center">
            {child}
          </div>
          {index < (children?.length ?? 0) - 1 && (
            <div className="my-6 h-px w-full bg-[#DEDEDE]" />
          )}
        </React.Fragment>
      ))}
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
          type: "switch",
          label: "Visible on Mobile",
          name: "visibleOnMobile",
          defaultValue: true,
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
