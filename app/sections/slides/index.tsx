import type {
    HydrogenComponentProps,
    HydrogenComponentSchema,
} from '@weaverse/hydrogen';
import { forwardRef, CSSProperties } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';

interface SlidesProps extends HydrogenComponentProps {
    sectionHeight: number;
}

const Slides = forwardRef<HTMLElement, SlidesProps>((props, ref) => {
    let {
        sectionHeight,
        children,
        ...rest
    } = props;

    let sectionStyle: CSSProperties = {
        '--section-height': `${sectionHeight}px`,
    } as CSSProperties;

    return (
        <section ref={ref} {...rest} style={sectionStyle} className='sm:h-[var(--section-height)] w-full relative'>
            <Swiper
                loop={true}
                slidesPerView={1}
                className='h-full mySwiper'
                effect={'fade'}
                fadeEffect={{
                    crossFade: true,
                }}
                modules={[EffectFade]}
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
            ],
        },
    ],
    childTypes: ['slides-item'],
    presets: {
        children: [
            {
                type: 'slides-item',
            }
        ],
    },
};