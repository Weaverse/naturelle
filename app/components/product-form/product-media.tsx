import { MagnifyingGlassPlus } from "@phosphor-icons/react";
import clsx from "clsx";
import { useEffect, useMemo, useState } from "react";
import type { MediaFragment } from "storefront-api.generated";
import { FreeMode, Pagination, Thumbs } from "swiper/modules";
import { Swiper, type SwiperClass, SwiperSlide } from "swiper/react";
import { Image } from "~/components/image";
import { ZoomModal } from "./media-zoom";

interface ProductMediaProps {
  selectedVariant: any;
  media: MediaFragment[];
  showThumbnails: boolean;
  imageAspectRatio: string;
  spacing?: number;
  showSlideCounter: boolean;
  direction?: "horizontal" | "vertical";
  enableZoom?: boolean;
  showPagination?: boolean;
  thumbnailLayout?: "swiper" | "strip";
}

export function ProductMedia(props: ProductMediaProps) {
  let {
    selectedVariant,
    showThumbnails,
    media: _media,
    imageAspectRatio,
    spacing = 10,
    showSlideCounter,
    direction = "horizontal",
    enableZoom,
    showPagination = true,
    thumbnailLayout = "swiper",
  } = props;

  const media = useMemo(
    () => _media.filter((med) => med.__typename === "MediaImage"),
    [_media],
  );
  const useStripThumbnails = showThumbnails && thumbnailLayout === "strip";
  const useSwiperThumbnails = showThumbnails && thumbnailLayout === "swiper";
  let [swiper, setSwiper] = useState<SwiperClass | null>(null);
  let [thumbsSwiper, setThumbsSwiper] = useState<SwiperClass | null>(null);
  let [zoomMediaId, setZoomMediaId] = useState<string | null>(null);
  let [zoomModalOpen, setZoomModalOpen] = useState(false);
  let [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (selectedVariant && swiper) {
      const index = getSelectedVariantMediaIndex(media, selectedVariant);

      if (index >= 0 && index !== swiper.activeIndex) {
        swiper.slideTo(index);
      }
    }
  }, [media, selectedVariant, swiper]);

  return (
    <div className="min-w-0 overflow-hidden product-media-slider">
      <div
        className={clsx(
          "flex min-w-0 gap-4 overflow-hidden [--thumbs-width:0px]",
          direction === "horizontal" ? "flex-col" : "flex-row-reverse",
          useSwiperThumbnails && "md:[--thumbs-width:8rem]",
        )}
      >
        <div
          data-motion="zoom-in"
          className={clsx(
            "relative",
            direction === "vertical" &&
              "w-[calc(100%-var(--thumbs-width,0px))] h-full",
          )}
        >
          <Swiper
            loop={true}
            modules={[
              ...(showPagination ? [Pagination] : []),
              ...(useSwiperThumbnails ? [Thumbs] : []),
            ]}
            pagination={showPagination ? { type: "bullets" } : false}
            spaceBetween={10}
            thumbs={
              useSwiperThumbnails ? { swiper: thumbsSwiper } : undefined
            }
            onSwiper={setSwiper}
            onSlideChange={(slider) => setCurrentIndex(slider.realIndex)}
            className={clsx(
              "vt-product-image max-w-full",
              showPagination &&
                "pb-5! md:pb-0! md:[&_.swiper-pagination-bullets]:hidden",
            )}
            style={
              showPagination
                ? ({
                    "--swiper-pagination-bottom": "-6px",
                    "--swiper-pagination-color": "var(--color-text-primary)",
                  } as React.CSSProperties)
                : undefined
            }
          >
            {media.map((med, i) => {
              let image = getMediaImage(med);
              return (
                <SwiperSlide key={med.id}>
                  <Image
                    data={image}
                    loading={i === 0 ? "eager" : "lazy"}
                    aspectRatio={imageAspectRatio}
                    className="fadeIn h-auto w-full rounded-sm object-cover"
                    sizes="auto"
                  />
                  {enableZoom && (
                    <button
                      type="button"
                      className={clsx(
                        "absolute top-2 right-2 md:right-6 md:top-6",
                        "p-2 text-center border border-transparent rounded-full",
                        "transition-all duration-200",
                        "text-gray-900 bg-background hover:bg-[#2e6a53] hover:text-white",
                      )}
                      onClick={() => {
                        setZoomMediaId(med.id);
                        setZoomModalOpen(true);
                      }}
                    >
                      <MagnifyingGlassPlus className="w-5 h-5" />
                    </button>
                  )}
                </SwiperSlide>
              );
            })}
          </Swiper>
          {showSlideCounter && (
            <span
              className={clsx(
                "absolute right-2 z-10 font-heading text-sm text-text-primary sm:text-base",
                showPagination ? "bottom-7 sm:bottom-5" : "bottom-2",
              )}
            >
              {currentIndex + 1}/{media.length}
            </span>
          )}
        </div>
        {useStripThumbnails && (
          <div className="min-w-0 w-full">
            <div className="flex gap-2 overflow-x-auto overscroll-x-contain touch-pan-x pb-0.5 [scrollbar-width:none] [-webkit-overflow-scrolling:touch] [&::-webkit-scrollbar]:hidden">
              {media.map((med, i) => {
                const isActive = currentIndex === i;
                return (
                  <button
                    key={med.id}
                    type="button"
                    aria-label={`View image ${i + 1}`}
                    aria-pressed={isActive}
                    className={clsx(
                      "size-16 shrink-0 overflow-hidden rounded-sm border p-0.5 transition-colors md:size-[88px]",
                      isActive
                        ? "border-border/60"
                        : "border-transparent hover:border-border-subtle",
                    )}
                    onClick={() => slideToMedia(swiper, i)}
                  >
                    <Image
                      data={getMediaImage(med)}
                      loading={i === 0 ? "eager" : "lazy"}
                      className="h-full w-full rounded-sm object-cover"
                      aspectRatio={imageAspectRatio}
                      sizes="88px"
                    />
                  </button>
                );
              })}
            </div>
          </div>
        )}
        {useSwiperThumbnails && (
          <div
            className={clsx(
              "hidden min-w-0 sm:block",
              direction === "vertical" &&
                "w-[calc(var(--thumbs-width,0px)-1rem)] md:h-[550px] lg:h-[770px]",
            )}
          >
            <Swiper
              onSwiper={setThumbsSwiper}
              loop={false}
              rewind
              direction={direction}
              spaceBetween={spacing}
              freeMode={true}
              slidesPerView={"auto"}
              modules={[FreeMode, Thumbs]}
              watchSlidesProgress={true}
              data-motion="fade-up"
              className="w-full h-full overflow-hidden"
            >
              {media.map((med, i) => (
                <SwiperSlide
                  key={med.id}
                  className={clsx(
                    "h-fit! w-fit! cursor-pointer rounded-sm border border-transparent p-0.5 transition-colors",
                    "[&.swiper-slide-thumb-active]:border-border/60",
                  )}
                >
                  <Image
                    data={getMediaImage(med)}
                    loading={i === 0 ? "eager" : "lazy"}
                    className="fadeIn h-[100px]! rounded-sm object-cover shadow-md"
                    aspectRatio={imageAspectRatio}
                    sizes="auto"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}
      </div>
      {enableZoom && (
        <ZoomModal
          media={media}
          zoomMediaId={zoomMediaId ?? ""}
          setZoomMediaId={setZoomMediaId}
          open={zoomModalOpen}
          onOpenChange={setZoomModalOpen}
        />
      )}
    </div>
  );
}

function getMediaImage(med: MediaFragment) {
  return { ...med.image, altText: med.alt || "Product image" };
}

function slideToMedia(swiper: SwiperClass | null, index: number) {
  if (!swiper) return;
  if (swiper.params.loop) {
    swiper.slideToLoop(index);
  } else {
    swiper.slideTo(index);
  }
}

function getSelectedVariantMediaIndex(
  media: MediaFragment[],
  selectedVariant: any,
) {
  if (!selectedVariant) {
    return 0;
  }
  let mediaUrl = selectedVariant.image?.url;
  return media.findIndex((med) => med.previewImage?.url === mediaUrl);
}
