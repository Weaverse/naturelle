import type { HydrogenComponentSchema } from "@weaverse/hydrogen";
import React, { forwardRef } from "react";
import { Section, SectionProps } from "../atoms/Section";
import Heading from "../atoms/Heading";
import Description from "../atoms/Description";
import clsx from "clsx";

type HotspotsProps = SectionProps & {
  heading?: string;
  description?: string;
};

let Hotspots = forwardRef<HTMLElement, HotspotsProps>((props, ref) => {
  let { heading, description, children, ...rest } = props;
  return (
    <Section ref={ref} {...rest} overflow="unset">
      {heading && <Heading data-motion="fade-up" as="h2" content={heading} />}
      {description && (
        <Description
          data-motion="fade-up"
          as="p"
          content={description}
          alignment="center"
        />
      )}
      <div
        data-motion="zoom-in"
        className={clsx(
          "grid grid-cols-1 gap-4 md:gap-6 lg:gap-8 w-full h-full",
          React.Children.count(children) > 1
            ? "sm:grid-cols-2"
            : "sm:grid-cols-1"
        )}
      >
        {children}
      </div>
    </Section>
  );
});

export default Hotspots;

export let schema: HydrogenComponentSchema = {
  type: "hotspots",
  title: "Hotspots",
  childTypes: ["image-hotspots"],
  inspector: [
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
    {
      group: "Heading (optional)",
      inputs: [
        {
          type: "text",
          name: "heading",
          label: "Heading",
          defaultValue: "Shop the look",
          placeholder: "Shop the look",
        },
        {
          type: "richtext",
          name: "description",
          label: "Description",
        },
      ],
    },
  ],
  toolbar: ["general-settings", ["duplicate", "delete"]],
  presets: {
    heading: "Shop the look",
    gap: 40,
    children: [
      {
        type: "image-hotspots",
      },
    ],
  },
};
