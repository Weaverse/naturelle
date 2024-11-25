import type {
  HydrogenComponentProps,
  HydrogenComponentSchema,
} from '@weaverse/hydrogen';
import {CSSProperties, forwardRef, useEffect, useState} from 'react';
import {EffectFade, Pagination} from 'swiper/modules';
import {Swiper, SwiperSlide} from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-fade';
import clsx from 'clsx';
import { useMotion } from '~/hooks/use-motion';

interface SlidesProps extends HydrogenComponentProps {
  sectionHeight: number;
  width: string;
}

let widthClasses: {[item: string]: string} = {
  full: '',
  fixed: 'container',
};

const Slides = forwardRef<HTMLElement, SlidesProps>((props, ref) => {
  let {sectionHeight, width, children, ...rest} = props;
  const [isMobile, setIsMobile] = useState(false);
  const [scope] = useMotion(ref);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    handleResize(); 
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  let sectionStyle: CSSProperties = {
    '--section-height': `${sectionHeight}px`,
    '--swiper-pagination-bottom': '50%',
    '--swiper-pagination-top': '50%',
    '--swiper-theme-color': '#3D490B',
  } as CSSProperties;

  return (
    <section
      ref={scope}
      {...rest}
      style={sectionStyle}
      className={clsx(
        'relative w-full sm:h-[var(--section-height)]',
        widthClasses[width],
      )}
    >
      <Swiper
        loop={true}
        slidesPerView={1}
        className="mySwiper h-full"
        effect={'fade'}
        fadeEffect={{
          crossFade: true,
        }}
        pagination={isMobile && {
          clickable: true,
        }}
        modules={[EffectFade, Pagination]}
      >
        {children?.map((child, index) => (
          <SwiperSlide key={index}>{child}</SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
});

export default Slides;

export let schema: HydrogenComponentSchema = {
  type: 'slides-index',
  title: 'Slides',
  toolbar: ['general-settings', ['duplicate', 'delete']],
  inspector: [
    {
      group: 'Slides',
      inputs: [
        {
          type: 'range',
          name: 'sectionHeight',
          label: 'Section height',
          defaultValue: 450,
          configs: {
            min: 400,
            max: 700,
            step: 10,
            unit: 'px',
          },
        },
        {
          type: 'select',
          name: 'width',
          label: 'Content width',
          configs: {
            options: [
              {value: 'full', label: 'Full page'},
              {value: 'fixed', label: 'Fixed'},
            ],
          },
          defaultValue: 'fixed',
        },
      ],
    },
  ],
  childTypes: ['slides-item'],
  presets: {
    children: [
      {
        type: 'slides-item',
      },
    ],
  },
};
