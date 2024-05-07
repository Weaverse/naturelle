import type {
    HydrogenComponentProps,
    HydrogenComponentSchema,
    ComponentLoaderArgs,
    WeaverseCollection,
} from '@weaverse/hydrogen';
import { forwardRef, CSSProperties } from 'react';
import { FEATURED_PRODUCTS_QUERY } from '~/data/queries';
import { IconImageBlank } from '~/components/Icon';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';
import clsx from 'clsx';
import { Button } from '@/components/button';
import { ProductCard } from '~/components/ProductCard';
import { getImageLoadingPriority } from '~/lib/const';

type Alignment = 'left' | 'center' | 'right';
type FeaturedProductsData = {
    products: WeaverseCollection;
    textColor: string;
    backgroundColor: string;
    heading: string;
    contentAlignment: Alignment;
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

let alignmentClasses: Record<Alignment, string> = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
};

const FeaturedProducts = forwardRef<HTMLElement, FeaturedProductsProps>(
    (props, ref) => {
        let { products, textColor, backgroundColor, heading, contentAlignment, totalProduct, productsPerRow, showViewAllLink, topPadding, bottomPadding, lazyLoadImage, loaderData, children, ...rest } = props;

        let sectionStyle: CSSProperties = {
            color: textColor,
            '--background-color': backgroundColor,
            '--top-padding-desktop': `${topPadding}px`,
            '--bottom-padding-desktop': `${bottomPadding}px`,
            '--top-padding-mobile': `${topPadding > 20 ? topPadding - 20 : topPadding}px`,
            '--bottom-padding-mobile': `${bottomPadding > 20 ? bottomPadding - 20 : bottomPadding}px`,
            '--swiper-theme-color': '#3D490B',
        } as CSSProperties;
        let res = loaderData?.collection?.products?.nodes;
        let displayedProducts = res?.slice(0, totalProduct);
        const productItemBlank = () => {
            return (
                <div className='flex flex-col gap-4 w-full cursor-pointer'>
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
            );
        }
        return (
            <section ref={ref} {...rest} className='w-full h-full flex justify-center bg-[var(--background-color)]' style={sectionStyle}>
                <div className={clsx(
                    alignmentClasses[contentAlignment],
                    'px-4 w-full flex flex-col gap-12 max-w-[1440px] sm:px-6 pt-[var(--top-padding-mobile)] pb-[var(--bottom-padding-mobile)] sm:pt-[var(--top-padding-desktop)] sm:pb-[var(--bottom-padding-desktop)]',
                )}>
                    {children}
                    {loaderData === null ? (
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
                                {Array.from({ length: 4 }).map((idx, i) => {
                                    return (
                                        <SwiperSlide key={i}>
                                            <div key={i} className='w-full'>
                                                {productItemBlank()}
                                            </div>
                                            <div className='py-8 cursor-pointer'></div>
                                        </SwiperSlide>
                                    );
                                })}
                            </Swiper>
                            <div className={clsx('sm:grid justify-self-center gap-4 hidden grid-cols-4',
                            )}>
                                {Array.from({ length: 4 }).map((idx, i) => (
                                    <div key={i} className='w-full'>
                                        {productItemBlank()}
                                    </div>
                                ))}
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
                                {displayedProducts?.map((index: any, i: any) => {
                                    return (
                                        <SwiperSlide key={index}>
                                            <ProductCard
                                                key={index.id}
                                                product={index}
                                                loading={getImageLoadingPriority(i)}
                                            />
                                            <div className='py-8 cursor-pointer'></div>
                                        </SwiperSlide>
                                    );
                                })}
                            </Swiper>
                            <div className={clsx('sm:grid justify-self-center gap-4 gap-y-10 hidden h-fit',
                                productPerRowClasses[Math.min(productsPerRow, displayedProducts?.length || 1)]).concat(' justify-items-center')}>
                                {displayedProducts?.map((idx: any, i: any) => (
                                    <ProductCard
                                        quickAdd
                                        key={idx.id}
                                        product={idx}
                                        loading={getImageLoadingPriority(i)}
                                    />
                                ))}
                            </div>
                        </>)}
                    {showViewAllLink && loaderData && loaderData.collection && (
                        <div className='flex justify-center'>
                            <Button to={`/collections/${loaderData.collection.handle}`} variant="outline">
                                <span className='font-[Cormorant] text-xl'>View all</span>
                            </Button>
                        </div>
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
                    type: 'color',
                    name: 'backgroundColor',
                    label: 'Background color',
                    defaultValue: '#F8F8F0',
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
                    defaultValue: 'center',
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
    childTypes: ['heading'],
    presets: {
        children: [
            {
                type: 'heading',
                content: 'Best Sellers',
            }
        ],
    },
};