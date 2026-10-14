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
    const updateScreenSize = () => {
      setSlidesPerView(
        window.innerWidth < 430
          ? 1
          : window.innerWidth < 768
            ? 2
            : window.innerWidth < 960
              ? 3
              : 4,
      );
    };
    updateScreenSize();
    window.addEventListener("resize", updateScreenSize);
    return () => {
      window.removeEventListener("resize", updateScreenSize);
    };
  }, []);
  useEffect(() => {
    if (instance) {
      setCurrentSlide(instance.realIndex + 1);
      const updateCurrentSlide = () => {
        setCurrentSlide(instance.realIndex + 1);
      };
      instance.on("slideChange", updateCurrentSlide);
      return () => {
        instance.off("slideChange", updateCurrentSlide);
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
