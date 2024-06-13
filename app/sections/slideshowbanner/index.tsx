import type {
  HydrogenComponentProps,
  HydrogenComponentSchema,
} from "@weaverse/hydrogen";
import { CSSProperties, forwardRef } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';
import { EffectFade } from 'swiper/modules';
import 'swiper/css/effect-fade';

interface SlideShowBannerProps extends HydrogenComponentProps {
}

let SlideShowBanner = forwardRef<HTMLElement, SlideShowBannerProps>((props, ref) => {
  let {
    children,
    ...rest
  } = props;

  let sectionStyle: CSSProperties = {
    '--swiper-theme-color': '#3D490B',
    '--swiper-pagination-bullet-width': '12px',
    '--swiper-pagination-bullet-height': '2px',
    '--swiper-pagination-bullet-border-radius': '2px',
  } as CSSProperties;

  return (
    <section
      ref={ref}
      {...rest}
      style={sectionStyle}
    >
      <Swiper
        loop={true}
        slidesPerView={1}
        spaceBetween={100}
        effect={'fade'}
        fadeEffect={{
          crossFade: true,
        }}
        pagination={{
          clickable: true,
        }}
        modules={[Pagination, EffectFade]}
        className='w-full h-full mySwiper'
      >
        {children?.map((child, index) => (
          <SwiperSlide key={index}>
            {child}
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
});

export default SlideShowBanner;

export let schema: HydrogenComponentSchema = {
  type: "Slide-show-banner",
  title: "Slide show banner",
  toolbar: ["general-settings", ["duplicate", "delete"]],
  inspector: [
    {
      group: "Slideshow",
      inputs: [
        {
          type: "range",
          name: "sectionHeightDesktop",
          label: "Section height desktop",
          defaultValue: 450,
          configs: {
            min: 400,
            max: 700,
            step: 10,
            unit: "px",
          },
        },
        {
          type: "range",
          name: "sectionHeightMobile",
          label: "Section height mobile",
          defaultValue: 350,
          configs: {
            min: 300,
            max: 600,
            step: 10,
            unit: "px",
          },
        },
      ],
    },
  ],
  childTypes: ["slide-show-banner--item"],
  presets: {
    children: [
      {
        type: "slide-show-banner--item",
      }
    ],
  },
};
