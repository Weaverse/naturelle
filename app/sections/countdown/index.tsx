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

let variants = cva("px-0 md:px-10 [&_.paragraph]:mx-[unset]", {
  variants: {
    layout: {
      col: "flex flex-col gap-(--countdown-gap) [&_.heading]:w-fit [&_.paragraph]:w-fit",
      row: [
        "flex flex-col gap-(--countdown-gap)",
        "max-lg:[&_.heading]:w-fit max-lg:[&_.paragraph]:w-fit",
        "lg:grid lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:items-center lg:[&_.heading]:w-full",
      ],
    },
    alignment: {
      left: "items-start justify-items-start [&_.countdown-content]:items-start",
      center:
        "items-center justify-items-center [&_.countdown-content]:items-center",
      right: "items-end justify-items-end [&_.countdown-content]:items-end",
    },
  },
  defaultVariants: {
    layout: "row",
  },
});

interface CountdownProps extends VariantProps<typeof variants>, SectionProps {}

let Countdown = ({
  ref,
  ...props
}: CountdownProps & { ref?: RefObject<HTMLElement | null> }) => {
  let {
    children,
    alignment,
    layout = "row",
    gap = 40,
    verticalPadding = "medium",
    backgroundFor = "section",
    borderRadius = 0,
    style,
    ...rest
  } = props;
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
      backgroundFor={backgroundFor}
      borderRadius={borderRadius}
      gap={0}
      verticalPadding={verticalPadding}
      containerClassName={variants({ alignment, layout })}
      style={
        {
          ...style,
          "--countdown-gap": `${gap}px`,
        } as React.CSSProperties
      }
    >
      {layout === "row" ? (
        <>
          <div className="flex flex-col items-center gap-10 lg:flex-row lg:gap-0">
            {timerChildren}
            <div className="h-px w-28 border-t border-current opacity-30 lg:h-auto lg:w-auto lg:self-stretch lg:border-t-0 lg:border-r lg:pl-10" />
          </div>
          <div className="countdown-content w-full flex flex-col items-start gap-4 [&_.paragraph]:opacity-80">
            {contentChildren}
          </div>
          {buttonChildren}
        </>
      ) : (
        <>
          <div className="countdown-content flex flex-col gap-4 [&_.paragraph]:opacity-80">
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
        {
          type: "range",
          name: "gap",
          label: "Items spacing",
          configs: {
            min: 0,
            max: 60,
            step: 4,
            unit: "px",
          },
          defaultValue: 40,
        },
        {
          type: "select",
          name: "verticalPadding",
          label: "Vertical padding",
          configs: {
            options: [
              { value: "none", label: "None" },
              { value: "small", label: "Small" },
              { value: "medium", label: "Medium" },
              { value: "large", label: "Large" },
            ],
          },
          defaultValue: "medium",
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
