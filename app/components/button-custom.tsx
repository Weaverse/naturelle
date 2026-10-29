import { createSchema } from "@weaverse/hydrogen";
import type { CSSProperties } from "react";
import { Button, type ButtonProps } from "~/components/button";
import { IconEllipse } from "~/components/icon";
import { cn } from "~/utils/cn";

export interface WeaverseButtonProps extends ButtonProps {
  href?: string;
  target?: string;
  radius?: number;
  textColorDecor?: string;
  backgroundColor?: string;
  textColor?: string;
  borderColor?: string;
  backgroundColorHover?: string;
  textColorHover?: string;
  borderColorHover?: string;
  // Weaverse specific props that might be passed
  buttonContent?: any;
  content?: any;
}

export default function ButtonCustom(props: WeaverseButtonProps) {
  const {
    ref,
    href,
    target,
    value,
    variant,
    shape,
    radius,
    fontFamily,
    textColorDecor,
    textColor,
    backgroundColor,
    borderColor,
    backgroundColorHover,
    textColorHover,
    borderColorHover,
    buttonContent,
    content,
    className,
    ...rest
  } = props;
  const Component = href ? "a" : "button";
  const style = {
    color: textColorDecor,
    "--text-color": textColor,
    "--background-color": backgroundColor,
    "--border-color": borderColor,
    "--background-color-hover": backgroundColorHover,
    "--text-color-hover": textColorHover,
    "--border-color-hover": borderColorHover,
    "--radius": `${radius}px`,
  } as CSSProperties;

  let styleButton = "";
  if (variant === "custom") {
    styleButton =
      "bg-(--background-color) border border-(--border-color) text-(--text-color)! hover:bg-(--background-color-hover) hover:text-(--text-color-hover)! hover:border-(--border-color-hover)";
  }

  return (
    <Button
      as={Component}
      to={href}
      data-motion="fade-up"
      target={target}
      variant={variant}
      shape={shape}
      fontFamily={fontFamily}
      ref={ref as any}
      {...rest}
      className={cn(
        "w-fit",
        variant === "decor" &&
          "group/decor h-auto min-h-0 rounded-full px-4 py-3 font-body text-base leading-none tracking-[-0.16px]",
        className,
        variant === "custom" && styleButton,
      )}
      style={style}
    >
      {variant === "decor" ? (
        <>
          <IconEllipse
            className="pointer-events-none absolute top-1/2 left-1/2 h-[61px]! w-[148px]! -translate-x-1/2 -translate-y-1/2 transition-transform duration-500 group-hover/decor:rotate-[-11deg]"
            stroke={textColorDecor ? textColorDecor : "var(--color-foreground)"}
            viewBox="0 0 148 61"
          />
          <span className="relative z-10 whitespace-nowrap">{value}</span>
        </>
      ) : (
        value
      )}
    </Button>
  );
}

export const schema = createSchema({
  title: "Button",
  type: "button",
  settings: [
    {
      group: "Button",
      inputs: [
        {
          type: "text",
          name: "value",
          label: "Text",
          defaultValue: "Shop now",
        },
        {
          type: "url",
          name: "href",
          label: "Link to",
          defaultValue: "/products",
          placeholder: "/products",
        },
        {
          type: "select",
          name: "target",
          label: "Target",
          defaultValue: "_self",
          configs: {
            options: [
              { label: "Open the current page", value: "_self" },
              { label: "Open a new page", value: "_blank" },
              { label: "Open the parent page", value: "_parent" },
              { label: "Open the first page", value: "_top" },
            ],
          },
        },
        {
          type: "heading",
          label: "Button style",
        },
        {
          type: "select",
          name: "variant",
          label: "Variant",
          defaultValue: "primary",
          configs: {
            options: [
              { label: "Primary", value: "primary" },
              { label: "Outline", value: "outline" },
              { label: "Secondary", value: "secondary" },
              { label: "Decor", value: "decor" },
              { label: "Custom", value: "custom" },
            ],
          },
        },
        {
          type: "select",
          name: "fontFamily",
          label: "Font family",
          defaultValue: "body",
          configs: {
            options: [
              { label: "Font body", value: "body" },
              { label: "Font heading", value: "heading" },
            ],
          },
          condition: "variant.eq.custom",
        },
        {
          type: "select",
          name: "size",
          label: "Button Size",
          defaultValue: "default",
          configs: {
            options: [
              { label: "Default", value: "default" },
              { label: "Small", value: "sm" },
              { label: "Large", value: "lg" },
              { label: "Icon", value: "icon" },
            ],
          },
          condition: `variant.ne.decor`,
        },
        {
          type: "select",
          name: "shape",
          label: "Shape",
          defaultValue: "round",
          configs: {
            options: [
              { label: "Default", value: "default" },
              { label: "Round", value: "round" },
              { label: "Customs", value: "customs" },
            ],
          },
          condition: `variant.ne.decor`,
        },
        {
          type: "range",
          label: "Radius",
          name: "radius",
          configs: {
            min: 0,
            max: 40,
            step: 2,
            unit: "px",
          },
          defaultValue: 0,
          condition: "shape.eq.customs",
        },
        {
          type: "color",
          label: "Text color",
          name: "textColorDecor",
          defaultValue: "#fff",
          condition: "variant.eq.decor",
        },
        {
          type: "color",
          label: "Background color",
          name: "backgroundColor",
          condition: "variant.eq.custom",
        },
        {
          type: "color",
          label: "Text color",
          name: "textColor",
          condition: "variant.eq.custom",
        },
        {
          type: "color",
          label: "Border color",
          name: "borderColor",
          condition: "variant.eq.custom",
        },
        {
          type: "color",
          label: "Background color (hover)",
          name: "backgroundColorHover",
          condition: "variant.eq.custom",
        },
        {
          type: "color",
          label: "Text color (hover)",
          name: "textColorHover",
          condition: "variant.eq.custom",
        },
        {
          type: "color",
          label: "Border color (hover)",
          name: "borderColorHover",
          condition: "variant.eq.custom",
        },
      ],
    },
  ],
});
