import type {
  ComponentLoaderArgs,
  HydrogenComponentProps,
  HydrogenComponentSchema,
  WeaverseCollection,
} from '@weaverse/hydrogen';
import {IconImageBlank} from '~/components/Icon';
import {FEATURED_PRODUCTS_QUERY} from '~/data/queries';
import {CSSProperties, forwardRef} from 'react';
import {Swiper, SwiperSlide} from 'swiper/react';
import 'swiper/swiper-bundle.css';
import 'swiper/css/pagination';
import {Button} from '@/components/button';
import {ProductCard} from '~/components/ProductCard';
import {getImageLoadingPriority} from '~/lib/const';
import clsx from 'clsx';
import {Pagination} from 'swiper/modules';

type FeaturedProductsData = {
  products: WeaverseCollection;
  textColor: string;
  totalProduct: number;
  productsPerRow: number;
  showViewAllLink: boolean;
  lazyLoadImage: boolean;
};

type FeaturedProductsProps = HydrogenComponentProps<
  Awaited<ReturnType<typeof loader>>
> &
  FeaturedProductsData;

let productPerRowClasses: {[item: number]: string} = {
  1: 'sm:grid-cols-1',
  2: 'sm:grid-cols-2',
  3: 'sm:grid-cols-3',
  4: 'sm:grid-cols-4',
};

const ListProducts = forwardRef<HTMLDivElement, FeaturedProductsProps>(
  (props, ref) => {
    let {
      products,
      textColor,
      totalProduct,
      productsPerRow,
      showViewAllLink,
      lazyLoadImage,
      loaderData,
      ...rest
    } = props;

    let sectionStyle: CSSProperties = {
      color: textColor,
      '--swiper-theme-color': '#3D490B',
    } as CSSProperties;
    let res = loaderData?.collection?.products?.nodes;
    let displayedProducts = res?.slice(0, totalProduct);
    const productItemBlank = () => {
      return (
        <div className="flex w-full cursor-pointer flex-col gap-4">
          <div className="flex aspect-square w-full items-center justify-center bg-background-subtle-1">
            <IconImageBlank
              viewBox="0 0 526 526"
              className="h-full w-full opacity-80"
            />
          </div>
          <div className="flex flex-col gap-2 px-2">
            <p className="text-base font-normal">By vendor</p>
            <h4 className="font-medium">Product title</h4>
            <p className="text-base font-normal">Price</p>
          </div>
        </div>
      );
    };
    const renderProducts = () => {
      if (!loaderData || !displayedProducts) {
        return Array.from({length: 4}).map((_, i) => (
          <div key={i} className="w-full">
            {productItemBlank()}
          </div>
        ));
      } else {
        return displayedProducts.map((product, i) => (
          <ProductCard
            quickAdd
            key={product.id}
            product={product}
            className="h-full w-full"
            loading={getImageLoadingPriority(i)}
          />
        ));
      }
    };
    return (
      <div
        ref={ref}
        {...rest}
        className="flex h-full w-full justify-center"
        style={sectionStyle}
      >
        <div className={clsx('flex w-full flex-col gap-12 px-4 sm:px-6')}>
          <>
            <div className="block sm:hidden">
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
                {renderProducts().map((product, i) => (
                  <SwiperSlide key={i}>
                    {product}
                    <div className="cursor-pointer py-8"></div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
            <div
              className={clsx(
                'hidden h-fit gap-4 gap-y-10 justify-self-center sm:grid',
                productPerRowClasses[
                  Math.min(productsPerRow, displayedProducts?.length || 4)
                ],
                'justify-items-center',
              )}
            >
              {renderProducts()}
            </div>
          </>
          {showViewAllLink && loaderData && loaderData.collection && (
            <div className="flex justify-center">
              <Button
                to={`/collections/${loaderData.collection.handle}`}
                variant="outline"
              >
                <span className="font-[Cormorant] text-xl">View all</span>
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  },
);

export default ListProducts;

export let loader = async (args: ComponentLoaderArgs<FeaturedProductsData>) => {
  let {weaverse, data} = args;
  let {language, country} = weaverse.storefront.i18n;
  if (data.products) {
    return await weaverse.storefront.query(FEATURED_PRODUCTS_QUERY, {
      variables: {
        handle: data.products.handle,
        country,
        language,
      },
    });
  }
  return null;
};

export let schema: HydrogenComponentSchema = {
  type: 'featured-products--list',
  title: 'Featured products list',
  limit: 1,
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
