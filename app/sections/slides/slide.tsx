import { PawPrint } from "@phosphor-icons/react";
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
  left: "md:flex-row",
  right: "md:flex-row-reverse",
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
      className="group h-auto md:h-full"
    >
      <div className="h-full w-full">
        <div
          className={clsx(
            "flex h-full w-full flex-col items-center justify-center gap-5 lg:gap-5",
            AlignImageClasses[imageAlignment],
          )}
        >
          <div
            data-motion="zoom-in"
            className="flex aspect-square w-full flex-1 items-center justify-center overflow-hidden rounded-2xl md:h-full md:w-1/2"
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
              <div className="flex h-full w-full items-center justify-center bg-background-subtle-2">
                <IconImageBlank
                  className="w-96 h-96 opacity-80"
                  viewBox="0 0 526 526"
                />
              </div>
            )}
          </div>
          <div className="relative flex aspect-square w-full flex-col items-center justify-center gap-6 rounded-2xl bg-(--background-color) px-5 py-10 md:px-6 md:py-12 md:h-full md:w-1/2 lg:gap-20 lg:px-16 lg:py-20">
            <span
              aria-hidden="true"
              className="absolute top-6 h-px w-16 bg-white opacity-60"
            />
            <span
              aria-hidden="true"
              className="absolute bottom-6 h-px w-16 bg-[#D4AF37] opacity-60"
            />
            <div className="flex flex-[1_0_0] flex-col items-center justify-center gap-6">
              <div
                data-motion="fade-up"
                className="flex size-16 shrink-0 items-center justify-center rounded-full border border-current lg:size-20"
              >
                <PawPrint className="size-8 lg:size-10" weight="regular" />
              </div>

              <div
                className={clsx(
                  "flex w-full flex-col justify-center gap-4 [&_.paragraph]:w-full",
                  alignmentClasses[textAlignment],
                )}
              >
                {children}
              </div>
            </div>

            <div
              data-motion="fade-up"
              className="flex items-center justify-center gap-4"
            >
              <div className="flex items-center px-6 py-3 rounded-[999px] bg-[#F9F7F2]">
                <IconArrowLeft
                  onClick={() => swiper.slidePrev()}
                  className="w-8 h-8 cursor-pointer"
                  viewBox="0 0 32 32"
                />
              </div>

              <div className="flex items-center px-6 py-3 rounded-[999px] bg-[#F9F7F2]">
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
