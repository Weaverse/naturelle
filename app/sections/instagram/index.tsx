import type {
    HydrogenComponentProps,
    HydrogenComponentSchema,
    ComponentLoaderArgs,
} from '@weaverse/hydrogen';
import { forwardRef, CSSProperties } from 'react';
import { Image } from '@shopify/hydrogen';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';
import clsx from 'clsx';

type InstagramData = {
    instagramToken: string;
    backgroundColor: string;
    imagesPerRow: number;
    speed: number;
    visibleOnMobile: boolean;
    loaderData: {
        data: {
            id: string;
            caption: string;
            media_url: string;
        }[];
    };
};

type InstagramProps = HydrogenComponentProps<
    Awaited<ReturnType<typeof loader>>
> &
    InstagramData;

const Instagram = forwardRef<HTMLElement, InstagramProps>((props, ref) => {
    let { instagramToken, backgroundColor, imagesPerRow, speed, visibleOnMobile, loaderData, children, ...rest } = props;

    let sectionStyle: CSSProperties = {
        backgroundColor: backgroundColor,
        '--speed': `${speed}s`,
    } as CSSProperties;

    let res = loaderData?.data;
    if (!res) {
        return (
            <section ref={ref} {...rest} className={clsx('w-full h-full')} style={sectionStyle}>
                <div className='sm:px-10 sm:py-20 flex justify-center items-center px-7 py-12 w-full h-full'>
                    <p className='font-medium text-lg'>Loading...</p>
                </div>
            </section>
        );
    }
    let displayedImages = res?.slice(0, imagesPerRow);

    return (
        <section ref={ref} {...rest} className={clsx( 'w-full h-full' ,!visibleOnMobile && 'hidden sm:block',)} style={sectionStyle}>
            <div className='sm:px-10 sm:py-20 flex flex-col gap-12 px-7 py-12'>
                <div className='w-full h-full'>
                    {children}
                </div>
                <div className='flex gap-4 overflow-hidden'>
                    {
                        res.length === 0 ? (
                            <div className='flex justify-center items-center gap-4 w-full h-full'>
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
                                    className='h-full sm:hidden'
                                >
                                    {displayedImages.map((item, index) => {
                                        return (
                                            <SwiperSlide key={index}>
                                                <Image
                                                    src={item.media_url}
                                                    sizes="auto"
                                                    className="w-80 h-80 aspect-square"
                                                />
                                            </SwiperSlide>
                                        );
                                    })}
                                </Swiper>
                                <div className='sm:flex justify-center items-center gap-4 sm:animate-scrollImage hidden'
                                    style={{ animationDuration: `var(--speed)` }}>
                                    {displayedImages.map((item, index) => {
                                        return (
                                            <Image
                                                key={index}
                                                src={item.media_url}
                                                className="min-w-80 aspect-square"
                                            />
                                        );
                                    })}
                                </div>
                                <div className='sm:flex justify-center items-center gap-4 sm:animate-scrollImage hidden'
                                    style={{ animationDuration: `var(--speed)` }}>
                                    {displayedImages.map((item, index) => {
                                        return (
                                            <Image
                                                key={index}
                                                src={item.media_url}
                                                className="min-w-80 aspect-square"
                                            />
                                        );
                                    })}
                                </div>
                                <div className='sm:flex justify-center items-center gap-4 sm:animate-scrollImage hidden'
                                    style={{ animationDuration: `var(--speed)` }}>
                                    {displayedImages.map((item, index) => {
                                        return (
                                            <Image
                                                key={index}
                                                src={item.media_url}
                                                className="min-w-80 aspect-square"
                                            />
                                        );
                                    })}
                                </div>
                                <div className='sm:flex justify-center items-center gap-4 sm:animate-scrollImage hidden'
                                    style={{ animationDuration: `var(--speed)` }}>
                                    {displayedImages.map((item, index) => {
                                        return (
                                            <Image
                                                key={index}
                                                src={item.media_url}
                                                className="min-w-80 aspect-square"
                                            />
                                        );
                                    })}
                                </div>
                                <div className='sm:flex justify-center items-center gap-4 sm:animate-scrollImage hidden'
                                    style={{ animationDuration: `var(--speed)` }}>
                                    {displayedImages.map((item, index) => {
                                        return (
                                            <Image
                                                key={index}
                                                src={item.media_url}
                                                className="min-w-80 aspect-square"
                                            />
                                        );
                                    })}
                                </div>
                                <div className='sm:flex justify-center items-center gap-4 sm:animate-scrollImage hidden'
                                    style={{ animationDuration: `var(--speed)` }}>
                                    {displayedImages.map((item, index) => {
                                        return (
                                            <Image
                                                key={index}
                                                src={item.media_url}
                                                className="min-w-80 aspect-square"
                                            />
                                        );
                                    })}
                                </div>
                                <div className='sm:flex justify-center items-center gap-4 sm:animate-scrollImage hidden'
                                    style={{ animationDuration: `var(--speed)` }}>
                                    {displayedImages.map((item, index) => {
                                        return (
                                            <Image
                                                key={index}
                                                src={item.media_url}
                                                className="min-w-80 aspect-square"
                                            />
                                        );
                                    })}
                                </div>
                                <div className='sm:flex justify-center items-center gap-4 sm:animate-scrollImage hidden'
                                    style={{ animationDuration: `var(--speed)` }}>
                                    {displayedImages.map((item, index) => {
                                        return (
                                            <Image
                                                key={index}
                                                src={item.media_url}
                                                className="min-w-80 aspect-square"
                                            />
                                        );
                                    })}
                                </div>
                                <div className='sm:flex justify-center items-center gap-4 sm:animate-scrollImage hidden'
                                    style={{ animationDuration: `var(--speed)` }}>
                                    {displayedImages.map((item, index) => {
                                        return (
                                            <Image
                                                key={index}
                                                src={item.media_url}
                                                className="min-w-80 aspect-square"
                                            />
                                        );
                                    })}
                                </div>
                                <div className='sm:flex justify-center items-center gap-4 sm:animate-scrollImage hidden'
                                    style={{ animationDuration: `var(--speed)` }}>
                                    {displayedImages.map((item, index) => {
                                        return (
                                            <Image
                                                key={index}
                                                src={item.media_url}
                                                className="min-w-80 aspect-square"
                                            />
                                        );
                                    })}
                                </div>
                                <div className='sm:flex justify-center items-center gap-4 sm:animate-scrollImage hidden'
                                    style={{ animationDuration: `var(--speed)` }}>
                                    {displayedImages.map((item, index) => {
                                        return (
                                            <Image
                                                key={index}
                                                src={item.media_url}
                                                className="min-w-80 aspect-square"
                                            />
                                        );
                                    })}
                                </div>
                            </>
                        )
                    }
                </div>
            </div>
        </section>
    );
});

export default Instagram;

export let loader = async (args: ComponentLoaderArgs<InstagramData>) => {
    let { weaverse, data } = args;
    let { fetchWithCache } = weaverse
    if (data.instagramToken) {
        let API = `https://graph.instagram.com/me/media?fields=id,caption,media_url&access_token=${data.instagramToken}`
        let res = await fetchWithCache(API)
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
                    label: 'Instagram token',
                    defaultValue: 'IGQWRPMkNrNUVTQVdsNnJJX21RYVlUZAWNKcHU2R2xVT0xMeFowRWhDakZAEckhzMmxqaU83QlVuUlp1YlVGZAEUyRmZAMbXc5NXBVSktOMERoQ2EtX09hbS04R2FYUnp1MmNucFBxUEZArLS1xbVZAnWDZAkYlFpMXVPRWMZD',
                    placeholder: '@instagram',
                    helpText: 'Learn more about how to get <a href="https://docs.oceanwp.org/article/487-how-to-get-instagram-access-token" target="_blank">API token for Instagram</a> section.',
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
                    label: 'Speed',
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
        }
    ],
    childTypes: ['heading'],
    presets: {
        children: [
            {
                type: 'heading',
                content: 'Instagram',
            }
        ],
    },
};