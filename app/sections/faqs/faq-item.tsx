import { createSchema, type HydrogenComponentProps } from "@weaverse/hydrogen";
import { ArrowRight } from "lucide-react";
import type { RefObject } from "react";
import { Link } from "~/components/link";

interface FaqItemProps extends HydrogenComponentProps {
  question?: string;
  showParagraph?: boolean;
  paragraph?: string;
  href?: string;
}

export default function FaqItem({
  ref,
  question,
  showParagraph = false,
  paragraph,
  href,
  ...rest
}: FaqItemProps & { ref?: RefObject<HTMLDivElement | null> }) {
  const hasLink = Boolean(href?.trim());
  const showBody = Boolean(paragraph) && showParagraph;

  return (
    <div ref={ref} className="flex flex-col gap-1" {...rest}>
      {question &&
        (hasLink ? (
          <Link
            to={href as string}
            prefetch="intent"
            className="group flex min-h-16 w-full items-center justify-between gap-6 py-2 text-left text-base text-text transition-opacity hover:opacity-70 md:min-h-20 md:text-lg"
          >
            <span className="text-xl leading-[160%] tracking-[-0.2px]">
              {question}
            </span>
            <ArrowRight
              aria-hidden="true"
              className="size-4 shrink-0 text-text transition-transform duration-300 group-hover:translate-x-1"
              strokeWidth={1.5}
            />
          </Link>
        ) : (
          <p className="py-2 text-xl leading-[160%] tracking-[-0.2px] text-text">
            {question}
          </p>
        ))}
      {showBody && (
        <p className="py-2 font-body text-sm leading-[160%] font-normal tracking-[-0.14px] text-text">
          {paragraph}
        </p>
      )}
    </div>
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
          type: "switch",
          name: "showParagraph",
          label: "Show paragraph",
          defaultValue: false,
        },
        {
          type: "textarea",
          name: "paragraph",
          label: "Paragraph",
          defaultValue:
            "Products are imported automatically from your Shopify admin.",
          condition: "showParagraph.eq.true",
        },
        {
          type: "url",
          name: "href",
          label: "Link",
          placeholder: "/policies/privacy-policy",
        },
      ],
    },
  ],
});
