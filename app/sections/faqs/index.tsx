import { Image } from "@shopify/hydrogen";
import { createSchema, type WeaverseImage } from "@weaverse/hydrogen";
import type { CSSProperties, RefObject } from "react";
import { Button } from "~/components/button";
import { IconImageBlank } from "~/components/icon";
import {
  Section,
  type SectionProps,
  sectionInspector,
} from "~/components/section";

interface FaqsData {
  image?: WeaverseImage;
  imageAlt?: string;
  imageBackgroundColor?: string;
  cardEyebrow?: string;
  cardHeading?: string;
  buttonText?: string;
  buttonLink?: string;
  heading?: string;
}

type FaqsProps = SectionProps & FaqsData;

export default function Faqs({
  ref,
  image,
  imageAlt,
  imageBackgroundColor,
  cardEyebrow = "Customer service",
  cardHeading = "Still need help?",
  buttonText = "Contact us",
  buttonLink = "/pages/contact",
  heading = "Frequently asked questions",
  gap = 24,
  style,
  children,
  ...rest
}: FaqsProps & { ref?: RefObject<HTMLElement | null> }) {
  return (
    <Section
      ref={ref}
      {...rest}
      width="full"
      gap={0}
      verticalPadding="none"
      className="py-20 px-5 md:px-6 lg:px-40"
      containerClassName="mx-auto grid w-full max-w-page items-stretch gap-(--faq-gap) md:grid-cols-2"
      style={
        {
          ...style,
          "--faq-gap": `${gap}px`,
        } as CSSProperties
      }
    >
      <div
        className="relative overflow-hidden rounded-2xl bg-(--faq-image-background)"
        style={
          {
            "--faq-image-background": imageBackgroundColor,
          } as CSSProperties
        }
      >
        {image ? (
          <Image
            data={image}
            alt={imageAlt || image.altText || "Customer service"}
            className="absolute inset-0 h-full w-full object-cover"
            sizes="(min-width: 1024px) 42vw, 100vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-background-subtle-2">
            <IconImageBlank className="size-48 opacity-60" />
          </div>
        )}
        <div className="absolute inset-0 bg-(--faq-image-background) opacity-30" />
        <div className="relative z-10 flex h-full min-h-[440px] flex-col items-center justify-center px-8 text-center text-text-inverse md:min-h-[560px] lg:min-h-[600px]">
          {cardEyebrow && (
            <p className="mb-4 text-center text-xl font-normal tracking-[-0.2px]">
              {cardEyebrow}
            </p>
          )}
          {cardHeading && (
            <p className="text-center text-[37px]">{cardHeading}</p>
          )}
          {buttonText && (
            <Button
              as="a"
              to={buttonLink || "/pages/contact"}
              variant="secondary"
              className="mt-7"
            >
              {buttonText}
            </Button>
          )}
        </div>
      </div>

      <div className="flex w-full max-w-page flex-col gap-6 lg:gap-10 justify-center py-20 lg:pl-16 lg:pr-10">
        {heading && (
          <h2 className="font-heading text-[44px] leading-[110%] font-normal text-text">
            {heading}
          </h2>
        )}
        <div className="flex flex-col gap-4">{children}</div>
      </div>
    </Section>
  );
}

export const schema = createSchema({
  type: "faqs",
  title: "FAQs",
  settings: [
    {
      group: "Content",
      inputs: [
        { type: "image", name: "image", label: "Card image" },
        {
          type: "text",
          name: "imageAlt",
          label: "Image alt text",
          defaultValue: "Customer service",
        },
        {
          type: "color",
          name: "imageBackgroundColor",
          label: "Card image background and overlay",
          defaultValue: "#382E23",
        },
        {
          type: "text",
          name: "cardEyebrow",
          label: "Card eyebrow",
          defaultValue: "Customer service",
        },
        {
          type: "text",
          name: "cardHeading",
          label: "Card heading",
          defaultValue: "Still need help?",
        },
        {
          type: "text",
          name: "buttonText",
          label: "Button text",
          defaultValue: "Contact us",
        },
        {
          type: "url",
          name: "buttonLink",
          label: "Button link",
          defaultValue: "/pages/contact",
        },
        {
          type: "text",
          name: "heading",
          label: "FAQ heading",
          defaultValue: "Frequently asked questions",
        },
      ],
    },
    ...sectionInspector.map((group) => ({
      ...group,
      inputs: group.inputs
        .filter(
          (input) => input.name !== "width" && input.name !== "verticalPadding",
        )
        .map((input) =>
          input.name === "gap" ? { ...input, defaultValue: 24 } : input,
        ),
    })),
  ],
  childTypes: ["faq--item"],
  presets: {
    children: [
      {
        type: "faq--item",
        question: "How do you protect my personal information?",
        showParagraph: true,
        paragraph:
          "Products are imported automatically from your Shopify admin. We estimate 2-3 hours for set-up. If you want to change the design of Naturelle, we estimate 3-5 hours for set-up.",
        href: "/policies/privacy-policy",
      },
      {
        type: "faq--item",
        question: "What information do you collect?",
        href: "/policies/privacy-policy",
      },
      {
        type: "faq--item",
        question: "How is my information used?",
        href: "/policies/privacy-policy",
      },
      {
        type: "faq--item",
        question: "Do you share my personal information?",
        href: "/policies/privacy-policy",
      },
      {
        type: "faq--item",
        question: "What are my privacy rights?",
        href: "/policies/privacy-policy",
      },
    ],
  },
});
