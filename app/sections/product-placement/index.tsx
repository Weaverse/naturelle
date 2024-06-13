import type {
  HydrogenComponentProps,
  HydrogenComponentSchema,
} from '@weaverse/hydrogen';
import {Grid} from '~/components/Grid';
import clsx from 'clsx';
import {CSSProperties, forwardRef} from 'react';
import {Swiper, SwiperSlide} from 'swiper/react';
import 'swiper/swiper-bundle.css';
import 'swiper/css/pagination';
import {Pagination} from 'swiper/modules';

type Alignment = 'left' | 'center' | 'right';
interface ProductPlacementProps extends HydrogenComponentProps {
  textColor: string;
  heading: string;
  contentAlignment: Alignment;
  productsPerRow: number;
  thumbnailRatio: string;
  itemsSpacing: number;
  topPadding: number;
  bottomPadding: number;
}

let alignmentClasses: Record<Alignment, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
};

const ProductPlacement = forwardRef<HTMLElement, ProductPlacementProps>(
  (props, sectionRef) => {
    let {
      textColor,
      heading,
      contentAlignment,
      productsPerRow,
      thumbnailRatio,
      itemsSpacing,
      topPadding,
      bottomPadding,
      children,
      ...rest
    } = props;
    let contentStyle: CSSProperties = {
      '--top-padding': `${topPadding}px`,
      '--bottom-padding': `${bottomPadding}px`,
      '--text-color': textColor,
      '--item-thumbs-ratio': thumbnailRatio,
      '--items-spacing': `${itemsSpacing}px`,
      '--swiper-theme-color': '#3D490B',
      '--swiper-pagination-bullet-width': '12px',
      '--swiper-pagination-bullet-height': '2px',
      '--swiper-pagination-bullet-border-radius': '2px',
    } as CSSProperties;
    return (
      <section
        ref={sectionRef}
        {...rest}
        style={contentStyle}
        className={clsx(
          'w-full bg-secondary',
          alignmentClasses[contentAlignment],
        )}
      >
        <div className="flex flex-col gap-5 px-5 pb-[var(--bottom-padding)] pt-[var(--top-padding)] md:px-8 lg:px-10">
          <h2 className="font-medium text-[var(--text-color)]">{heading}</h2>
          <Grid
            items={productsPerRow}
            data-test="collection-grid"
            className=" hidden w-full !gap-[var(--items-spacing)] sm:grid"
          >
            {children}
          </Grid>
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
            {children?.map((child, i) => (
              <SwiperSlide key={i}>
                {child}
                <div className="cursor-pointer py-8"></div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>
    );
  },
);

export default ProductPlacement;

export const schema: HydrogenComponentSchema = {
  type: 'product-placement',
  title: 'Product placement',
  inspector: [
    {
      group: 'Product',
      inputs: [
        {
          type: 'color',
          name: 'textColor',
          label: 'Text color',
        },
        {
          type: 'text',
          name: 'heading',
          label: 'Heading',
          defaultValue: 'Shop the look',
        },
        {
          type: 'toggle-group',
          label: 'Content alignment',
          name: 'contentAlignment',
          configs: {
            options: [
              {label: 'Left', value: 'left'},
              {label: 'Center', value: 'center'},
              {label: 'Right', value: 'right'},
            ],
          },
          defaultValue: 'left',
        },
        {
          type: 'range',
          name: 'productsPerRow',
          label: 'Products per row',
          defaultValue: 3,
          configs: {
            min: 1,
            max: 4,
            step: 1,
          },
        },
        {
          type: 'select',
          label: 'Thumbnail ratio',
          name: 'thumbnailRatio',
          configs: {
            options: [
              {value: '1/1', label: '1/1'},
              {value: '3/4', label: '3/4'},
              {value: '4/3', label: '4/3'},
              {value: '6/4', label: '6/4'},
            ],
          },
          defaultValue: '1/1',
        },
        {
          type: 'range',
          name: 'itemsSpacing',
          label: 'Items spacing',
          defaultValue: 24,
          configs: {
            min: 0,
            max: 50,
            step: 1,
          },
        },
        {
          type: 'range',
          name: 'topPadding',
          label: 'Top padding',
          defaultValue: 40,
          configs: {
            min: 0,
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
            min: 0,
            max: 100,
            step: 1,
          },
        },
      ],
    },
  ],
  childTypes: ['product-placement--item'],
  presets: {
    children: [
      {
        type: 'product-placement--item',
      },
      {
        type: 'product-placement--item',
      },
      {
        type: 'product-placement--item',
      },
      {
        type: 'product-placement--item',
      },
    ],
  },
};
