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

let variants = cva("px-0 py-20 md:px-10 [&_.paragraph]:mx-[unset]", {
  variants: {
    layout: {
      col: "flex flex-col gap-10",
      row: [
        "flex flex-col gap-10",
        "lg:grid lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:items-center lg:gap-10",
        "lg:[&_.countdown-content]:!items-start lg:[&_.heading]:!text-left lg:[&_.paragraph]:!text-left",
      ],
    },
    alignment: {
      left: "items-center justify-items-center md:items-start md:justify-items-start [&_.countdown-content]:items-center md:[&_.countdown-content]:items-start [&_.paragraph]:[text-align:center] md:[&_.paragraph]:[text-align:left]",
      center:
        "items-center justify-items-center [&_.countdown-content]:items-center [&_.paragraph]:[text-align:center]",
      right:
        "items-center justify-items-center md:items-end md:justify-items-end [&_.countdown-content]:items-center md:[&_.countdown-content]:items-end [&_.paragraph]:[text-align:center] md:[&_.paragraph]:[text-align:right]",
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
          <div className="flex flex-col items-center gap-10 lg:flex-row lg:gap-0">
            {timerChildren}
            <div className="h-px w-28 border-t border-current opacity-30 lg:h-auto lg:w-auto lg:self-stretch lg:border-t-0 lg:border-r lg:pl-10" />
          </div>
          <div className="countdown-content w-full flex flex-col items-start gap-2">
            {contentChildren}
          </div>
          {buttonChildren}
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
