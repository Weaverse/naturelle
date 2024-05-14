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
import { IconImageBlank, IconInstagram } from '~/components/Icon';

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
    let { instagramToken, backgroundColor, imagesPerRow, speed, visibleOnMobile, loaderData, children, ...rest } = props;

    let sectionStyle: CSSProperties = {
        backgroundColor: backgroundColor,
        '--speed': `${speed}s`,
        '--swiper-theme-color': '#3D490B',
    } as CSSProperties;
    const imageItemBlank = () => {
        return (
            <div className="bg-background-subtle-1 flex justify-center items-center w-full aspect-square">
                <IconImageBlank
                    viewBox="0 0 526 526"
                    className="!w-full !h-full opacity-80"
                />
            </div>
        );
    }

    let res = loaderData?.data;
    if (!res) {
        return (
            <section ref={ref} {...rest} className={clsx('w-full')} style={sectionStyle}>
                <div className='sm:px-10 sm:py-20 flex flex-col justify-center items-center gap-12 px-7 py-12 w-full'>
                    <div className='w-full h-full text-center'>
                        {children}
                    </div>
                    <Swiper
                        loop={true}
                        slidesPerView={1}
                        spaceBetween={100}
                        pagination={{
                            clickable: true,
                        }}
                        modules={[Pagination]}
                        className='w-full sm:hidden'
                    >
                        {Array.from({ length: 3 }).map((idx, i) => {
                            return (
                                <SwiperSlide key={i}>
                                    <div key={i} className='w-full'>
                                        {imageItemBlank()}
                                    </div>
                                    <div className='py-8 cursor-pointer'></div>
                                </SwiperSlide>
                            );
                        })}
                    </Swiper>
                    <div className='sm:flex justify-center items-center w-full gap-4 hidden'>
                        {Array.from({ length: 3 }).map((idx, i) => (
                            <div key={i} className='w-full'>
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
            <div className='sm:flex justify-center items-center gap-4 sm:animate-scrollImage hidden'
                style={{ animationDuration: `var(--speed)` }}>
                {displayedImages.map((item, index) => {
                    return (
                        <div className='relative cursor-pointer min-w-80 group aspect-square'>
                            <Image
                                key={index}
                                src={item.media_url}
                                className="object-cover w-full aspect-square"
                            />
                            <div className='absolute inset-0 justify-center items-center z-10 hidden group-hover:flex'>
                                <a href={`https://www.instagram.com/${item.username}/`} target="_blank" className="flex gap-2 justify-center items-center">
                                    <IconInstagram className="w-7 h-7" viewBox="0 0 24 24" />
                                    <span className='text-white font-heading text-xl font-medium'>{item.username}</span>
                                </a>
                            </div>
                            <div className="absolute inset-0 group-hover:bg-[#554612] opacity-0 group-hover:opacity-50 transition-colors duration-500"/>
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <section ref={ref} {...rest} className={clsx('w-full h-full', !visibleOnMobile && 'hidden sm:block',)} style={sectionStyle}>
            <div className='sm:px-10 sm:py-20 flex flex-col gap-12 px-7 py-12'>
                <div className='w-full h-full text-center'>
                    {children}
                </div>
                <div className='flex gap-0 sm:gap-4 overflow-hidden'>
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
                                    className='w-full sm:hidden'
                                >
                                    {displayedImages.map((item, index) => {
                                        return (
                                            <SwiperSlide key={index}>
                                                <div className='relative group min-w-80 aspect-square'>
                                                    <Image
                                                        src={item.media_url}
                                                        sizes="auto"
                                                        className="object-cover w-full aspect-square"
                                                    />
                                                    <div className='absolute inset-0 justify-center items-center z-10 w-full hidden group-hover:flex'>
                                                        <a href={`https://www.instagram.com/${item.username}/`} target="_blank" className="flex gap-2 justify-center items-center">
                                                            <IconInstagram className="w-7 h-7" viewBox="0 0 24 24" />
                                                            <span className='text-white font-heading text-xl font-medium'>{item.username}</span>
                                                        </a>
                                                    </div>
                                                    <div className="absolute inset-0 group-hover:bg-[#554612] opacity-0 group-hover:opacity-50 transition-opacity duration-300"/>
                                                </div>
                                                <div className='py-8 cursor-pointer'></div>
                                            </SwiperSlide>
                                        );
                                    })}
                                </Swiper>
                                {Array.from({ length: 11 }).map((idx, i) => (
                                    <div key={i}>
                                        {imageItemRender()}
                                    </div>
                                ))}
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
        let API = `https://graph.instagram.com/me/media?fields=id,media_url,username&access_token=${data.instagramToken}`
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
                    label: 'Instagram api token',
                    defaultValue: 'IGQWRPX3Eyc1RHd3padDVwRXZANdkp4ZAkE1bkxjRlNtd3V4WnBXZAXUxWWlvVjlTc2h3SU45NmZAVOHptcEswalkyTHYtckh6cnlUNTUtaHpDUjYxTE04X0RwVG5qRnJ0cDhxcnlBVjRib3BoYUxGa2xCTlFZAZAC1PMmMZD',
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