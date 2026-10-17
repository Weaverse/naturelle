import * as Accordion from "@radix-ui/react-accordion";
import { createSchema, type HydrogenComponentProps } from "@weaverse/hydrogen";
import type { RefObject } from "react";
import { IconCaret } from "~/components/icon";
import { Link } from "~/components/link";

interface FaqItemProps extends HydrogenComponentProps {
  question?: string;
  paragraph?: string;
  href?: string;
}

export default function FaqItem({
  ref,
  question,
  paragraph,
  href,
  ...rest
}: FaqItemProps & { ref?: RefObject<HTMLDivElement | null> }) {
  const hasParagraph = Boolean(paragraph?.trim());
  const hasLegacyLink = Boolean(href?.trim());

  return (
    <Accordion.Item
      ref={ref}
      {...rest}
      value={rest["data-wv-id"] ?? question ?? "faq-item"}
      className="flex flex-col gap-1"
    >
      {question &&
        (hasParagraph ? (
          <Accordion.Header className="contents">
            <Accordion.Trigger className="group flex w-full items-center justify-between gap-6 py-2 text-left text-base text-text transition-opacity hover:opacity-70 md:text-lg">
              <span className="font-heading text-xl leading-[160%] tracking-[-0.2px]">
                {question}
              </span>
              <IconCaret
                aria-hidden="true"
                className="size-4 shrink-0 text-text transition-transform duration-300 group-data-[state=open]:rotate-90"
                direction="right"
              />
            </Accordion.Trigger>
          </Accordion.Header>
        ) : hasLegacyLink ? (
          <Link
            to={href as string}
            prefetch="intent"
            className="group flex w-full items-center justify-between gap-6 py-2 text-left text-base text-text transition-opacity hover:opacity-70 md:text-lg"
          >
            <span className="font-heading text-xl leading-[160%] tracking-[-0.2px]">
              {question}
            </span>
            <IconCaret
              aria-hidden="true"
              className="size-4 shrink-0 text-text transition-transform duration-300 group-hover:translate-x-1"
              direction="right"
            />
          </Link>
        ) : (
          <p className="py-2 font-heading text-xl leading-[160%] tracking-[-0.2px] text-text">
            {question}
          </p>
        ))}
      {hasParagraph && (
        <Accordion.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
          <p className="py-2 font-body text-sm leading-[160%] font-normal tracking-[-0.14px] text-text">
            {paragraph}
          </p>
        </Accordion.Content>
      )}
    </Accordion.Item>
  );
}

export const schema = createSchema({
  type: "faq--item",
  title: "FAQ item",
  settings: [
    {
      group: "Content",
      inputs: [
        {
          type: "textarea",
          name: "question",
          label: "Question",
          defaultValue: "What is your privacy policy?",
        },
        {
          type: "textarea",
          name: "paragraph",
          label: "Paragraph",
          defaultValue:
            "Products are imported automatically from your Shopify admin.",
        },
      ],
    },
  ],
});
