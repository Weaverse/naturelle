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
type Alignment = "left" | "center" | "right";
interface SlideProps extends HydrogenComponentProps {
  backgroundImage?: WeaverseImage;
  backgroundColor: string;
  imageAlignment?: AlignImage;
  textAlignment?: Alignment;
  enableImageAnimation?: boolean;
}

let alignmentClasses: Record<Alignment, string> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

let AlignImageClasses: Record<AlignImage, string> = {
  left: "sm:flex-row",
  right: "sm:flex-row-reverse",
};

const Slide = ({
  ref,
  ...props
}: SlideProps & { ref?: RefObject<HTMLDivElement | null> }) => {
  let {
    backgroundImage,
    imageAlignment = "left",
    backgroundColor,
    textAlignment = "center",
    enableImageAnimation,
    children,
    ...rest
  } = props;

  const swiper = useSwiper();

  let sectionStyle: CSSProperties = {
    "--background-color": backgroundColor,
  } as CSSProperties;

  return (
    <div
      ref={ref}
      {...rest}
      style={sectionStyle}
      className="group sm:h-full h-auto"
    >
      <div className="h-full w-full sm:px-0">
        <div
          className={clsx(
            "flex flex-col justify-center items-center h-full w-full",
            AlignImageClasses[imageAlignment],
          )}
        >
          <div
            data-motion="zoom-in"
            className="w-full h-1/2 sm:h-full flex flex-1 items-center justify-center sm:w-1/2 aspect-square overflow-hidden"
          >
            {backgroundImage ? (
              <Image
                data={backgroundImage}
                sizes="auto"
                className={clsx(
                  "w-full! h-full! object-cover",
                  enableImageAnimation
                    ? "group-hover:ease-in-out group-hover:scale-125 transition duration-1000"
                    : "",
                )}
              />
            ) : (
              <div className="flex justify-center items-center bg-[#e5e6d4] w-full h-full">
                <IconImageBlank
                  className="w-96 h-96 opacity-80"
                  viewBox="0 0 526 526"
                />
              </div>
            )}
          </div>
          <div className="flex flex-col gap-0 md:gap-6 lg:gap-20 items-center justify-center px-6 py-12 bg-(--background-color) aspect-square w-full h-1/2 sm:w-1/2 sm:h-full sm:px-14 sm:py-20">
            <div
              className={clsx(
                "flex flex-col justify-center gap-4",
                alignmentClasses[textAlignment],
              )}
            >
              {children}
            </div>
            <div
              data-motion="fade-up"
              className="sm:flex gap-4 justify-center items-center hidden"
            >
              <IconArrowLeft
                onClick={() => swiper.slidePrev()}
                className="w-8 h-8 cursor-pointer"
                viewBox="0 0 32 32"
              />
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
          type: "toggle-group",
          label: "Text alignment",
          name: "textAlignment",
          configs: {
            options: [
              { label: "Left", value: "left" },
              { label: "Center", value: "center" },
              { label: "Right", value: "right" },
            ],
          },
          defaultValue: "center",
        },
        {
          type: "color",
          name: "backgroundColor",
          label: "Background color",
          defaultValue: "#f8f8f0",
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
  childTypes: ["subheading", "heading", "paragraph"],
  presets: {
    children: [
      {
        type: "subheading",
        content: "Subheading",
      },
      {
        type: "heading",
        content: "Heading",
      },
      {
        type: "paragraph",
        content:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
      },
    ],
  },
});
