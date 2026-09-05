import type {
  ComponentLoaderArgs,
  HydrogenComponentProps,
  WeaverseCollection,
} from "@weaverse/hydrogen";
import { createSchema } from "@weaverse/hydrogen";
import type { RefObject } from "react";
import { useState } from "react";
import { Swiper, type SwiperClass, SwiperSlide } from "swiper/react";
import { IconImageBlank } from "~/components/icon";
import { FEATURED_PRODUCTS_QUERY } from "~/graphql/queries";
import "swiper/swiper-bundle.css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { ProductCard } from "~/components/product/product-card";
import { getImageLoadingPriority } from "~/utils/image";
import { Arrows, type SlideshowArrowsProps } from "./arrows";
import { Number as SlideNumber } from "./number";

type FeaturedProductsData = {
  products: WeaverseCollection;
  totalProduct: number;
  productsPerRow: number;
  showArrows: boolean;
  showNumber: boolean;
  showPrice: boolean;
  showStar: boolean;
  showViewDetailsLink: boolean;
  numberPosition: "top" | "bottom";
  viewDetailsLinkText: string;
};

interface FeaturedProductsProps
  extends SlideshowArrowsProps,
    HydrogenComponentProps<Awaited<ReturnType<typeof loader>>>,
    FeaturedProductsData {}

const ListProducts = ({
  ref,
  ...props
}: FeaturedProductsProps & { ref?: RefObject<HTMLDivElement | null> }) => {
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
    showPrice,
    showStar,
    showViewDetailsLink,
    numberPosition,
    viewDetailsLinkText,
    loaderData,
    ...rest
  } = props;

  let res = loaderData?.collection?.products?.nodes;
  let displayedProducts = res?.slice(0, totalProduct);
  const productItemBlank = () => {
    return (
      <div className="flex w-full cursor-pointer flex-col gap-4">
        <div className="flex aspect-square w-full items-center justify-center bg-background-subtle-2">
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
            enableQuickView
            product={product}
            collection={loaderData.collection}
            loading={getImageLoadingPriority(i)}
            showPrice={showPrice}
            showStar={showStar}
            showViewDetailsLink={showViewDetailsLink}
            viewDetailsLinkText={viewDetailsLinkText}
          />
        </SwiperSlide>
      ));
    }
  };
  let id = rest["data-wv-id"];
  let key = `slideshow-${id}`;
  let [swiperInstance, setSwiperInstance] = useState<SwiperClass | null>(null);
  return (
    <div
      key={key}
      ref={ref}
      {...rest}
      data-motion="fade-up"
      className="group/arrow flex flex-col gap-12"
    >
      <div className="relative">
        <Swiper
          onSwiper={setSwiperInstance}
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
        </Swiper>
        {showArrows && <Arrows {...props} instance={swiperInstance} />}
      </div>
      {showNumber && <SlideNumber {...props} instance={swiperInstance} />}
    </div>
  );
};

export default ListProducts;

export const loader = async (
  args: ComponentLoaderArgs<FeaturedProductsData>,
) => {
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

export const schema = createSchema({
  type: "featured-products--list",
  title: "Featured products list",
  limit: 1,
  settings: [
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
      group: "Product card",
      inputs: [
        {
          type: "switch",
          label: "Show star rating",
          name: "showStar",
          defaultValue: true,
        },
        {
          type: "switch",
          label: "Show price",
          name: "showPrice",
          defaultValue: true,
        },
        {
          type: "switch",
          label: "Show view details link",
          name: "showViewDetailsLink",
          defaultValue: true,
        },
        {
          type: "text",
          label: "View details link text",
          name: "viewDetailsLinkText",
          defaultValue: "View full details",
          condition: "showViewDetailsLink.eq.true",
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
          defaultValue: true,
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
          defaultValue: false,
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
});
