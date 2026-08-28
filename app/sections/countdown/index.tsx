import {
  createSchema,
  IMAGES_PLACEHOLDERS,
  useChildInstances,
} from "@weaverse/hydrogen";
import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import React, { type RefObject } from "react";
import { backgroundInputs } from "~/components/background-image";
import { overlayInputs } from "~/components/overlay";
import { Section, type SectionProps } from "~/components/section";

let variants = cva(
  "px-0 py-20 sm:px-0 md:px-10 lg:px-0 [&_.paragraph]:mx-[unset]",
  {
    variants: {
      layout: {
        col: "flex flex-col gap-10",
        row: [
          "flex flex-col gap-10",
          "md:grid md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:items-center md:gap-x-10 md:gap-y-0",
          "md:[&_.countdown-row-content]:!items-end md:[&_.countdown-content]:!items-end",
          "md:[&_.heading]:!text-right md:[&_.paragraph]:!text-right",
          "lg:grid-cols-[auto_auto_1fr_auto]",
          "lg:[&>.countdown--timer]:-ml-12",
          "lg:[&_.countdown-content]:!items-start lg:[&_.heading]:!text-left lg:[&_.paragraph]:!text-left",
        ],
      },
      alignment: {
        left: "items-center justify-items-center md:items-start md:justify-items-start [&_.countdown-content]:items-center md:[&_.countdown-content]:items-start [&_.countdown-row-content]:items-center md:[&_.countdown-row-content]:items-start [&_.paragraph]:[text-align:center] md:[&_.paragraph]:[text-align:left]",
        center:
          "items-center justify-items-center [&_.countdown-content]:items-center [&_.countdown-row-content]:items-center [&_.paragraph]:[text-align:center]",
        right:
          "items-center justify-items-center md:items-end md:justify-items-end [&_.countdown-content]:items-center md:[&_.countdown-content]:items-end [&_.countdown-row-content]:items-center md:[&_.countdown-row-content]:items-end [&_.paragraph]:[text-align:center] md:[&_.paragraph]:[text-align:right]",
      },
    },
    defaultVariants: {
      layout: "row",
    },
  },
);

interface CountdownProps extends VariantProps<typeof variants>, SectionProps {}

let Countdown = ({
  ref,
  ...props
}: CountdownProps & { ref?: RefObject<HTMLElement | null> }) => {
  let { children, alignment, layout = "row", ...rest } = props;
  let childItems = React.Children.toArray(children);
  let childInstances = useChildInstances();
  let childTypes = new Map(
    childInstances.map((instance) => [instance.data.id, instance.data.type]),
  );
  let getChildType = (child: React.ReactNode) => {
    if (!React.isValidElement(child)) {
      return;
    }
    let childId = (child.props as { id?: string }).id;
    return childId ? childTypes.get(childId) : undefined;
  };
  let timerChildren = childItems.filter(
    (child) => getChildType(child) === "countdown--timer",
  );
  let buttonChildren = childItems.filter(
    (child) => getChildType(child) === "button",
  );
  let contentChildren = childItems.filter((child) => {
    let type = getChildType(child);
    return type !== "countdown--timer" && type !== "button";
  });

  return (
    <Section
      ref={ref}
      {...rest}
      verticalPadding="none"
      containerClassName={variants({ alignment, layout })}
    >
      {layout === "row" ? (
        <>
          {timerChildren}
          <div className="h-px w-28 border-t border-current opacity-30 md:w-auto md:border-t-0 md:border-r" />
          <div className="countdown-row-content flex flex-col gap-10 md:w-full lg:contents">
            <div className="countdown-content flex flex-col gap-2">
              {contentChildren}
            </div>
            {buttonChildren}
          </div>
        </>
      ) : (
        <>
          <div className="countdown-content flex flex-col gap-2">
            {contentChildren}
          </div>
          {timerChildren}
          {buttonChildren}
        </>
      )}
    </Section>
  );
};

export default Countdown;

export const schema = createSchema({
  type: "countdown",
  title: "Countdown",
  settings: [
    {
      group: "Layout",
      inputs: [
        {
          type: "select",
          name: "width",
          label: "Content width",
          configs: {
            options: [
              { value: "full", label: "Full page" },
              { value: "stretch", label: "Stretch" },
              { value: "fixed", label: "Fixed" },
            ],
          },
          defaultValue: "fixed",
        },
        {
          type: "toggle-group",
          name: "layout",
          label: "Layout",
          configs: {
            options: [
              { value: "row", label: "Row", icon: "columns-3" },
              { value: "col", label: "Column", icon: "rows-3" },
            ],
          },
          defaultValue: "row",
        },
        {
          type: "toggle-group",
          name: "alignment",
          label: "Alignment",
          condition: "layout.ne.col",
          configs: {
            options: [
              { value: "left", label: "Left", icon: "align-start-vertical" },
              {
                value: "center",
                label: "Center",
                icon: "align-center-vertical",
              },
              { value: "right", label: "Right", icon: "align-end-vertical" },
            ],
          },
          defaultValue: "center",
        },
        {
          type: "range",
          name: "borderRadius",
          label: "Corner radius",
          configs: {
            min: 0,
            max: 40,
            step: 2,
            unit: "px",
          },
          defaultValue: 0,
        },
      ],
    },
    { group: "Background", inputs: backgroundInputs },
    { group: "Overlay", inputs: overlayInputs },
  ],
  childTypes: ["heading", "subheading", "countdown--timer", "button"],
  presets: {
    backgroundImage: IMAGES_PLACEHOLDERS.banner_1,
    width: "stretch",
    layout: "row",
    backgroundFor: "content",
    borderRadius: 30,
    alignment: "left",
    children: [
      {
        type: "heading",
        content: "Sale ends in",
      },
      {
        type: "paragraph",
        content: "Use this timer to create urgency and boost sales.",
        width: "full",
      },
      {
        type: "countdown--timer",
      },
      {
        type: "button",
        content: "Shop now",
      },
    ],
  },
});
