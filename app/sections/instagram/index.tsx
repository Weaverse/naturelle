import {Image} from '@shopify/hydrogen';
import type {
  ComponentLoaderArgs,
  HydrogenComponentProps,
  HydrogenComponentSchema,
} from '@weaverse/hydrogen';
import {CSSProperties, forwardRef} from 'react';
import {Swiper, SwiperSlide} from 'swiper/react';
import 'swiper/swiper-bundle.css';
import 'swiper/css/pagination';
import {IconImageBlank, IconInstagram} from '~/components/Icon';
import clsx from 'clsx';
import {Pagination} from 'swiper/modules';

type InstagramData = {
  instagramToken: string;
  backgroundColor: string;
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

type InstagramProps = HydrogenComponentProps<
  Awaited<ReturnType<typeof loader>>
> &
  InstagramData;

const Instagram = forwardRef<HTMLElement, InstagramProps>((props, ref) => {
  let {
    instagramToken,
    backgroundColor,
    imagesPerRow,
    speed,
    visibleOnMobile,
    loaderData,
    children,
    ...rest
  } = props;

  let sectionStyle: CSSProperties = {
    backgroundColor: backgroundColor,
    '--speed': `${speed}s`,
    '--swiper-theme-color': '#3D490B',
  } as CSSProperties;
  const imageItemBlank = () => {
    return (
      <div className="flex aspect-square w-full items-center justify-center bg-background-subtle-1">
        <IconImageBlank
          viewBox="0 0 526 526"
          className="!h-full !w-full opacity-80"
        />
      </div>
    );
  };

  let res = loaderData?.data;
  if (!res) {
    return (
      <section
        ref={ref}
        {...rest}
        className={clsx('w-full')}
        style={sectionStyle}
      >
        <div className="flex w-full flex-col items-center justify-center gap-12 px-7 py-12 sm:px-10 sm:py-20">
          <div className="h-full w-full text-center">{children}</div>
          <Swiper
            loop={true}
            slidesPerView={1}
            spaceBetween={100}
            pagination={{
              clickable: true,
            }}
            modules={[Pagination]}
            className="w-full sm:hidden"
          >
            {Array.from({length: 3}).map((idx, i) => {
              return (
                <SwiperSlide key={i}>
                  <div key={i} className="w-full">
                    {imageItemBlank()}
                  </div>
                  <div className="cursor-pointer py-8"></div>
                </SwiperSlide>
              );
            })}
          </Swiper>
          <div className="hidden w-full items-center justify-center gap-4 sm:flex">
            {Array.from({length: 3}).map((idx, i) => (
              <div key={i} className="w-full">
                {imageItemBlank()}
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }
  let displayedImages = res?.slice(0, imagesPerRow);
  const imageItemRender = () => {
    return (
      <div
        className="hidden items-center justify-center gap-4 sm:flex sm:animate-scrollImage"
        style={{animationDuration: `var(--speed)`}}
      >
        {displayedImages.map((item, index) => {
          return (
            <div
              className="group relative aspect-square min-w-80 cursor-pointer"
              key={index}
            >
              <Image
                key={index}
                src={item.media_url}
                className="aspect-square w-full object-cover"
                sizes="auto"
              />
              <div className="absolute inset-0 z-10 hidden items-center justify-center group-hover:flex">
                <a
                  href={`https://www.instagram.com/${item.username}/`}
                  target="_blank"
                  className="flex items-center justify-center gap-2"
                >
                  <IconInstagram className="h-7 w-7" viewBox="0 0 24 24" />
                  <span className="font-heading text-xl font-medium text-white">
                    {item.username}
                  </span>
                </a>
              </div>
              <div className="absolute inset-0 opacity-0 transition-colors duration-500 group-hover:bg-[#554612] group-hover:opacity-50" />
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <section
      ref={ref}
      {...rest}
      className={clsx('h-full w-full', !visibleOnMobile && 'hidden sm:block')}
      style={sectionStyle}
    >
      <div className="flex flex-col gap-12 px-7 py-12 sm:px-10 sm:py-20">
        <div className="h-full w-full text-center">{children}</div>
        <div className="flex gap-0 overflow-hidden sm:gap-4">
          {res.length === 0 ? (
            <div className="flex h-full w-full items-center justify-center gap-4">
              <p>Not found post</p>
            </div>
          ) : (
            <>
              <Swiper
                loop={true}
                slidesPerView={1}
                spaceBetween={100}
                pagination={{
                  clickable: true,
                }}
                modules={[Pagination]}
                className="w-full sm:hidden"
              >
                {displayedImages.map((item, index) => {
                  return (
                    <SwiperSlide key={index}>
                      <div className="group relative aspect-square min-w-80">
                        <Image
                          src={item.media_url}
                          sizes="auto"
                          className="aspect-square w-full object-cover"
                        />
                        <div className="absolute inset-0 z-10 hidden w-full items-center justify-center group-hover:flex">
                          <a
                            href={`https://www.instagram.com/${item.username}/`}
                            target="_blank"
                            className="flex items-center justify-center gap-2"
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
                        <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:bg-[#554612] group-hover:opacity-50" />
                      </div>
                      <div className="cursor-pointer py-8"></div>
                    </SwiperSlide>
                  );
                })}
              </Swiper>
              {Array.from({length: 11}).map((idx, i) => (
                <div key={i}>{imageItemRender()}</div>
              ))}
            </>
          )}
        </div>
      </div>
    </section>
  );
});

export default Instagram;

export let loader = async (args: ComponentLoaderArgs<InstagramData>) => {
  let {weaverse, data} = args;
  let {fetchWithCache} = weaverse;
  if (data.instagramToken) {
    let API = `https://graph.instagram.com/me/media?fields=id,media_url,username&access_token=${data.instagramToken}`;
    let res = await fetchWithCache(API);
    return res;
  }
  return null;
};

export const schema: HydrogenComponentSchema = {
  type: 'instagram',
  title: 'Instagram',
  toolbar: ['general-settings', ['duplicate', 'delete']],
  inspector: [
    {
      group: 'Instagram',
      inputs: [
        {
          type: 'text',
          name: 'instagramToken',
          label: 'Instagram api token',
          defaultValue:
            'IGQWRPX3Eyc1RHd3padDVwRXZANdkp4ZAkE1bkxjRlNtd3V4WnBXZAXUxWWlvVjlTc2h3SU45NmZAVOHptcEswalkyTHYtckh6cnlUNTUtaHpDUjYxTE04X0RwVG5qRnJ0cDhxcnlBVjRib3BoYUxGa2xCTlFZAZAC1PMmMZD',
          placeholder: '@instagram',
          helpText:
            'Learn more about how to get <a href="https://docs.oceanwp.org/article/487-how-to-get-instagram-access-token" target="_blank">API token for Instagram</a> section.',
        },
        {
          type: 'color',
          label: 'Background color',
          name: 'backgroundColor',
          defaultValue: '#F8F8F0',
        },
        {
          type: 'range',
          name: 'imagesPerRow',
          label: 'Images',
          defaultValue: 3,
          configs: {
            min: 1,
            max: 4,
            step: 1,
          },
        },
        {
          type: 'range',
          name: 'speed',
          label: 'Scrolling speed',
          defaultValue: 70,
          configs: {
            min: 10,
            max: 100,
            step: 5,
            unit: 's',
          },
        },
        {
          type: 'switch',
          name: 'visibleOnMobile',
          label: 'Visible on mobile',
          defaultValue: true,
        },
      ],
    },
  ],
  childTypes: ['heading'],
  presets: {
    children: [
      {
        type: 'heading',
        content: 'Instagram',
      },
    ],
  },
};
