import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import clsx from "clsx";
import { useEffect, useState } from "react";
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
        light: "text-gray-900 bg-white hover:bg-gray-100",
        dark: "text-gray-100 bg-gray-900 hover:bg-gray-800",
      },
      arrowsShape: {
        square: "",
        rounded: "rounded-xl",
        circle: "rounded-full",
      },
      disabled: {
        true: "opacity-60 cursor-not-allowed",
        false: "",
      },
      showArrowsOnHover: { true: "", false: "" },
      side: { left: "", right: "" },
    },
    compoundVariants: [
      {
        showArrowsOnHover: true,
        side: "left",
        className: "-left-12 group-hover/arrow:left-6",
      },
      {
        showArrowsOnHover: false,
        side: "left",
        className: "left-6",
      },
      {
        showArrowsOnHover: true,
        side: "right",
        className: "-right-12 group-hover/arrow:right-6",
      },
      {
        showArrowsOnHover: false,
        side: "right",
        className: "right-6",
      },
    ],
  }
);

export interface SlideshowArrowsProps extends VariantProps<typeof variants> {
  arrowsIcon: "caret" | "arrow";
  iconSize: number;
  showArrowsOnHover: boolean;
}

export function Arrows(props: SlideshowArrowsProps) {
  let { arrowsIcon, iconSize, arrowsColor, showArrowsOnHover, arrowsShape } =
    props;
  let swiper = useSwiper();
  let [canNext, setCanNext] = useState(true);
  let [canPrev, setCanPrev] = useState(true);
  useEffect(() => {
    if (swiper) {
      const updateNavigation = () => {
        setCanNext(!swiper.isEnd);
        setCanPrev(!swiper.isBeginning);
      };
      updateNavigation();
      swiper.on("slideChange", updateNavigation);
      return () => {
        swiper.off("slideChange", updateNavigation);
      };
    }
  }, [swiper]);

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
          })
        )}
        disabled={!canPrev}
      >
        {arrowsIcon === "caret" ? (
          <IconCaret
            direction="left"
            style={{ width: iconSize, height: iconSize }}
          />
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
          })
        )}
        disabled={!canNext}
      >
        {arrowsIcon === "caret" ? (
          <IconCaret
            direction="right"
            style={{ width: iconSize, height: iconSize }}
          />
        ) : (
          <IconArrowRight style={{ width: iconSize, height: iconSize }} />
        )}
      </button>
    </>
  );
}
