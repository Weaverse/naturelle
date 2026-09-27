import { createSchema, type HydrogenComponentProps } from "@weaverse/hydrogen";
import type { Ref } from "react";
import { ProductMetafieldEmptyState } from "./metafield-empty-state";
import {
  getProductDetailField,
  loadProductDetailMetafield,
  PRODUCT_DETAIL_METAFIELDS,
} from "./product-metafield";

interface HowToUseData {
  heading: string;
  metafield?: string;
}

type HowToUseLoaderData = Awaited<
  ReturnType<typeof loadProductDetailMetafield>
>;
type HowToUseProps = HydrogenComponentProps<HowToUseLoaderData> & HowToUseData;

export default function HowToUse({
  ref,
  heading,
  metafield,
  loaderData,
  ...rest
}: HowToUseProps & { ref?: Ref<HTMLElement> }) {
  if (!loaderData?.entries.length) {
    return (
      <ProductMetafieldEmptyState
        ref={ref}
        {...rest}
        loaderData={loaderData}
        metafield={metafield}
      />
    );
  }

  const steps = loaderData.entries
    .slice(0, 3)
    .map((entry) => ({
      id: entry.id,
      content:
        getProductDetailField(entry, "content") ||
        getProductDetailField(entry, "title"),
    }))
    .filter((step) => step.content);

  if (!steps.length) {
    return (
      <ProductMetafieldEmptyState
        ref={ref}
        {...rest}
        loaderData={loaderData}
        metafield={metafield}
        message="This metafield must contain text entries."
      />
    );
  }

  return (
    <section ref={ref} {...rest}>
      <div className="rounded-xl bg-(--product-detail-background-color) p-12 gap-10 flex flex-col">
        <h2 className="text-3xl leading-tight md:text-4xl">{heading}</h2>
        <ol className="flex flex-col gap-8">
          {steps.map((step, index) => (
            <li
              key={step.id}
              className="grid grid-cols-[1.5rem_1fr] gap-6 text-sm leading-6"
            >
              <span className="font-semibold">{index + 1}</span>
              <span className="text-(--product-detail-text-color)">
                {step.content}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export const loader = loadProductDetailMetafield;

export const schema = createSchema({
  type: "product-details--how-to-use",
  title: "How to use",
  limit: 1,
  settings: [
    {
      group: "Content",
      inputs: [
        {
          type: "text",
          name: "heading",
          label: "Heading",
          defaultValue: "How to Use",
        },
        {
          type: "text",
          name: "metafield",
          label: "Product metafield",
          defaultValue: PRODUCT_DETAIL_METAFIELDS.howToUse,
          placeholder: PRODUCT_DETAIL_METAFIELDS.howToUse,
          shouldRevalidate: true,
          helpText:
            "Use text, rich text, or a list of metaobjects with a <strong>content</strong> field.",
        },
      ],
    },
  ],
});
