import clsx from "clsx";
import { useEffect, useState } from "react";
import type { SwiperClass } from "swiper/react";

export interface SlideshowDotsProps {
  className?: string;
  instance: SwiperClass | null;
  totalSlides: number;
}

export function SlideNumber(props: SlideshowDotsProps) {
  let { className, instance, totalSlides } = props;
  let [currentSlideIndex, setCurrentSlide] = useState(1);
  let [slidesPerView, setSlidesPerView] = useState(1);
  useEffect(() => {
    if (instance) {
      const updateSlideState = () => {
        setCurrentSlide(instance.realIndex + 1);
        setSlidesPerView(Number(instance.params.slidesPerView) || 1);
      };

      updateSlideState();
      instance.on("slideChange", updateSlideState);
      instance.on("breakpoint", updateSlideState);

      return () => {
        instance.off("slideChange", updateSlideState);
        instance.off("breakpoint", updateSlideState);
      };
    }
  }, [instance]);
  let currentSlide = Math.min(
    currentSlideIndex + slidesPerView - 1,
    totalSlides,
  );
  return (
    <div
      className={clsx(
        className,
        "z-10 flex justify-center items-center px-2.5 gap-4",
      )}
    >
      <span className="font-heading font-normal text-xl max-sm:font-body max-sm:text-base max-sm:font-semibold max-sm:leading-[1.6]">
        {currentSlide}/{totalSlides}
      </span>
    </div>
  );
}

// Export as Number for backward compatibility
export { SlideNumber as Number };
