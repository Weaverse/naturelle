import type {
  ComponentLoaderArgs,
  HydrogenComponentProps,
  HydrogenComponentSchema,
  WeaverseCollection,
} from "@weaverse/hydrogen";
import { IconImageBlank } from "~/components/Icon";
import { FEATURED_PRODUCTS_QUERY } from "~/data/queries";
import { forwardRef, useState } from "react";
import { Swiper, SwiperClass, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { ProductCard } from "~/components/ProductCard";
import { getImageLoadingPriority } from "~/lib/const";
import { Navigation } from "swiper/modules";
import { Arrows, SlideshowArrowsProps } from "./arrows";
import { Number } from "./number";

type FeaturedProductsData = {
  products: WeaverseCollection;
  totalProduct: number;
  productsPerRow: number;
  showArrows: boolean;
  showNumber: boolean;
  numberPosition: "top" | "bottom";
};

interface FeaturedProductsProps
  extends SlideshowArrowsProps,
    HydrogenComponentProps<Awaited<ReturnType<typeof loader>>>,
    FeaturedProductsData {}

const ListProducts = forwardRef<HTMLDivElement, FeaturedProductsProps>(
  (props, ref) => {
    let {
      products,
      totalProduct,
      productsPerRow,
      showArrows,
      arrowsIcon,
      iconSize,
      showArrowsOnHover,
      arrowsColor,
      arrowsShape,
      showNumber,
      numberPosition,
      loaderData,
      ...rest
    } = props;

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
        return Array.from({ length: 4 }).map((_, i) => (
          <SwiperSlide key={i} className="w-full">
            {productItemBlank()}
          </SwiperSlide>
        ));
      } else {
        return displayedProducts.map((product, i) => (
          <SwiperSlide key={product.id}>
              <ProductCard
                quickAdd
                product={product}
                loading={getImageLoadingPriority(i)}
              />
          </SwiperSlide>
        ));
      }
    };
    let id = rest["data-wv-id"];
    let key = `slideshow-${id}`;
    let [swiperInstance, setSwiperInstance] = useState<SwiperClass | null>(
      null
    );
    return (
      <div
        key={key}
        ref={ref}
        {...rest}
        className={"group/arrow flex flex-col gap-12"}
      >
        <Swiper
          onSwiper={setSwiperInstance}
          navigation={
            showArrows && {
              nextEl: ".slideshow-arrow-next",
              prevEl: ".slideshow-arrow-prev",
            }
          }
          modules={[showArrows ? Navigation : null].filter(Boolean)}
          breakpoints={{
            320: {
              slidesPerView: 2,
              spaceBetween: 10,
            },
            640: {
              slidesPerView: 4,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 4,
              spaceBetween: 20,
            },
            1024: {
              slidesPerView: 4,
              spaceBetween: 20,
            },
          }}
          className="w-full"
        >
          {renderProducts()}
          {showArrows && <Arrows {...props} />}
        </Swiper>
        {showNumber && <Number {...props} instance={swiperInstance} />}
      </div>
    );
  }
);

export default ListProducts;

export let loader = async (args: ComponentLoaderArgs<FeaturedProductsData>) => {
  let { weaverse, data } = args;
  let { language, country } = weaverse.storefront.i18n;
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
  type: "featured-products--list",
  title: "Featured products list",
  limit: 1,
  inspector: [
    {
      group: "Featured products",
      inputs: [
        {
          type: "collection",
          name: "products",
          label: "Products",
        },
        {
          type: "range",
          name: "totalProduct",
          label: "Total products",
          defaultValue: 4,
          configs: {
            min: 1,
            max: 24,
            step: 1,
          },
        },
      ],
    },
    {
      group: "Navigation & Controls",
      inputs: [
        {
          type: "heading",
          label: "Arrows",
        },
        {
          type: "switch",
          label: "Show arrows",
          name: "showArrows",
          defaultValue: false,
        },
        {
          type: "select",
          label: "Arrow icon",
          name: "arrowsIcon",
          configs: {
            options: [
              { value: "caret", label: "Caret" },
              { value: "arrow", label: "Arrow" },
            ],
          },
          defaultValue: "arrow",
          condition: "showArrows.eq.true",
        },
        {
          type: "range",
          label: "Icon size",
          name: "iconSize",
          configs: {
            min: 16,
            max: 40,
            step: 2,
          },
          defaultValue: 20,
          condition: "showArrows.eq.true",
        },
        {
          type: "switch",
          label: "Show arrows on hover",
          name: "showArrowsOnHover",
          defaultValue: true,
          condition: "showArrows.eq.true",
        },
        {
          type: "select",
          label: "Arrows color",
          name: "arrowsColor",
          configs: {
            options: [
              { value: "light", label: "Light" },
              { value: "dark", label: "Dark" },
            ],
          },
          defaultValue: "light",
          condition: "showArrows.eq.true",
        },
        {
          type: "toggle-group",
          label: "Arrows shape",
          name: "arrowsShape",
          configs: {
            options: [
              { value: "rounded", label: "Rounded", icon: "squircle" },
              { value: "circle", label: "Circle", icon: "circle" },
              { value: "square", label: "Square", icon: "square" },
            ],
          },
          defaultValue: "rounded",
          condition: "showArrows.eq.true",
        },

        {
          type: "heading",
          label: "Slide number",
        },
        {
          type: "switch",
          label: "Show number",
          name: "showNumber",
          defaultValue: true,
        },
      ],
    },
  ],
  toolbar: ["general-settings", ["duplicate", "delete"]],
};
