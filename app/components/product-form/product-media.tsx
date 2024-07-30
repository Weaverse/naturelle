import { Image } from "@shopify/hydrogen";
import clsx from "clsx";
import { useState } from "react";
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
  let { selectedVariant, showThumbnails, media: _media, numberOfThumbnails, spacing } = props;
  let media = _media.filter((med) => med.__typename === "MediaImage");
  let [thumbsSwiper, setThumbsSwiper] = useState<SwiperClass | null>(null);
  let [activeIndex, setActiveIndex] = useState(0);
  
  return (
    <div className="flex flex-col-reverse md:flex-col-reverse gap-4 w-full overflow-hidden">
      <Swiper
        onSwiper={setThumbsSwiper}
        direction="horizontal"
        spaceBetween={spacing}
        freeMode
        slidesPerView={"auto"}
        threshold={2}
        modules={[FreeMode, Thumbs]}
        className="w-full overflow-visible hidden md:block"
      >
        {media.map((med, i) => {
          let image = { ...med.image, altText: med.alt || "Product image" };
          return (
            <SwiperSlide
              key={med.id}
              className={clsx(
                "!h-fit !w-fit p-1 border transition-colors !aspect-[3/4] cursor-pointer",
                activeIndex === i ? "border-black" : "border-transparent",
              )}
            >
              <Image
                data={image}
                loading={i === 0 ? "eager" : "lazy"}
                className="object-contain fadeIn h-[100px] w-full"
                sizes="auto"
              />
            </SwiperSlide>
          );
        })}
      </Swiper>
      <Swiper
        modules={[FreeMode, Thumbs, Pagination]}
        pagination={{ type: "fraction" }}
        spaceBetween={10}
        thumbs={
          thumbsSwiper
            ? {
                swiper: thumbsSwiper,
                slideThumbActiveClass: "thumb-active",
              }
            : undefined
        }
        onSlideChange={(swiper) => {
          setActiveIndex(swiper.activeIndex);
        }}
        className="vt-product-image max-w-full pb-14 md:pb-0 md:[&_.swiper-pagination-fraction]:hidden"
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
    </div>
  );
}
