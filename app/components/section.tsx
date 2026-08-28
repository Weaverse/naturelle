import type {
  HydrogenComponentProps,
  InspectorGroup,
} from "@weaverse/hydrogen";
import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import type React from "react";
import type { HTMLAttributes } from "react";
import { useAnimation } from "~/hooks/use-animation";
import { cn } from "~/utils/cn";
import type { BackgroundImageProps } from "./background-image";
import { backgroundInputs } from "./background-image";
import type { OverlayProps } from "./overlay";
import { overlayInputs } from "./overlay";
import { OverlayAndBackground } from "./overlay-and-background";

export type BackgroundProps = BackgroundImageProps & {
  backgroundFor: "section" | "content";
  backgroundColor: string;
};

export interface SectionProps<T = any>
  extends Omit<VariantProps<typeof variants>, "padding">,
    Omit<HydrogenComponentProps<T>, "children">,
    Omit<HTMLAttributes<HTMLElement>, "children">,
    Partial<BackgroundProps>,
    OverlayProps {
  as: React.ElementType;
  borderRadius: number;
  containerClassName: string;
  children: React.ReactNode;
}

let variants = cva("relative", {
  variants: {
    width: {
      full: "h-full w-full",
      stretch: "h-full w-full",
      fixed: "mx-auto h-full w-full lg:max-w-[1152px]",
    },
    padding: {
      full: "",
      stretch: "px-5 md:px-6 lg:px-10",
      fixed: "mx-auto px-5 md:px-6 lg:px-10",
    },
    verticalPadding: {
      none: "",
      small: "py-4 md:py-6 lg:py-8",
      medium: "py-20",
      large: "py-12 md:py-24 lg:py-32",
    },
    gap: {
      0: "",
      4: "space-y-1",
      8: "space-y-2",
      12: "space-y-3",
      16: "space-y-4",
      20: "space-y-5",
      24: "space-y-3 lg:space-y-6",
      28: "space-y-3.5 lg:space-y-7",
      32: "space-y-4 lg:space-y-8",
      36: "space-y-4 lg:space-y-9",
      40: "space-y-5 lg:space-y-10",
      44: "space-y-5 lg:space-y-11",
      48: "space-y-6 lg:space-y-12",
      52: "space-y-6 lg:space-y-[52px]",
      56: "space-y-7 lg:space-y-14",
      60: "space-y-7 lg:space-y-[60px]",
    },
    overflow: {
      unset: "",
      hidden: "overflow-hidden",
    },
  },
  defaultVariants: {
    overflow: "hidden",
  },
});

export const Section = ({
  ref,
  ...props
}: SectionProps & { ref?: React.Ref<HTMLElement> }) => {
  const [scope] = useAnimation(ref);
  let {
    as: Component = "section",
    width,
    gap,
    overflow,
    verticalPadding,
    borderRadius,
    backgroundColor,
    backgroundFor,
    backgroundImage,
    backgroundFit,
    backgroundPosition,
    enableOverlay,
    overlayColor,
    overlayColorHover,
    overlayOpacity,
    className,
    children,
    containerClassName,
    style = {},
    ...rest
  } = props;

  style = {
    ...style,
    "--section-background-color": backgroundColor,
    "--section-border-radius": `${borderRadius || 0}px`,
  } as React.CSSProperties;

  let isBgForContent = backgroundFor === "content";
  let hasBackground = backgroundColor || backgroundImage || borderRadius > 0;

  return (
    <Component
      ref={scope}
      {...rest}
      style={style}
      className={cn(
        variants({ padding: width, overflow, className }),
        hasBackground && !isBgForContent && "has-background",
      )}
    >
      {!isBgForContent && <OverlayAndBackground {...props} />}
      <div
        className={cn(
          variants({ gap, width, verticalPadding, overflow }),
          hasBackground && isBgForContent && "has-background px-4 sm:px-8",
          containerClassName,
        )}
      >
        {isBgForContent && <OverlayAndBackground {...props} />}
        {children}
      </div>
    </Component>
  );
};

export const layoutInputs: InspectorGroup["inputs"] = [
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
      max: 64,
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
];

export const sectionInspector: InspectorGroup[] = [
  { group: "Layout", inputs: layoutInputs },
  { group: "Background", inputs: backgroundInputs },
  { group: "Overlay", inputs: overlayInputs },
];
