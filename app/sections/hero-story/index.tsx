import {
  createSchema,
  type HydrogenComponentProps,
  IMAGES_PLACEHOLDERS,
  type WeaverseImage,
} from "@weaverse/hydrogen";
import type { CSSProperties, RefObject } from "react";
import { Button } from "~/components/button";
import { Image } from "~/components/image";
import { sectionImage } from "~/utils/section-placeholder";

interface HeroStoryData {
  eyebrow: string;
  heading: string;
  description: string;
  firstStatValue: string;
  firstStatLabel: string;
  secondStatValue: string;
  secondStatLabel: string;
  buttonText: string;
  buttonLink: string;
  image?: WeaverseImage | string;
  accentColor: string;
}

type HeroStoryProps = HydrogenComponentProps & HeroStoryData;

export default function HeroStory({
  ref,
  eyebrow,
  heading,
  description,
  firstStatValue,
  firstStatLabel,
  secondStatValue,
  secondStatLabel,
  buttonText,
  buttonLink,
  image,
  accentColor,
  ...rest
}: HeroStoryProps & { ref?: RefObject<HTMLElement | null> }) {
  const imageData = sectionImage(
    image,
    IMAGES_PLACEHOLDERS.image,
    "Hero story placeholder",
  );
  const showFirstStat = Boolean(
    firstStatValue?.trim() || firstStatLabel?.trim(),
  );
  const showSecondStat = Boolean(
    secondStatValue?.trim() || secondStatLabel?.trim(),
  );
  const style = {
    "--hero-story-accent": accentColor,
  } as CSSProperties;

  return (
    <section
      ref={ref}
      {...rest}
      className="mt-10 w-full px-5 md:px-6 lg:px-0"
      style={style}
    >
      <div className="mx-auto flex w-full max-w-page flex-col items-stretch gap-10 rounded-2xl bg-background-subtle-2 px-6 py-12 md:flex-row md:items-center md:gap-5 md:p-12 lg:gap-16">
        <div className="flex w-full flex-col items-start gap-8 md:min-w-0 md:flex-1">
          {eyebrow?.trim() && (
            <div className="flex flex-col items-start gap-2">
              <p className="font-body text-[11px] leading-normal font-semibold text-(--hero-story-accent) uppercase">
                {eyebrow}
              </p>
              <span className="h-[1.5px] w-12 bg-(--hero-story-accent)" />
            </div>
          )}

          <h2 className="font-heading text-[40px] leading-[1.1] font-normal text-text md:text-5xl desktop:max-w-120 desktop:text-[56px]">
            {heading}
          </h2>

          <p className="font-body text-[15px] leading-[1.7] font-normal text-text">
            {description}
          </p>

          {(showFirstStat || showSecondStat) && (
            <div className="flex flex-wrap items-start gap-8 text-text">
              {showFirstStat && (
                <div className="flex flex-col items-start gap-1">
                  {firstStatValue?.trim() && (
                    <p className="font-heading text-[28px] leading-normal font-normal">
                      {firstStatValue}
                    </p>
                  )}
                  {firstStatLabel?.trim() && (
                    <p className="font-body text-[11px] leading-normal font-normal uppercase">
                      {firstStatLabel}
                    </p>
                  )}
                </div>
              )}
              {showSecondStat && (
                <div className="flex flex-col items-start gap-1">
                  {secondStatValue?.trim() && (
                    <p className="font-heading text-[28px] leading-normal font-normal">
                      {secondStatValue}
                    </p>
                  )}
                  {secondStatLabel?.trim() && (
                    <p className="font-body text-[11px] leading-normal font-normal uppercase">
                      {secondStatLabel}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {buttonText && (
            <Button
              to={buttonLink}
              className="h-auto rounded-xl px-6 py-3.5 font-body text-base leading-[1.6] tracking-[-0.16px]"
            >
              {buttonText}
            </Button>
          )}
        </div>

        <div className="h-90 min-w-0 flex-1 overflow-hidden rounded-2xl md:h-115 desktop:h-135">
          <Image
            data={imageData}
            sizes="(min-width: 768px) 50vw, 100vw"
            className="rounded-2xl"
          />
        </div>
      </div>
    </section>
  );
}

export const schema = createSchema({
  type: "hero-story",
  title: "Hero story",
  settings: [
    {
      group: "Content",
      inputs: [
        {
          type: "text",
          name: "eyebrow",
          label: "Eyebrow",
          defaultValue: "Story eyebrow",
        },
        {
          type: "text",
          name: "heading",
          label: "Heading",
          defaultValue: "Story heading",
        },
        {
          type: "textarea",
          name: "description",
          label: "Description",
          defaultValue:
            "Use this space to introduce your store and share your story.",
        },
        {
          type: "text",
          name: "firstStatValue",
          label: "First stat value",
          defaultValue: "Stat value",
        },
        {
          type: "text",
          name: "firstStatLabel",
          label: "First stat label",
          defaultValue: "Stat label",
        },
        {
          type: "text",
          name: "secondStatValue",
          label: "Second stat value",
          defaultValue: "Stat value",
        },
        {
          type: "text",
          name: "secondStatLabel",
          label: "Second stat label",
          defaultValue: "Stat label",
        },
        {
          type: "text",
          name: "buttonText",
          label: "Button text",
          defaultValue: "Read more",
        },
        {
          type: "url",
          name: "buttonLink",
          label: "Button link",
          defaultValue: "#",
        },
      ],
    },
    {
      group: "Media",
      inputs: [
        {
          type: "image",
          name: "image",
          label: "Image",
          defaultValue: IMAGES_PLACEHOLDERS.image,
        },
      ],
    },
    {
      group: "Style",
      inputs: [
        {
          type: "color",
          name: "accentColor",
          label: "Eyebrow and line color",
          defaultValue: "#B07D6A",
        },
      ],
    },
  ],
  presets: {
    eyebrow: "Story eyebrow",
    heading: "Story heading",
    description: "Use this space to introduce your store and share your story.",
    firstStatValue: "Stat value",
    firstStatLabel: "Stat label",
    secondStatValue: "Stat value",
    secondStatLabel: "Stat label",
    buttonText: "Read more",
    buttonLink: "#",
    image: IMAGES_PLACEHOLDERS.image,
    accentColor: "#B07D6A",
  },
});
