import type { HydrogenComponentProps } from "@weaverse/hydrogen";
import { createSchema, useChildInstances } from "@weaverse/hydrogen";
import clsx from "clsx";
import React, { type RefObject, useState } from "react";
import { Autoplay } from "swiper/modules";
import { Swiper, type SwiperClass, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import { IconArrowLeft, IconArrowRight } from "~/components/icon";
import { Link } from "~/components/link";
import { useAnimation } from "~/hooks/use-animation";

type InstagramData = {
  width: string;
  heading: string;
  handle: string;
  profileUrl?: string;
  imagesPerRow?: number;
  speed: number;
  autoScroll: boolean;
  visibleOnMobile: boolean;
};

type InstagramProps = HydrogenComponentProps & InstagramData;

let widthClasses: Record<string, string> = {
  full: "",
  fixed: "container",
};

const Instagram = ({
  ref,
  ...props
}: InstagramProps & { ref?: RefObject<HTMLElement | null> }) => {
  let {
    width,
    heading,
    handle,
    profileUrl,
    imagesPerRow = 6,
    speed,
    autoScroll,
    visibleOnMobile,
    children,
    ...rest
  } = props;
  const [scope] = useAnimation(ref);
  const [swiperInstance, setSwiperInstance] = useState<SwiperClass | null>(
    null,
  );
  const [showArrows, setShowArrows] = useState(false);
  const childItems = React.Children.toArray(children);
  const childTypes = new Map(
    useChildInstances().map((instance) => [
      instance.data.id,
      instance.data.type,
    ]),
  );
  const getChildType = (child: React.ReactNode) => {
    if (!React.isValidElement(child)) {
      return;
    }
    const childId = (child.props as { id?: string }).id;
    return childId ? childTypes.get(childId) : undefined;
  };
  const instagramItems = childItems.filter(
    (child) => getChildType(child) === "instagram--item",
  );
  const legacyContent = childItems.filter((child) => {
    const type = getChildType(child);
    return type === "heading" || type === "paragraph";
  });
  const desktopImagesPerRow = Math.min(
    8,
    Math.max(1, Number(imagesPerRow) || 6),
  );
  const mobileImagesPerRow = Math.min(2, desktopImagesPerRow);
  const tabletImagesPerRow = Math.min(4, desktopImagesPerRow);
  const handleLabel = <span>{handle}</span>;

  return (
    <section
      ref={scope}
      {...rest}
      className={clsx(
        "flex h-full w-full items-center justify-center bg-background-basic",
        !visibleOnMobile && "hidden sm:flex",
      )}
    >
      <div
        className={clsx(
          "flex w-full min-w-0 max-w-page flex-col gap-12 px-5 py-20 md:px-6 lg:px-10",
          widthClasses[width],
        )}
      >
        {legacyContent.length > 0 ? (
          <div className="flex w-full flex-col items-center justify-center gap-4 text-center">
            {legacyContent}
          </div>
        ) : (
          (heading || handle) && (
            <div className="flex w-full flex-col items-center justify-center gap-4 text-center">
              {heading && <h2>{heading}</h2>}
              {handle &&
                (profileUrl ? (
                  <Link
                    to={profileUrl}
                    target="_blank"
                    className="underline underline-offset-4"
                  >
                    {handleLabel}
                  </Link>
                ) : (
                  handleLabel
                ))}
            </div>
          )
        )}

        <div className="relative min-w-0 w-full">
          <Swiper
            onSwiper={(swiper) => {
              setSwiperInstance(swiper);
              setShowArrows(!swiper.isLocked);
            }}
            onResize={(swiper) => setShowArrows(!swiper.isLocked)}
            onBreakpoint={(swiper) => setShowArrows(!swiper.isLocked)}
            onSlidesUpdated={(swiper) => setShowArrows(!swiper.isLocked)}
            onLock={() => setShowArrows(false)}
            onUnlock={() => setShowArrows(true)}
            loop={false}
            rewind={showArrows}
            autoplay={
              autoScroll && showArrows ? { delay: speed * 1000 } : false
            }
            watchOverflow={true}
            slidesPerView={mobileImagesPerRow}
            spaceBetween={16}
            breakpoints={{
              786: { slidesPerView: tabletImagesPerRow, spaceBetween: 16 },
              1440: { slidesPerView: desktopImagesPerRow, spaceBetween: 16 },
            }}
            modules={[Autoplay]}
            className="min-w-0 w-full"
          >
            {instagramItems.map((child, index) => (
              <SwiperSlide key={index} className="min-w-0">
                {child}
              </SwiperSlide>
            ))}
          </Swiper>

          {!autoScroll && showArrows && (
            <>
              <button
                type="button"
                aria-label="Previous Instagram post"
                className="absolute left-0 top-1/2 z-50 flex size-10 -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-border-subtle bg-background text-text shadow-sm"
                onClick={() => swiperInstance?.slidePrev()}
              >
                <IconArrowLeft className="size-5" />
              </button>
              <button
                type="button"
                aria-label="Next Instagram post"
                className="absolute right-0 top-1/2 z-50 flex size-10 translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-border-subtle bg-background text-text shadow-sm"
                onClick={() => swiperInstance?.slideNext()}
              >
                <IconArrowRight className="size-5" />
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default Instagram;

export const schema = createSchema({
  type: "instagram",
  title: "Instagram",
  settings: [
    {
      group: "Instagram",
      inputs: [
        {
          type: "text",
          name: "heading",
          label: "Heading",
          defaultValue: "Instagram",
        },
        {
          type: "text",
          name: "handle",
          label: "Handle",
          defaultValue: "@naturelle",
        },
        {
          type: "url",
          name: "profileUrl",
          label: "Profile link",
          defaultValue: "https://www.instagram.com/",
        },
        {
          type: "select",
          name: "width",
          label: "Content width",
          configs: {
            options: [
              { value: "full", label: "Full page" },
              { value: "fixed", label: "Fixed" },
            ],
          },
          defaultValue: "fixed",
        },
        {
          type: "range",
          name: "imagesPerRow",
          label: "Images per row (desktop)",
          defaultValue: 6,
          configs: { min: 1, max: 8, step: 1 },
        },
        {
          type: "range",
          name: "speed",
          label: "Scrolling speed",
          defaultValue: 70,
          configs: { min: 10, max: 100, step: 5, unit: "s" },
          condition: "autoScroll.eq.true",
        },
        {
          type: "switch",
          name: "autoScroll",
          label: "Auto scroll",
          defaultValue: true,
        },
        {
          type: "switch",
          name: "visibleOnMobile",
          label: "Visible on mobile",
          defaultValue: true,
        },
      ],
    },
  ],
  childTypes: ["instagram--item"],
  presets: {
    heading: "Instagram",
    handle: "@naturelle",
    profileUrl: "https://www.instagram.com/",
    children: Array.from({ length: 6 }, () => ({ type: "instagram--item" })),
  },
});
