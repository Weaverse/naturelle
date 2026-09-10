import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import clsx from "clsx";
import { useEffect, useState } from "react";
import type { SwiperClass } from "swiper/react";
import { IconArrowLeft, IconArrowRight, IconCaret } from "~/components/icon";

let variants = cva(
  [
    "absolute top-1/2 z-50 -translate-y-1/2",
    "p-4 text-center cursor-pointer",
    "transition-all duration-200",
  ],
  {
    variants: {
      arrowsColor: {
        light: "text-text bg-transparent border border-border-subtle",
        dark: "text-gray-100 bg-[#3d490b]",
      },
      arrowsShape: {
        square: "",
        rounded: "rounded-xl",
        circle: "rounded-full",
      },
      disabled: {
        true: "opacity-30",
        false: "",
      },
      showArrowsOnHover: { true: "", false: "" },
      side: {
        left: "-translate-x-1/2",
        right: "translate-x-1/2",
      },
    },
    compoundVariants: [
      {
        showArrowsOnHover: true,
        side: "left",
        className: "left-0",
      },
      {
        showArrowsOnHover: false,
        side: "left",
        className: "left-0",
      },
      {
        showArrowsOnHover: true,
        side: "right",
        className: "right-0",
      },
      {
        showArrowsOnHover: false,
        side: "right",
        className: "right-0",
      },
    ],
  },
);

export interface SlideshowArrowsProps extends VariantProps<typeof variants> {
  arrowsIcon: "caret" | "arrow";
  iconSize: number;
  showArrowsOnHover: boolean;
}

export function Arrows(
  props: SlideshowArrowsProps & { instance?: SwiperClass | null },
) {
  let {
    arrowsIcon,
    iconSize,
    arrowsColor,
    showArrowsOnHover,
    arrowsShape,
    instance: swiper,
  } = props;
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
          }),
        )}
        disabled={!canPrev}
        onClick={() => swiper?.slidePrev()}
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
          }),
        )}
        disabled={!canNext}
        onClick={() => swiper?.slideNext()}
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
