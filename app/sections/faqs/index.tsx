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
  cardEyebrow?: string;
  cardHeading?: string;
  cardDescription?: string;
  buttonText?: string;
  buttonLink?: string;
  eyebrow?: string;
  heading?: string;
}

type FaqsProps = SectionProps & FaqsData;

export default function Faqs({
  ref,
  image,
  imageAlt,
  cardEyebrow = "Customer service",
  cardHeading = "Still need help?",
  cardDescription = "Our team is here to help with any questions you may have.",
  buttonText = "Contact us",
  buttonLink = "/pages/contact",
  eyebrow = "Customer care",
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
      containerClassName="mx-auto grid w-full max-w-lg items-stretch gap-(--faq-gap) md:grid-cols-2"
      style={
        {
          ...style,
          "--faq-gap": `${gap}px`,
        } as CSSProperties
      }
    >
      <div className="relative overflow-hidden rounded-2xl bg-[#382E23]">
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
        <div className="absolute inset-0 bg-[#382E23]/30" />
        <div className="relative z-10 flex h-full min-h-[440px] flex-col items-center justify-center px-8 text-center text-white md:min-h-[560px] lg:min-h-[600px]">
          {cardEyebrow && (
            <p className="mb-4 text-sm uppercase tracking-[0.16em]">
              {cardEyebrow}
            </p>
          )}
          {cardHeading && (
            <h3 className="font-heading text-3xl md:text-4xl">{cardHeading}</h3>
          )}
          {cardDescription && (
            <p className="mt-5 max-w-sm text-sm leading-6 md:text-base">
              {cardDescription}
            </p>
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

      <div className="flex w-full max-w-lg flex-col justify-center py-20 lg:pl-16 lg:pr-10">
        {eyebrow && (
          <p className="mb-4 text-sm uppercase tracking-[0.16em] text-[#6E6256]">
            {eyebrow}
          </p>
        )}
        {heading && (
          <h2 className="font-heading text-4xl leading-tight text-[#3B3333] md:text-5xl">
            {heading}
          </h2>
        )}
        <div className="mt-8 md:mt-10">{children}</div>
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
          type: "textarea",
          name: "cardDescription",
          label: "Card description",
          defaultValue:
            "Our team is here to help with any questions you may have.",
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
          name: "eyebrow",
          label: "FAQ eyebrow",
          defaultValue: "Customer care",
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
        href: "/policies/privacy-policy",
      },
      {
        type: "faq--item",
        contentType: "paragraph",
        question:
          "Products are imported automatically from your Shopify admin. We estimate 2-3 hours for set-up. If you want to change the design of Honey, we estimate 3-5 hours for set-up.",
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
