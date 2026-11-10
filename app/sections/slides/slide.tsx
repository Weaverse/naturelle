import {
  Drop,
  FlowerLotus,
  Heart,
  Leaf,
  Sparkle,
  Sun,
} from "@phosphor-icons/react";
import { Image } from "@shopify/hydrogen";
import type { HydrogenComponentProps, WeaverseImage } from "@weaverse/hydrogen";
import { createSchema } from "@weaverse/hydrogen";
import clsx from "clsx";
import type { CSSProperties, RefObject } from "react";
import { useSwiper } from "swiper/react";
import {
  IconArrowLeft,
  IconArrowRight,
  IconImageBlank,
} from "~/components/icon";

type AlignImage = "left" | "right";
interface SlideProps extends HydrogenComponentProps {
  backgroundImage?: WeaverseImage;
  backgroundColor: string;
  navigationBackgroundColor: string;
  imageAlignment?: AlignImage;
  icon?: "leaf" | "flower" | "sparkle" | "drop" | "sun" | "heart";
  enableImageAnimation?: boolean;
}

let AlignImageClasses: Record<AlignImage, string> = {
  left: "lg:flex-row",
  right: "lg:flex-row-reverse",
};

const Slide = ({
  ref,
  ...props
}: SlideProps & { ref?: RefObject<HTMLDivElement | null> }) => {
  let {
    backgroundImage,
    imageAlignment = "left",
    backgroundColor,
    navigationBackgroundColor,
    icon = "leaf",
    enableImageAnimation,
    children,
    ...rest
  } = props;

  const swiper = useSwiper();
  const icons = {
    leaf: Leaf,
    flower: FlowerLotus,
    sparkle: Sparkle,
    drop: Drop,
    sun: Sun,
    heart: Heart,
  };
  const SlideIcon = icons[icon];

  let sectionStyle: CSSProperties = {
    "--background-color": backgroundColor,
    "--navigation-background-color": navigationBackgroundColor,
  } as CSSProperties;

  return (
    <div ref={ref} {...rest} style={sectionStyle} className="group">
      <div className="w-full">
        <div
          className={clsx(
            "flex w-full flex-col items-center gap-5 md:min-h-[calc(var(--section-height)-5rem)] md:items-stretch lg:gap-5",
            AlignImageClasses[imageAlignment],
          )}
        >
          <div
            data-motion="zoom-in"
            className="relative flex aspect-[134/117] w-full items-center justify-center overflow-hidden rounded-2xl lg:aspect-auto lg:w-0 lg:min-w-0 lg:flex-1"
          >
            {backgroundImage ? (
              <Image
                data={backgroundImage}
                sizes="auto"
                className={clsx(
                  "absolute inset-0 w-full! h-full! object-cover",
                  enableImageAnimation
                    ? "group-hover:ease-in-out group-hover:scale-125 transition duration-1000"
                    : "",
                )}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-background-subtle-2">
                <IconImageBlank
                  className="w-96 h-96 opacity-80"
                  viewBox="0 0 526 526"
                />
              </div>
            )}
          </div>
          <div className="relative flex w-full flex-col items-center justify-center gap-8 rounded-2xl bg-(--background-color) px-5 py-10 md:px-6 md:py-12 lg:w-0 lg:min-w-0 lg:flex-1 lg:px-16 lg:py-20">
            <span
              aria-hidden="true"
              className="absolute top-6 h-px w-16 bg-background-basic opacity-60"
            />
            <span
              aria-hidden="true"
              className="absolute bottom-6 h-px w-16 bg-background-basic opacity-60"
            />
            <div className="flex w-full min-w-0 flex-[1_0_0] flex-col items-center justify-center gap-6">
              <div
                data-motion="fade-up"
                className="slide-icon flex size-16 shrink-0 items-center justify-center rounded-full border border-current text-(--navigation-background-color) lg:size-20"
              >
                <SlideIcon className="size-8 lg:size-10" weight="regular" />
              </div>

              <div className="flex w-full flex-col justify-center gap-4 [&_.paragraph]:w-full">
                {children}
              </div>
            </div>

            <div
              data-motion="fade-up"
              className="flex items-center justify-center gap-4"
            >
              <div className="flex items-center rounded-[999px] bg-(--navigation-background-color) px-6 py-3">
                <IconArrowLeft
                  onClick={() => swiper.slidePrev()}
                  className="w-8 h-8 cursor-pointer"
                  viewBox="0 0 32 32"
                />
              </div>

              <div className="flex items-center rounded-[999px] bg-(--navigation-background-color) px-6 py-3">
                <IconArrowRight
                  onClick={() => swiper.slideNext()}
                  className="w-8 h-8 cursor-pointer"
                  viewBox="0 0 32 32"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Slide;

export const schema = createSchema({
  type: "slides-item",
  title: "Slide",
  settings: [
    {
      group: "Slide",
      inputs: [
        {
          type: "image",
          name: "backgroundImage",
          label: "Background image",
        },
        {
          type: "toggle-group",
          label: "Image alignment",
          name: "imageAlignment",
          configs: {
            options: [
              { label: "Left", value: "left" },
              { label: "Right", value: "right" },
            ],
          },
          defaultValue: "left",
        },
        {
          type: "color",
          name: "backgroundColor",
          label: "Background color",
          defaultValue: "#f8f8f0",
        },
        {
          type: "color",
          name: "navigationBackgroundColor",
          label: "Navigation background color",
          defaultValue: "#F9F7F2",
        },
        {
          type: "select",
          name: "icon",
          label: "Icon",
          configs: {
            options: [
              { label: "Leaf", value: "leaf" },
              { label: "Flower", value: "flower" },
              { label: "Sparkle", value: "sparkle" },
              { label: "Drop", value: "drop" },
              { label: "Sun", value: "sun" },
              { label: "Heart", value: "heart" },
            ],
          },
          defaultValue: "leaf",
        },
        {
          type: "switch",
          name: "enableImageAnimation",
          label: "Enable image animation",
          defaultValue: true,
        },
      ],
    },
  ],
  childTypes: ["slides-heading", "slides-paragraph"],
  presets: {
    children: [
      {
        type: "slides-heading",
        content: "Heading",
      },
      {
        type: "slides-paragraph",
        content:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
      },
    ],
  },
});
