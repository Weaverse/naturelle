import { createSchema, type HydrogenComponentProps } from "@weaverse/hydrogen";
import { ArrowRight } from "lucide-react";
import type { RefObject } from "react";
import { Link } from "~/components/link";

interface FaqItemProps extends HydrogenComponentProps {
  contentType?: "question" | "paragraph";
  question?: string;
  href?: string;
}

export default function FaqItem({
  ref,
  contentType = "question",
  question = "What is your privacy policy?",
  href = "/policies/privacy-policy",
  ...rest
}: FaqItemProps & { ref?: RefObject<HTMLDivElement | null> }) {
  return (
    <div ref={ref} {...rest}>
      {contentType === "paragraph" ? (
        <p className="py-2 text-sm leading-6 text-[#5E5E5E] md:text-base md:leading-7">
          {question}
        </p>
      ) : (
        <Link
          to={href || "/policies/privacy-policy"}
          prefetch="intent"
          className="group flex min-h-16 w-full items-center justify-between gap-6 py-5 text-left text-base text-[#3B3333] transition-colors hover:text-black md:min-h-20 md:py-6 md:text-lg"
        >
          <span>{question}</span>
          <ArrowRight
            aria-hidden="true"
            className="size-4 shrink-0 text-[#5E5E5E] transition-transform duration-300 group-hover:translate-x-1"
            strokeWidth={1.5}
          />
        </Link>
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
          type: "select",
          name: "contentType",
          label: "Content type",
          configs: {
            options: [
              { label: "Question", value: "question" },
              { label: "Paragraph", value: "paragraph" },
            ],
          },
          defaultValue: "question",
        },
        {
          type: "textarea",
          name: "question",
          label: "Text",
          defaultValue: "What is your privacy policy?",
        },
        {
          type: "url",
          name: "href",
          label: "Link",
          defaultValue: "/policies/privacy-policy",
          placeholder: "/policies/privacy-policy",
          condition: "contentType.eq.question",
        },
      ],
    },
  ],
});
