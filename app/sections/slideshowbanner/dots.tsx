import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import clsx from "clsx";

export interface SlideshowDotsProps extends VariantProps<typeof variants> {
  className?: string;
}

let variants = cva(
  [
    "slideshow-dots",
    "absolute z-10 flex justify-center items-center px-2.5 gap-4",
  ],
  {
    variants: {
      dotsPosition: {
        top: "left-0 right-0 !top-14",
        bottom: "left-0 right-0 !bottom-14",
        left: "top-0 bottom-0 flex-col left-5",
        right: "top-0 bottom-0 flex-col right-5",
      },
      dotsColor: {
        light: "[&_.dot]:bg-white [&_.active]:!outline-white",
        dark: "[&_.dot]:bg-black [&_.active]:!outline-black",
      },
    },
    defaultVariants: {
      dotsPosition: "bottom",
      dotsColor: "light",
    },
  },
);

export function Dots(props: SlideshowDotsProps) {
  let { className, dotsPosition, dotsColor } = props;
  return (
    <div className={clsx(variants({ dotsPosition, dotsColor }), className)} />
  );
}
