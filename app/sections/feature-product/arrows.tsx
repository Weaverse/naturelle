import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { useSwiper } from "swiper/react";
import { IconArrowLeft, IconArrowRight, IconCaret } from "~/components/Icon";

let variants = cva(
  [
    "z-10",
    "absolute top-1/2 -translate-y-1/2 z-1",
    "p-2 text-center cursor-pointer",
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
      side: { left: "", right: "" },
    },
    compoundVariants: [
      {
        showArrowsOnHover: true,
        side: "left",
        className: "lg:-left-12 lg:group-hover/arrow:left-0 left-0",
      },
      {
        showArrowsOnHover: false,
        side: "left",
        className: "left-0",
      },
      {
        showArrowsOnHover: true,
        side: "right",
        className: "lg:-right-12 lg:group-hover/arrow:right-0 right-0",
      },
      {
        showArrowsOnHover: false,
        side: "right",
        className: "right-0",
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
