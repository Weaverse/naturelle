import { createSchema } from "@weaverse/hydrogen";
import type React from "react";
import { Section, type SectionProps } from "~/components/section";

type HotspotsProps = SectionProps;

let Hotspots = ({
  ref,
  ...props
}: HotspotsProps & { ref?: React.RefObject<HTMLElement | null> }) => {
  let { children, ...rest } = props;
  return (
    <Section
      ref={ref}
      {...rest}
      width="full"
      gap={0}
      verticalPadding="none"
      overflow="unset"
      containerClassName="max-w-none p-0"
    >
      <div data-motion="zoom-in" className="w-full">
        {children}
      </div>
    </Section>
  );
};

export default Hotspots;

export const schema = createSchema({
  type: "hotspots",
  title: "Hotspots",
  childTypes: ["image-hotspots"],
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
          type: "range",
          name: "gap",
          label: "Items spacing",
          configs: {
            min: 0,
            max: 60,
            step: 4,
            unit: "px",
          },
          defaultValue: 20,
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
  ],
  presets: {
    width: "full",
    gap: 0,
    verticalPadding: "none",
    children: [
      {
        type: "image-hotspots",
      },
    ],
  },
});
