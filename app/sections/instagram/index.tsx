import { Image } from "@shopify/hydrogen";
import type {
  ComponentLoaderArgs,
  HydrogenComponentProps,
} from "@weaverse/hydrogen";
import { createSchema } from "@weaverse/hydrogen";
import type { CSSProperties, RefObject } from "react";
import { useState } from "react";
import { Swiper, type SwiperClass, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import clsx from "clsx";
import { Autoplay } from "swiper/modules";
import {
  IconArrowLeft,
  IconArrowRight,
  IconImageBlank,
  IconInstagram,
} from "~/components/icon";
import { useAnimation } from "~/hooks/use-animation";

type InstagramData = {
  instagramToken: string;
  width: string;
  speed: number;
  autoScroll: boolean;
  visibleOnMobile: boolean;
};

type InstagramResponse = {
  data: Array<{
    id: string;
    media_url: string;
    username: string;
  }>;
};

let widthClasses: { [item: string]: string } = {
  full: "",
  fixed: "container",
};

type InstagramProps = HydrogenComponentProps<
  Awaited<ReturnType<typeof loader>>
> &
  InstagramData;

const Instagram = ({
  ref,
  ...props
}: InstagramProps & { ref?: RefObject<HTMLElement | null> }) => {
  let {
    instagramToken,
    width,
    speed,
    autoScroll,
    visibleOnMobile,
    loaderData,
    children,
    ...rest
  } = props;
  const [scope] = useAnimation(ref);
  const [swiperInstance, setSwiperInstance] = useState<SwiperClass | null>(
    null,
  );
  const [showArrows, setShowArrows] = useState(false);

  let sectionStyle: CSSProperties = {
    backgroundColor: "var(--color-background-basic)",
    "--swiper-theme-color": "var(--color-text-primary)",
  } as CSSProperties;
  const imageItemBlank = () => {
    return (
      <div className="flex aspect-square w-full items-center justify-center bg-background-subtle-2">
        <IconImageBlank
          viewBox="0 0 526 526"
          className="h-full! w-full! opacity-80"
        />
      </div>
    );
  };

  const defaultInstagramData = Array.from({ length: 6 }).map((_, i) => ({
    id: i,
    media_url: null,
    username: null,
  }));

  let res = loaderData?.data ?? defaultInstagramData;
  let displayedImages = res;
  const mobileImagesPerRow = 2;
  const tabletImagesPerRow = 4;
  const desktopImagesPerRow = 6;

  return (
    <section
      ref={scope}
      {...rest}
      className={clsx(
        "h-full w-full flex justify-center items-center",
        !visibleOnMobile && "hidden sm:block",
      )}
      style={sectionStyle}
    >
      <div
        className={clsx(
          "flex w-full min-w-0 flex-col gap-12 px-5 py-20 md:px-6 lg:px-10 max-w-lg",
          widthClasses[width],
        )}
      >
        <div className="h-full w-full text-center">{children}</div>
        <div className="w-full min-w-0 overflow-visible">
          <div className="min-w-0 w-full">
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
                  786: {
                    slidesPerView: tabletImagesPerRow,
                    spaceBetween: 16,
                  },
                  1440: {
                    slidesPerView: desktopImagesPerRow,
                    spaceBetween: 16,
                  },
                }}
                modules={[Autoplay]}
                className="min-w-0 w-full"
              >
                {displayedImages.map((item) => {
                  return (
                    <SwiperSlide key={item.id} className="min-w-0">
                      <div className="group relative aspect-square w-full min-w-0 overflow-hidden rounded-md border border-border-subtle">
                        {item.media_url ? (
                          <Image
                            key={item.id}
                            src={item.media_url}
                            alt={item.username || "Instagram post"}
                            className="block aspect-square h-full w-full max-w-full object-cover"
                            sizes="auto"
                          />
                        ) : (
                          imageItemBlank()
                        )}
                        {item.username && (
                          <>
                            <div className="absolute inset-0 z-10 hidden items-center justify-center group-hover:flex">
                              <a
                                href={`https://www.instagram.com/${item.username}/`}
                                target="_blank"
                                className="flex items-center justify-center gap-2"
                                rel="noreferrer"
                              >
                                <IconInstagram
                                  className="h-7 w-7"
                                  viewBox="0 0 24 24"
                                />
                                <span className="font-heading text-xl font-medium text-white">
                                  {item.username}
                                </span>
                              </a>
                            </div>
                            <div className="absolute inset-0 opacity-0 transition-colors duration-500 group-hover:bg-[#554612] group-hover:opacity-50" />
                          </>
                        )}
                      </div>
                    </SwiperSlide>
                  );
                })}
              </Swiper>
              {!autoScroll && showArrows && (
                <>
                  <button
                    type="button"
                    aria-label="Previous Instagram image"
                    className="absolute left-0 top-1/2 z-50 flex size-10 -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-border-subtle bg-background text-text shadow-sm"
                    onClick={() => swiperInstance?.slidePrev()}
                  >
                    <IconArrowLeft className="size-5" />
                  </button>
                  <button
                    type="button"
                    aria-label="Next Instagram image"
                    className="absolute right-0 top-1/2 z-50 flex size-10 translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-border-subtle bg-background text-text shadow-sm"
                    onClick={() => swiperInstance?.slideNext()}
                  >
                    <IconArrowRight className="size-5" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Instagram;

export const loader = async ({
  data,
  weaverse,
}: ComponentLoaderArgs<InstagramData>) => {
  if (data.instagramToken) {
    const api = new URL("https://graph.instagram.com/me/media");
    api.searchParams.set("fields", "id,media_url,username");
    api.searchParams.set("access_token", data.instagramToken);

    try {
      return (await weaverse.fetchWithCache(
        api.toString(),
      )) as InstagramResponse;
    } catch (error) {
      console.error("Instagram loader failed", error);
    }
  }
  return null;
};

export const schema = createSchema({
  type: "instagram",
  title: "Instagram",
  settings: [
    {
      group: "Instagram",
      inputs: [
        {
          type: "text",
          name: "instagramToken",
          label: "Instagram API token",
          placeholder: "Paste access token",
          shouldRevalidate: true,
          helpText:
            'Learn more about how to get an <a href="https://docs.oceanwp.org/article/487-how-to-get-instagram-access-token" target="_blank" rel="noopener noreferrer">Instagram access token</a>.',
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
          name: "speed",
          label: "Scrolling speed",
          defaultValue: 70,
          configs: {
            min: 10,
            max: 100,
            step: 5,
            unit: "s",
          },
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
  childTypes: ["heading", "paragraph"],
  presets: {
    children: [
      {
        type: "heading",
        content: "Instagram",
      },
      {
        type: "paragraph",
        content: "Follow along @naturelle",
      },
    ],
  },
});
