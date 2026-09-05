import type { HydrogenComponentProps } from "@weaverse/hydrogen";
import { createSchema } from "@weaverse/hydrogen";
import type { CSSProperties, RefObject } from "react";
import { EffectFade } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-fade";
import clsx from "clsx";
import { useAnimation } from "~/hooks/use-animation";

interface SlidesProps extends HydrogenComponentProps {
  sectionHeight: number;
  width: string;
}

let widthClasses: { [item: string]: string } = {
  full: "",
  fixed: "container",
};

const Slides = ({
  ref,
  ...props
}: SlidesProps & { ref?: RefObject<HTMLElement | null> }) => {
  let { sectionHeight, width, children, ...rest } = props;
  const [scope] = useAnimation(ref);

  let sectionStyle: CSSProperties = {
    "--section-height": `${sectionHeight}px`,
  } as CSSProperties;

  return (
    <section
      ref={scope}
      {...rest}
      style={sectionStyle}
      className={clsx(
        "relative w-full px-5 py-10 md:h-(--section-height) md:px-6 lg:px-10 bg-background-basic",
        widthClasses[width],
      )}
    >
      <Swiper
        loop={true}
        slidesPerView={1}
        className="mySwiper h-full"
        effect={"fade"}
        fadeEffect={{
          crossFade: true,
        }}
        modules={[EffectFade]}
      >
        {children?.map((child, index) => (
          <SwiperSlide key={index}>{child}</SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default Slides;

export const schema = createSchema({
  type: "slides-index",
  title: "Slides",
  settings: [
    {
      group: "Slides",
      inputs: [
        {
          type: "range",
          name: "sectionHeight",
          label: "Section height",
          defaultValue: 450,
          configs: {
            min: 400,
            max: 700,
            step: 10,
            unit: "px",
          },
        },
        {
          type: "select",
          name: "width",
          label: "Content width",
          configs: {
            options: [
              { value: "full", label: "Full page" },
              { value: "fixed", label: "Fixed" },
            ],
          },
          defaultValue: "fixed",
        },
      ],
    },
  ],
  childTypes: ["slides-item"],
  presets: {
    children: [
      {
        type: "slides-item",
      },
    ],
  },
});
