import type { HydrogenComponentProps } from "@weaverse/hydrogen";
import { createSchema } from "@weaverse/hydrogen";
import type { CSSProperties, RefObject } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Grid } from "~/components/grid";
import "swiper/swiper-bundle.css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";

interface ProductPlacementItemsProps extends HydrogenComponentProps {
  productsPerRow: number;
  thumbnailRatio: string;
  itemsSpacing: number;
}

const ProductPlacementItems = ({
  ref,
  ...props
}: ProductPlacementItemsProps & { ref?: RefObject<HTMLDivElement | null> }) => {
  let { productsPerRow, thumbnailRatio, itemsSpacing, children, ...rest } =
    props;
  let contentStyle: CSSProperties = {
    "--item-thumbs-ratio": thumbnailRatio,
    "--items-spacing": `${itemsSpacing}px`,
    "--swiper-theme-color": "#3D490B",
    "--swiper-pagination-bullet-width": "12px",
    "--swiper-pagination-bullet-height": "2px",
    "--swiper-pagination-bullet-border-radius": "2px",
  } as CSSProperties;
  return (
    <div ref={ref} {...rest} style={contentStyle} className="w-full bg-inherit">
      <div className="flex flex-col gap-5">
        <Grid
          items={productsPerRow}
          data-test="collection-grid"
          className="hidden w-full !gap-[var(--items-spacing)] sm:grid"
        >
          {children}
        </Grid>
        <div className="block w-full sm:hidden">
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
            {children?.map((child, i) => (
              <SwiperSlide key={i}>
                {child}
                <div className="cursor-pointer py-8"></div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
};

export default ProductPlacementItems;

export const schema = createSchema({
  type: "product-placement--items",
  title: "Items",
  settings: [
    {
      group: "Product",
      inputs: [
        {
          type: "range",
          name: "productsPerRow",
          label: "Products per row",
          defaultValue: 3,
          configs: {
            min: 1,
            max: 4,
            step: 1,
          },
        },
        {
          type: "select",
          label: "Thumbnail ratio",
          name: "thumbnailRatio",
          configs: {
            options: [
              { value: "1/1", label: "1/1" },
              { value: "3/4", label: "3/4" },
              { value: "4/3", label: "4/3" },
              { value: "6/4", label: "6/4" },
            ],
          },
          defaultValue: "1/1",
        },
        {
          type: "range",
          name: "itemsSpacing",
          label: "Items spacing",
          defaultValue: 24,
          configs: {
            min: 0,
            max: 50,
            step: 1,
          },
        },
      ],
    },
  ],
  childTypes: ["product-placement--item"],
  presets: {
    children: [
      {
        type: "product-placement--item",
      },
      {
        type: "product-placement--item",
      },
      {
        type: "product-placement--item",
      },
      {
        type: "product-placement--item",
      },
    ],
  },
});
