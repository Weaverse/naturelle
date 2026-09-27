import type { HydrogenComponentProps } from "@weaverse/hydrogen";
import { createSchema, useParentInstance } from "@weaverse/hydrogen";
import clsx from "clsx";
import React from "react";
import {
  IconHighlightLeaf,
  IconHighlightPaw,
  IconHighlightSparkle,
} from "~/components/icon";
import { useIsContactPage } from "~/hooks/use-is-contact-page";

interface HightlightProps extends HydrogenComponentProps {
  visibleOnMobile: boolean;
  iconColor: string;
}

const HighlightItem = ({
  ref,
  ...props
}: HightlightProps & { ref?: React.RefObject<HTMLDivElement | null> }) => {
  let { visibleOnMobile, iconColor, children, ...rest } = props;
  const isContactPage = useIsContactPage();

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
        "flex w-full flex-col items-center",
        isContactPage
          ? [
              "rounded-(--border-radius-xl,16px) border-2 border-border-subtle bg-transparent px-6 py-9 transition-colors hover:border-border focus-within:border-border",
              "[&_.heading]:!w-full [&_.heading]:!max-w-none [&_.heading]:!font-heading [&_.heading]:!text-[31px] [&_.heading]:!leading-[110%] [&_.heading]:!font-normal [&_.heading]:!text-text [&_.heading]:!text-center",
              "[&_.paragraph]:!w-full [&_.paragraph]:!max-w-none [&_.paragraph]:!font-body [&_.paragraph]:!text-base [&_.paragraph]:!leading-[160%] [&_.paragraph]:!font-normal [&_.paragraph]:!tracking-[-0.16px] [&_.paragraph]:!text-text [&_.paragraph]:!text-center",
            ]
          : "rounded-2xl bg-background-basic px-6 py-10",
        !visibleOnMobile && "hidden md:flex",
      )}
    >
      {isContactPage ? (
        <span className="mb-6 flex size-11 shrink-0 items-center justify-center rounded-full border border-text font-heading text-xl leading-[150%] font-normal tracking-[-0.2px] text-text">
          {safeIndex + 1}
        </span>
      ) : (
        <Icon
          aria-hidden="true"
          className="mb-6 size-12 shrink-0"
          style={{ color: iconColor }}
        />
      )}
      {React.Children.map(children, (child, index) => (
        <React.Fragment key={child?.key ?? index}>
          <div className="flex w-full items-center justify-center text-center">
            {child}
          </div>
          {index < (children?.length ?? 0) - 1 && (
            <div
              className={clsx(
                "w-full border-t border-border-subtle",
                isContactPage ? "my-4" : "my-6",
              )}
            />
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
        {
          type: "color",
          label: "Icon color",
          name: "iconColor",
          defaultValue: "#4BAE42",
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
