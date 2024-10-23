import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import clsx from "clsx";
import { useState } from "react";
import { useSwiper } from "swiper/react";
import { IconArrowLeft, IconArrowRight, IconCaret } from "~/components/Icon";

let variants = cva(
  [
    "hidden md:block z-10",
    "absolute top-1/2 -translate-y-1/2 z-1",
    "p-2 text-center cursor-pointer",
    "border border-transparent",
    "transition-all duration-200",
  ],
  {
    variants: {
      arrowsColor: {
        light: "text-foreground bg-white hover:bg-gray-100",
        dark: "text-gray-100 bg-primary hover:bg-primary/80",
      },
      arrowsShape: {
        square: "",
        rounded: "rounded-xl",
        circle: "rounded-full",
      },
      disabled: {
        true: "opacity-50 !cursor-not-allowed",
        false: "",
      },
      showArrowsOnHover: { true: "", false: "" },
      side: { left: "", right: "" },
    },
    compoundVariants: [
      {
        showArrowsOnHover: true,
        side: "left",
        className: "-left-12 group-hover:left-6",
      },
      {
        showArrowsOnHover: false,
        side: "left",
        className: "left-6",
      },
      {
        showArrowsOnHover: true,
        side: "right",
        className: "-right-12 group-hover:right-6",
      },
      {
        showArrowsOnHover: false,
        side: "right",
        className: "right-6",
      },
    ],
  },
);

export interface SlideshowArrowsProps extends VariantProps<typeof variants> {
  arrowsIcon: "caret" | "arrow";
  iconSize: number;
  showArrowsOnHover: boolean;
}

export function Arrows(props: SlideshowArrowsProps) {
  let { arrowsIcon, iconSize, arrowsColor, showArrowsOnHover, arrowsShape } =
    props;
  let [canNext, setCanNext] = useState(true);
  let [canPrev, setCanPrev] = useState(true);
  let swiper = useSwiper();

  if (!swiper.params.loop) {
    swiper.on("init", ({ activeIndex, slides }) => {
      setCanNext(activeIndex < slides.length - 1);
      setCanPrev(activeIndex > 0);
    });
    swiper.on("activeIndexChange", ({ activeIndex, slides }) => {
      setCanNext(activeIndex < slides.length - 1);
      setCanPrev(activeIndex > 0);
    });
  }

  return (
    <>
      <button
        type="button"
        className={clsx(
          "slideshow-arrow-prev",
          variants({
            arrowsColor,
            arrowsShape,
            showArrowsOnHover,
            disabled: !canPrev,
            side: "left",
          }),
        )}
        disabled={!canPrev}
      >
        {arrowsIcon === "caret" ? (
          <IconCaret direction="left" style={{ width: iconSize, height: iconSize }} />
        ) : (
          <IconArrowLeft style={{ width: iconSize, height: iconSize }} />
        )}
      </button>
      <button
        type="button"
        className={clsx(
          "slideshow-arrow-next",
          variants({
            arrowsColor,
            arrowsShape,
            showArrowsOnHover,
            disabled: !canNext,
            side: "right",
          }),
        )}
        disabled={!canNext}
      >
        {arrowsIcon === "caret" ? (
          <IconCaret direction="right" style={{ width: iconSize, height: iconSize }} />
        ) : (
          <IconArrowRight style={{ width: iconSize, height: iconSize }} />
        )}
      </button>
    </>
  );
}
