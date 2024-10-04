import { Image } from "@shopify/hydrogen";
import clsx from "clsx";
import { useEffect, useState } from "react";
import type { MediaFragment } from "storefrontapi.generated";
import { FreeMode, Pagination, Thumbs } from "swiper/modules";
import { Swiper, type SwiperClass, SwiperSlide } from "swiper/react";

interface ProductMediaProps {
  selectedVariant: any;
  media: MediaFragment[];
  showThumbnails: boolean;
  numberOfThumbnails: number;
  spacing: number;
}

export function ProductMedia(props: ProductMediaProps) {
  let {
    selectedVariant,
    showThumbnails,
    media: _media,
    numberOfThumbnails,
    spacing,
  } = props;
  let media = _media.filter((med) => med.__typename === "MediaImage");
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperClass | null>(null);
  const [swiperInstance, setSwiperInstance] = useState<SwiperClass | null>(
    null
  );
  let [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (swiperInstance && thumbsSwiper) {
      if (swiperInstance.thumbs) {
        swiperInstance.thumbs.swiper = thumbsSwiper;
        swiperInstance.thumbs.init();
      }
      swiperInstance.on("slideChange", () => {
        const realIndex = swiperInstance.realIndex;
        setActiveIndex(realIndex);
        thumbsSwiper.slideTo(realIndex);
      });
    }
  }, [swiperInstance, thumbsSwiper]);

  return (
    <div className="flex flex-col gap-4 w-full overflow-hidden">
      <Swiper
        loop={false}
        modules={[FreeMode, Thumbs, Pagination]}
        pagination={{ type: "fraction" }}
        spaceBetween={10}
        onSlideChange={(swiper) => {
          setActiveIndex(swiper.activeIndex);
        }}
        thumbs={
          thumbsSwiper
            ? {
                swiper: thumbsSwiper,
                slideThumbActiveClass: "thumb-active",
              }
            : undefined
        }
        onSwiper={setSwiperInstance}
        className="vt-product-image max-w-full pb-14 md:pb-0 md:[&_.swiper-pagination-fraction]:hidden mySwiper2"
        style={
          {
            "--swiper-pagination-bottom": "20px",
          } as React.CSSProperties
        }
      >
        {media.map((med, i) => {
          let image = { ...med.image, altText: med.alt || "Product image" };
          return (
            <SwiperSlide key={med.id}>
              <Image
                data={image}
                loading={i === 0 ? "eager" : "lazy"}
                aspectRatio={"3/4"}
                className="object-cover w-full h-auto fadeIn"
                sizes="auto"
              />
            </SwiperSlide>
          );
        })}
      </Swiper>
      <Swiper
        onSwiper={setThumbsSwiper}
        loop={false}
        direction="horizontal"
        spaceBetween={spacing}
        freeMode={true}
        slidesPerView={"auto"}
        modules={[FreeMode, Thumbs]}
        watchSlidesProgress={true}
        className="w-full overflow-visible hidden md:block mySwiper"
      >
        {media.map((med, i) => {
          let image = { ...med.image, altText: med.alt || "Product image" };
          return (
            <SwiperSlide
              key={med.id}
              className={clsx(
                "!h-fit !w-fit p-1 border transition-colors cursor-pointer",
                activeIndex === i ? "border-black" : "border-transparent"
              )}
            >
              <Image
                data={image}
                loading={i === 0 ? "eager" : "lazy"}
                className="fadeIn object-cover !h-[100px] !aspect-[3/4]"
                sizes="auto"
              />
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
}
