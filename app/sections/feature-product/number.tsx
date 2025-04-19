import clsx from "clsx";
import { useEffect, useState } from "react";
import type { SwiperClass } from "swiper/react";

export interface SlideshowDotsProps {
  className?: string;
  instance: SwiperClass | null;
}

export function Number(props: SlideshowDotsProps) {
  let { className, instance } = props;
  let [currentSlideIndex, setCurrentSlide] = useState(1);
  let [totalSlides, setTotalSlides] = useState(0);
  let [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const updateScreenSize = () => {
      if (window.innerWidth < 640) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
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
      setTotalSlides(instance?.slides?.length);
      const updateCurrentSlide = () => {
        setCurrentSlide(instance.realIndex + 1);
      };
      instance.on("slideChange", updateCurrentSlide);
      return () => {
        instance.off("slideChange", updateCurrentSlide);
      };
    }
  }, [instance]);
  let currentSlide = isMobile ? currentSlideIndex + 1 : currentSlideIndex + 3;
  return (
    <div
      className={clsx(
        className,
        "z-10 flex justify-center items-center px-2.5 gap-4",
      )}
    >
      <span className="font-heading font-normal text-xl">
        {currentSlide}/{totalSlides}
      </span>
    </div>
  );
}
