import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import clsx from "clsx";

export interface SlideshowDotsProps extends VariantProps<typeof variants> {
  className?: string;
}

let variants = cva(
  [
    "slideshow-dots",
    "absolute z-10 flex h-1 w-auto! items-end justify-center gap-2",
    "[&_.dot]:relative [&_.dot]:h-0.5! [&_.dot]:w-12! [&_.dot]:cursor-pointer",
    "[&_.dot]:shrink-0 [&_.dot]:rounded-none! [&_.dot]:opacity-100!",
    "[&_.dot]:transition-[height,background-color] [&_.dot]:duration-200",
    "[&_.dot]:before:absolute [&_.dot]:before:-inset-y-3 [&_.dot]:before:inset-x-0",
    "[&_.dot]:before:content-['']",
    "[&_.dot.active]:h-1!",
  ],
  {
    variants: {
      dotsPosition: {
        top: "left-1/2! top-14! -translate-x-1/2",
        bottom: "bottom-14! left-1/2! -translate-x-1/2",
      },
      dotsColor: {
        light: "[&_.dot]:bg-white/50 [&_.dot.active]:bg-white!",
        dark: "[&_.dot]:bg-black/50 [&_.dot.active]:bg-black!",
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
