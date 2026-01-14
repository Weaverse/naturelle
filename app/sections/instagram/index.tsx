import { Image } from "@shopify/hydrogen";
import type {
  ComponentLoaderArgs,
  HydrogenComponentProps,
} from "@weaverse/hydrogen";
import { createSchema } from "@weaverse/hydrogen";
import type { CSSProperties, RefObject } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import "swiper/css/pagination";
import clsx from "clsx";
import { Pagination } from "swiper/modules";
import { IconImageBlank, IconInstagram } from "~/components/icon";
import { useAnimation } from "~/hooks/use-animation";

type InstagramData = {
  instagramToken: string;
  backgroundColor: string;
  width: string;
  imagesPerRow: number;
  speed: number;
  visibleOnMobile: boolean;
  loaderData: {
    data: {
      id: string;
      media_url: string;
      username: string;
    }[];
  };
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
    backgroundColor,
    width,
    imagesPerRow,
    speed,
    visibleOnMobile,
    loaderData,
    children,
    ...rest
  } = props;
  const [scope] = useAnimation(ref);

  let sectionStyle: CSSProperties = {
    backgroundColor: backgroundColor,
    "--speed": `${speed}s`,
    "--swiper-theme-color": "#3D490B",
  } as CSSProperties;
  const imageItemBlank = () => {
    return (
      <div className="flex aspect-square w-full items-center justify-center bg-[#e5e6d4]">
        <IconImageBlank
          viewBox="0 0 526 526"
          className="h-full! w-full! opacity-80"
        />
      </div>
    );
  };

  const defaultInstagramData = Array.from({ length: 3 }).map((_, i) => ({
    id: i,
    media_url: null,
    username: null,
  }));

  let res = loaderData?.data ?? defaultInstagramData;
  let displayedImages = res?.slice(0, imagesPerRow);
  const imageItemRender = () => {
    return (
      <div
        className="hidden items-center justify-center gap-4 sm:flex sm:animate-scrollContent"
        style={{ animationDuration: `var(--speed)` }}
      >
        {displayedImages.map((item, index) => {
          return (
            <div
              className="group relative aspect-square min-w-80 cursor-pointer rounded"
              key={index}
            >
              {item.media_url ? (
                <Image
                  key={index}
                  src={item.media_url}
                  className="aspect-square w-full object-cover rounded"
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
                      <IconInstagram className="h-7 w-7" viewBox="0 0 24 24" />
                      <span className="font-heading text-xl font-medium text-white">
                        {item.username}
                      </span>
                    </a>
                  </div>
                  <div className="absolute inset-0 opacity-0 transition-colors duration-500 group-hover:bg-[#554612] group-hover:opacity-50" />
                </>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <section
      ref={scope}
      {...rest}
      className={clsx("h-full w-full", !visibleOnMobile && "hidden sm:block")}
      style={sectionStyle}
    >
      <div
        className={clsx(
          "flex flex-col gap-12 px-7 py-12 sm:px-10 sm:py-20",
          widthClasses[width],
        )}
      >
        <div className="h-full w-full text-center">{children}</div>
        <div className="flex gap-0 overflow-hidden sm:gap-4">
          <div className="block sm:hidden w-full">
            <Swiper
              loop={true}
              slidesPerView={1}
              spaceBetween={100}
              pagination={{
                clickable: true,
              }}
              modules={[Pagination]}
              className="w-full"
            >
              {displayedImages.map((item, index) => {
                return (
                  <SwiperSlide key={index}>
                    <div className="group relative aspect-square min-w-80">
                      {item.media_url ? (
                        <Image
                          key={index}
                          src={item.media_url}
                          className="aspect-square w-full object-cover"
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
                    <div className="py-8"></div>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </div>
          {Array.from({ length: 11 }).map((_idx, i) => (
            <div key={i}>{imageItemRender()}</div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Instagram;

export const loader = async (args: ComponentLoaderArgs<InstagramData>) => {
  /* Instagram loader disabled temporarily
  let { weaverse, data } = args;
  if (data.instagramToken) {
    try {
      let API = `https://graph.instagram.com/me/media?fields=id,media_url,username&access_token=${data.instagramToken}`;
      let res = await weaverse.fetchWithCache(API);
      return res;
    } catch (err) {
      console.error(
        `Instagram loader failed for token ${data.instagramToken}:`,
        err,
      );
      return null;
    }
  }
  */
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
          label: "Instagram api token",
          placeholder: "@instagram",
          helpText:
            'Learn more about how to get <a href="https://docs.oceanwp.org/article/487-how-to-get-instagram-access-token" target="_blank">API token for Instagram</a> section.',
        },
        {
          type: "color",
          label: "Background color",
          name: "backgroundColor",
          defaultValue: "#F8F8F0",
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
          label: "Images",
          defaultValue: 3,
          configs: {
            min: 1,
            max: 4,
            step: 1,
          },
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
  childTypes: ["heading"],
  presets: {
    children: [
      {
        type: "heading",
        content: "Instagram",
      },
    ],
  },
});
