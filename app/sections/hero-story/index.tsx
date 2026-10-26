import {
  createSchema,
  type HydrogenComponentProps,
  IMAGES_PLACEHOLDERS,
  type WeaverseImage,
} from "@weaverse/hydrogen";
import type { CSSProperties, RefObject } from "react";
import { Button } from "~/components/button";
import { Image } from "~/components/image";
import { useWeaverseStudioCheck } from "~/hooks/use-weaverse-studio-check";

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
  const isDesignMode = useWeaverseStudioCheck();
  const configuredImage = typeof image === "string" ? { url: image } : image;
  const imageData =
    isDesignMode && !configuredImage?.url
      ? { url: IMAGES_PLACEHOLDERS.image, altText: "Hero story placeholder" }
      : configuredImage;
  const isPlaceholder = imageData?.url === IMAGES_PLACEHOLDERS.image;
  const showImage = Boolean(imageData?.url) && (isDesignMode || !isPlaceholder);
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
              className="h-auto rounded-xl px-6 py-3 font-body text-base leading-[1.6] tracking-[-0.16px]"
            >
              {buttonText}
            </Button>
          )}
        </div>

        {showImage && (
          <div className="h-90 min-w-0 flex-1 overflow-hidden rounded-2xl md:h-115 desktop:h-135">
            <Image
              data={imageData}
              sizes="(min-width: 768px) 50vw, 100vw"
              className="rounded-2xl"
            />
          </div>
        )}
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
          defaultValue: "The Signature Curation",
        },
        {
          type: "text",
          name: "heading",
          label: "Heading",
          defaultValue: "Rituals for Radiant Clarity",
        },
        {
          type: "textarea",
          name: "description",
          label: "Description",
          defaultValue:
            "Botanical actives meet clinical precision — formulas designed to renew, hydrate, and balance your skin from the cellular level up.",
        },
        {
          type: "text",
          name: "firstStatValue",
          label: "First stat value",
          defaultValue: "98%",
        },
        {
          type: "text",
          name: "firstStatLabel",
          label: "First stat label",
          defaultValue: "Organic Actives",
        },
        {
          type: "text",
          name: "secondStatValue",
          label: "Second stat value",
          defaultValue: "pH 5.5",
        },
        {
          type: "text",
          name: "secondStatLabel",
          label: "Second stat label",
          defaultValue: "Bio-Compatible",
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
          defaultValue: "/pages/about",
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
    eyebrow: "The Signature Curation",
    heading: "Rituals for Radiant Clarity",
    description:
      "Botanical actives meet clinical precision — formulas designed to renew, hydrate, and balance your skin from the cellular level up.",
    firstStatValue: "98%",
    firstStatLabel: "Organic Actives",
    secondStatValue: "pH 5.5",
    secondStatLabel: "Bio-Compatible",
    buttonText: "Read more",
    buttonLink: "/pages/about",
    image: IMAGES_PLACEHOLDERS.image,
    accentColor: "#B07D6A",
  },
});
