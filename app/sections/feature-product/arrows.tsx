import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import clsx from "clsx";
import { useEffect, useState } from "react";
import type { SwiperClass } from "swiper/react";
import { IconArrowLeft, IconArrowRight, IconCaret } from "~/components/icon";

let variants = cva(
  [
    "absolute top-1/2 z-50 -translate-y-1/2",
    "flex size-[52px] items-center justify-center p-0 text-center",
    "max-sm:bg-background",
    "transition-all duration-200",
  ],
  {
    variants: {
      arrowsColor: {
        light: "text-text bg-transparent border border-border-subtle",
        dark: "border border-border-subtle bg-background text-text",
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
      side: {
        left: "left-0 -translate-x-3 sm:-translate-x-1/2",
        right: "right-0 translate-x-3 sm:translate-x-1/2",
      },
    },
  },
);

export interface SlideshowArrowsProps extends VariantProps<typeof variants> {
  arrowsIcon: "caret" | "arrow";
  iconSize: number;
}

export function Arrows(
  props: SlideshowArrowsProps & { instance?: SwiperClass | null },
) {
  let {
    arrowsIcon,
    iconSize,
    arrowsColor,
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
            disabled: !canPrev,
            side: "left",
          }),
        )}
        disabled={!canPrev}
        onClick={() => swiper?.slidePrev()}
      >
        <IconCaret
          direction="left"
          className="sm:hidden"
          style={{ width: iconSize, height: iconSize }}
        />
        <span className="max-sm:hidden">
          {arrowsIcon === "caret" ? (
            <IconCaret
              direction="left"
              style={{ width: iconSize, height: iconSize }}
            />
          ) : (
            <IconArrowLeft style={{ width: iconSize, height: iconSize }} />
          )}
        </span>
      </button>
      <button
        type="button"
        className={clsx(
          "slideshow-arrow-next",
          variants({
            arrowsColor,
            arrowsShape,
            disabled: !canNext,
            side: "right",
          }),
        )}
        disabled={!canNext}
        onClick={() => swiper?.slideNext()}
      >
        <IconCaret
          direction="right"
          className="sm:hidden"
          style={{ width: iconSize, height: iconSize }}
        />
        <span className="max-sm:hidden">
          {arrowsIcon === "caret" ? (
            <IconCaret
              direction="right"
              style={{ width: iconSize, height: iconSize }}
            />
          ) : (
            <IconArrowRight style={{ width: iconSize, height: iconSize }} />
          )}
        </span>
      </button>
    </>
  );
}
