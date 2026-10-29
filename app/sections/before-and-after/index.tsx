import { createSchema, useChildInstances } from "@weaverse/hydrogen";
import React, { type CSSProperties } from "react";
import { Button } from "~/components/button";
import { layoutInputs, Section, type SectionProps } from "~/components/section";
import { cn } from "~/utils/cn";

interface BeforeAndAfterData {
  showContent?: boolean;
  description?: string;
  firstStatValue?: string;
  firstStatLabel?: string;
  secondStatValue?: string;
  secondStatLabel?: string;
  thirdStatValue?: string;
  thirdStatLabel?: string;
  buttonText?: string;
  buttonLink?: string;
  backgroundColor?: string;
  accentColor?: string;
}

export interface BeforeAndAfterProps extends SectionProps, BeforeAndAfterData {
  ref?: React.Ref<HTMLElement>;
}

export default function BeforeAndAfter(props: BeforeAndAfterProps) {
  let {
    ref,
    children,
    gap = 20,
    showContent = true,
    description = "Discover a radiant complexion that starts at the source. Our expertly crafted formulas combine potent botanical actives with gentle, skin-loving ingredients to reveal your natural glow—soft, luminous, and effortlessly yours.",
    firstStatValue = "94%",
    firstStatLabel = "saw brighter skin",
    secondStatValue = "87%",
    secondStatLabel = "reduced fine lines",
    thirdStatValue = "91%",
    thirdStatLabel = "improved hydration",
    buttonText = "Shop Now",
    buttonLink = "/products",
    backgroundColor = "#E2E6F8",
    accentColor = "#6E91CD",
    ...rest
  } = props;
  const childItems = React.Children.toArray(children);
  const childTypes = new Map(
    useChildInstances().map((instance) => [
      instance.data.id,
      instance.data.type,
    ]),
  );
  const sliderChildren = childItems.filter((child) => {
    if (!React.isValidElement(child)) {
      return false;
    }
    const childId = (child.props as { id?: string }).id;
    return childId && childTypes.get(childId) === "before-after-slider";
  });
  const headingChild = childItems.find((child) => {
    if (!React.isValidElement(child)) {
      return false;
    }
    const childId = (child.props as { id?: string }).id;
    return childId && childTypes.get(childId) === "heading";
  });
  const stats = [
    { value: firstStatValue, label: firstStatLabel },
    { value: secondStatValue, label: secondStatLabel },
    { value: thirdStatValue, label: thirdStatLabel },
  ].filter(({ value, label }) => value?.trim() && label?.trim());
  const style = {
    "--before-after-accent": accentColor,
    "--before-after-gap": `${gap}px`,
  } as CSSProperties;

  return (
    <Section
      ref={ref}
      {...rest}
      backgroundColor={backgroundColor}
      backgroundFor="section"
      gap={gap}
      style={style}
    >
      {showContent ? (
        <div className="grid w-full items-stretch gap-[var(--before-after-gap)] desktop:has-[.before-after-slider]:grid-cols-2">
          <div className="flex min-w-0 flex-col items-start justify-center gap-[var(--before-after-gap)]">
            {headingChild}

            {description?.trim() && (
              <p
                data-motion="fade-up"
                className="w-full max-w-[560px] font-body text-lg leading-[160%] font-normal tracking-[-0.18px] text-text"
              >
                {description}
              </p>
            )}

            {stats.length > 0 && (
              <div
                data-motion="fade-up"
                className={cn(
                  "grid w-full items-start gap-6",
                  stats.length === 1 && "grid-cols-1",
                  stats.length === 2 && "grid-cols-2",
                  stats.length === 3 && "grid-cols-3",
                )}
              >
                {stats.map(({ value, label }, index) => (
                  <div
                    key={`${index}-${value}-${label}`}
                    className="flex min-w-0 flex-col items-start gap-1"
                  >
                    <p className="font-heading text-[44px] leading-[110%] font-normal text-(--before-after-accent)">
                      {value}
                    </p>
                    <p className="font-body text-sm leading-[140%] font-normal text-text opacity-70">
                      {label}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {buttonText?.trim() && (
              <div data-motion="fade-up" className="w-full pt-4">
                <Button
                  to={buttonLink || "/products"}
                  variant="primary"
                  className="h-auto min-h-13.5 rounded-xl px-6 py-3.5 font-body text-base leading-[160%] tracking-[-0.16px]"
                >
                  {buttonText}
                </Button>
              </div>
            )}
          </div>

          <div className="min-w-0 overflow-hidden rounded-2xl empty:hidden">
            {sliderChildren}
          </div>
        </div>
      ) : (
        <div className="w-full [&_.before-after-slider]:rounded-none">
          {sliderChildren}
        </div>
      )}
    </Section>
  );
}

const contentCondition = (data: BeforeAndAfterData) =>
  data.showContent !== false;

export const schema = createSchema({
  type: "before-and-after",
  title: "Before & After",
  settings: [
    {
      group: "Layout",
      inputs: layoutInputs.filter(
        ({ name }) => name !== "divider" && name !== "borderRadius",
      ),
    },
    {
      group: "Content",
      inputs: [
        {
          type: "switch",
          name: "showContent",
          label: "Show content",
          defaultValue: true,
        },
        {
          type: "textarea",
          name: "description",
          label: "Description",
          defaultValue:
            "Discover a radiant complexion that starts at the source. Our expertly crafted formulas combine potent botanical actives with gentle, skin-loving ingredients to reveal your natural glow—soft, luminous, and effortlessly yours.",
          condition: contentCondition,
        },
        {
          type: "text",
          name: "buttonText",
          label: "Button text",
          defaultValue: "Shop Now",
          condition: contentCondition,
        },
        {
          type: "url",
          name: "buttonLink",
          label: "Button link",
          defaultValue: "/products",
          condition: contentCondition,
        },
      ],
    },
    {
      group: "Stats",
      inputs: [
        {
          type: "text",
          name: "firstStatValue",
          label: "First stat value",
          defaultValue: "94%",
          condition: contentCondition,
        },
        {
          type: "text",
          name: "firstStatLabel",
          label: "First stat label",
          defaultValue: "saw brighter skin",
          condition: contentCondition,
        },
        {
          type: "text",
          name: "secondStatValue",
          label: "Second stat value",
          defaultValue: "87%",
          condition: contentCondition,
        },
        {
          type: "text",
          name: "secondStatLabel",
          label: "Second stat label",
          defaultValue: "reduced fine lines",
          condition: contentCondition,
        },
        {
          type: "text",
          name: "thirdStatValue",
          label: "Third stat value",
          defaultValue: "91%",
          condition: contentCondition,
        },
        {
          type: "text",
          name: "thirdStatLabel",
          label: "Third stat label",
          defaultValue: "improved hydration",
          condition: contentCondition,
        },
      ],
    },
    {
      group: "Style",
      inputs: [
        {
          type: "color",
          name: "backgroundColor",
          label: "Background color",
          defaultValue: "#E2E6F8",
        },
        {
          type: "color",
          name: "accentColor",
          label: "Stats color",
          defaultValue: "#6E91CD",
          condition: contentCondition,
        },
      ],
    },
  ],
  childTypes: ["heading", "before-after-slider"],
  presets: {
    children: [
      {
        type: "heading",
        content: "Before & After",
      },
      { type: "before-after-slider" },
    ],
  },
});
