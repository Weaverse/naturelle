import type {
    HydrogenComponentProps,
    HydrogenComponentSchema,
    ComponentLoaderArgs,
    WeaverseCollection,
} from '@weaverse/hydrogen';
import { forwardRef, CSSProperties } from 'react';
import { FEATURED_PRODUCTS_QUERY } from '~/data/queries';
import { Image } from '@shopify/hydrogen';
import { IconImageBlank } from '~/components/Icon';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';
import { Link } from '~/components/Link';
import clsx from 'clsx';
import { Button } from '@/components/button';


type FeaturedProductsData = {
    products: WeaverseCollection;
    textColor: string;
    heading: string;
    contentAlignment: string;
    totalProduct: number;
    productsPerRow: number;
    showViewAllLink: boolean;
    topPadding: number;
    bottomPadding: number;
    lazyLoadImage: boolean;
};

type FeaturedProductsProps = HydrogenComponentProps<Awaited<ReturnType<typeof loader>>> & FeaturedProductsData;

let productPerRowClasses: { [item: number]: string } = {
    1: 'sm:grid-cols-1',
    2: 'sm:grid-cols-2',
    3: 'sm:grid-cols-3',
    4: 'sm:grid-cols-4',
};

const FeaturedProducts = forwardRef<HTMLElement, FeaturedProductsProps>(
    (props, ref) => {
        let { products, textColor, heading, contentAlignment, totalProduct, productsPerRow, showViewAllLink, topPadding, bottomPadding, lazyLoadImage, loaderData, ...rest } = props;

        let sectionStyle: CSSProperties = {
            color: textColor,
            '--top-padding-desktop': `${topPadding}px`,
            '--bottom-padding-desktop': `${bottomPadding}px`,
            '--top-padding-mobile': `${topPadding > 20 ? topPadding - 20 : topPadding}px`,
            '--bottom-padding-mobile': `${bottomPadding > 20 ? bottomPadding - 20 : bottomPadding}px`,
            '--swiper-theme-color': '#3D490B',
            textAlign: contentAlignment,
        } as CSSProperties;
        let res = loaderData?.collection?.products?.nodes;
        let displayedProducts = res?.slice(0, totalProduct);
        return (
            <section ref={ref} {...rest} className='w-full h-full flex justify-center' style={sectionStyle}>
                <div className='px-4 w-full flex flex-col max-w-[1440px] items-center gap-6 sm:px-6 pt-[var(--top-padding-mobile)] pb-[var(--bottom-padding-mobile)] sm:pt-[var(--top-padding-desktop)] sm:pb-[var(--bottom-padding-desktop)]'>
                    <div className='flex justify-center'>
                        {heading && <h2 className='font-medium'>{heading}</h2>}
                    </div>
                    {loaderData === null ? (
                        <>
                            <div className='flex flex-col sm:hidden gap-4 w-full cursor-pointer'>
                                <div className="bg-background-subtle-1 flex justify-center items-center w-full aspect-square">
                                    <IconImageBlank
                                        viewBox="0 0 526 526"
                                        className="w-full h-full opacity-80"
                                    />
                                </div>
                                <div className="flex flex-col gap-2 px-2">
                                    <p className='font-normal text-base'>By vendor</p>
                                    <h4 className='font-medium'>Product title</h4>
                                    <p className='font-normal text-base'>Price</p>
                                </div>
                            </div>
                            <div className={clsx('sm:grid justify-self-center gap-4 hidden grid-cols-4',
                            )}>
                                <div className='flex flex-col gap-4 w-full cursor-pointer transition-transform duration-300 hover:scale-105 hover:shadow'>
                                    <div className="bg-background-subtle-1 flex justify-center items-center w-full aspect-square">
                                        <IconImageBlank
                                            viewBox="0 0 526 526"
                                            className="w-full h-full opacity-80"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2 px-2">
                                        <p className='font-normal text-base'>By vendor</p>
                                        <h4 className='font-medium'>Product title</h4>
                                        <p className='font-normal text-base'>Price</p>
                                    </div>
                                </div>
                                <div className='flex flex-col gap-4 w-full cursor-pointer transition-transform duration-300 hover:scale-105 hover:shadow'>
                                    <div className="bg-background-subtle-1 flex justify-center items-center w-full aspect-square">
                                        <IconImageBlank
                                            viewBox="0 0 526 526"
                                            className="w-full h-full opacity-80"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2 px-2">
                                        <p className='font-normal text-base'>By vendor</p>
                                        <h4 className='font-medium'>Product title</h4>
                                        <p className='font-normal text-base'>Price</p>
                                    </div>
                                </div>
                                <div className='flex flex-col gap-4 w-full cursor-pointer transition-transform duration-300 hover:scale-105 hover:shadow'>
                                    <div className="bg-background-subtle-1 flex justify-center items-center w-full aspect-square">
                                        <IconImageBlank
                                            viewBox="0 0 526 526"
                                            className="w-full h-full opacity-80"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2 px-2">
                                        <p className='font-normal text-base'>By vendor</p>
                                        <h4 className='font-medium'>Product title</h4>
                                        <p className='font-normal text-base'>Price</p>
                                    </div>
                                </div>
                                <div className='flex flex-col gap-4 w-full cursor-pointer transition-transform duration-300 hover:scale-105 hover:shadow'>
                                    <div className="bg-background-subtle-1 flex justify-center items-center w-full aspect-square">
                                        <IconImageBlank
                                            viewBox="0 0 526 526"
                                            className="w-full h-full opacity-80"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2 px-2">
                                        <p className='font-normal text-base'>By vendor</p>
                                        <h4 className='font-medium'>Product title</h4>
                                        <p className='font-normal text-base'>Price</p>
                                    </div>
                                </div>
                            </div>
                        </>
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
                                className='sm:hidden w-full'
                            >
                                {displayedProducts?.map((index: any) => {
                                    return (
                                        <SwiperSlide key={index}>
                                            <Link to={`/products/${index.handle}`}>
                                                <div className='flex flex-col gap-4 w-full cursor-pointer'>
                                                    {index.featuredImage ? (
                                                        <Image
                                                            data={index.featuredImage}
                                                            loading={lazyLoadImage ? 'lazy' : 'eager'}
                                                            sizes="auto"
                                                            className="!w-full !aspect-square object-cover"
                                                        />) : (
                                                        <div className="bg-background-subtle-1 flex justify-center items-center w-full aspect-square">
                                                            <IconImageBlank
                                                                viewBox="0 0 526 526"
                                                                className="w-full h-full opacity-80"
                                                            />
                                                        </div>)}
                                                    <div className="flex flex-col gap-4">
                                                        <p className='font-normal text-base'>By {index.vendor}</p>
                                                        <h4 className='font-medium'>{index.title}</h4>
                                                        <p className='font-normal text-base'>{`${index.priceRange.maxVariantPrice.amount} ${index.priceRange.maxVariantPrice.currencyCode}`}</p>
                                                    </div>
                                                </div>
                                            </Link>
                                            <div className='py-8 cursor-pointer'></div>
                                        </SwiperSlide>
                                    );
                                })}
                            </Swiper>
                            <div className={clsx('sm:grid justify-self-center gap-4 hidden h-fit',
                                productPerRowClasses[Math.min(productsPerRow, displayedProducts?.length || 1)]).concat(' justify-items-center')}>
                                {displayedProducts?.map((idx: any) => (
                                    <div className='flex flex-col gap-4 w-full h-full cursor-pointer group'>
                                        {idx.featuredImage ? (
                                            <div className='relative flex justify-center items-center'>
                                                <Image
                                                    data={idx.featuredImage}
                                                    loading={lazyLoadImage ? 'lazy' : 'eager'}
                                                    sizes="auto"
                                                    className="!w-full !aspect-square object-cover"
                                                />
                                                <div className='absolute bottom-0 py-4 px-2 w-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 bg-[rgba(238,239,234,0.10)] backdrop-blur-2xl'>
                                                    <Button variant="secondary" className='w-full'
                                                        to={`/products/${idx.handle}`}>
                                                        Select Options
                                                    </Button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="bg-background-subtle-1 flex justify-center items-center w-full aspect-square">
                                                <IconImageBlank
                                                    viewBox="0 0 526 526"
                                                    className="w-full h-full opacity-80"
                                                />
                                            </div>)}
                                        <div className="flex flex-col gap-2 px-2">
                                            <p className='font-normal text-base'>By {idx.vendor}</p>
                                            <h4 className='font-medium'>{idx.title}</h4>
                                            <p className='font-normal text-base'>{`${idx.priceRange.maxVariantPrice.amount} ${idx.priceRange.maxVariantPrice.currencyCode}`}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>)}
                    {showViewAllLink && loaderData && loaderData.collection && (
                        <Button to={`/collections/${loaderData.collection.handle}`} variant="outline">
                            <h3>View All</h3>
                        </Button>
                    )}
                </div>
            </section>
        );
    },
);

export default FeaturedProducts;

export let loader = async (args: ComponentLoaderArgs<FeaturedProductsData>) => {
    let { weaverse, data } = args;
    let { language, country } = weaverse.storefront.i18n;
    if (data.products) {
        return await weaverse.storefront.query(
            FEATURED_PRODUCTS_QUERY,
            {
                variables: {
                    handle: data.products.handle,
                    country,
                    language,
                },
            },
        );
    }
    return null;
};

export let schema: HydrogenComponentSchema = {
    type: 'featured-products',
    title: 'Featured products',
    inspector: [
        {
            group: 'Featured products',
            inputs: [
                {
                    type: 'collection',
                    name: 'products',
                    label: 'Products',
                },
                {
                    type: 'color',
                    name: 'textColor',
                    label: 'Text color',
                },
                {
                    type: 'text',
                    name: 'heading',
                    label: 'Heading',
                    defaultValue: 'Best Sellers',
                },
                {
                    type: 'toggle-group',
                    label: 'Content alignment',
                    name: 'contentAlignment',
                    configs: {
                        options: [
                            { label: 'Left', value: 'left' },
                            { label: 'Center', value: 'center' },
                            { label: 'Right', value: 'right' },
                        ],
                    },
                    defaultValue: 'left',
                },
                {
                    type: 'range',
                    name: 'totalProduct',
                    label: 'Total products',
                    defaultValue: 4,
                    configs: {
                        min: 1,
                        max: 24,
                        step: 1,
                    },
                },
                {
                    type: 'range',
                    name: 'productsPerRow',
                    label: 'Products per row',
                    defaultValue: 4,
                    configs: {
                        min: 1,
                        max: 4,
                        step: 1,
                    },
                },
                {
                    type: 'switch',
                    name: 'showViewAllLink',
                    label: 'Show “View All” link',
                    defaultValue: true,
                },
                {
                    type: 'range',
                    name: 'topPadding',
                    label: 'Top padding',
                    defaultValue: 40,
                    configs: {
                        min: 10,
                        max: 100,
                        step: 1,
                    },
                },
                {
                    type: 'range',
                    name: 'bottomPadding',
                    label: 'Bottom padding',
                    defaultValue: 40,
                    configs: {
                        min: 10,
                        max: 100,
                        step: 1,
                    },
                },
                {
                    type: 'switch',
                    name: 'lazyLoadImage',
                    label: 'Lazy load image',
                    defaultValue: true,
                },
            ],
        },
    ],
    toolbar: ['general-settings', ['duplicate', 'delete']],
};