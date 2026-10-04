import { createSchema, type HydrogenComponentProps } from "@weaverse/hydrogen";
import type { Ref } from "react";
import { ProductMetafieldEmptyState } from "./metafield-empty-state";
import {
  getProductDetailField,
  loadProductDetailMetafield,
  PRODUCT_DETAIL_METAFIELDS,
} from "./product-metafield";

interface ResultsData {
  metafield?: string;
}

type ResultsLoaderData = Awaited<ReturnType<typeof loadProductDetailMetafield>>;
type ResultsProps = HydrogenComponentProps<ResultsLoaderData> & ResultsData;

export default function ClinicalResults({
  ref,
  metafield,
  loaderData,
  ...rest
}: ResultsProps & { ref?: Ref<HTMLElement> }) {
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

  const results = loaderData.entries
    .slice(0, 3)
    .map((entry) => {
      const rawValue = getProductDetailField(entry, "value");
      return {
        id: entry.id,
        value:
          entry.fieldTypes.value?.startsWith("number_") &&
          /^\d+(\.\d+)?$/.test(rawValue)
            ? `${rawValue}%`
            : rawValue,
        label: getProductDetailField(entry, "label"),
        note: getProductDetailField(entry, "note"),
      };
    })
    .filter((result) => result.value && result.label && result.note);

  if (!results.length) {
    return (
      <ProductMetafieldEmptyState
        ref={ref}
        {...rest}
        loaderData={loaderData}
        metafield={metafield}
        message="This metafield must contain value, label, and note fields."
      />
    );
  }

  return (
    <section ref={ref} {...rest} data-product-metafield-section>
      <div className="grid overflow-hidden rounded-3xl bg-text md:grid-cols-3">
        {results.map((result) => (
          <article
            key={result.id}
            className="flex flex-col items-center gap-2 px-6 py-8 text-center md:border-l md:border-background-basic/15 md:first:border-l-0"
          >
            <p className="text-center font-display text-[48px] leading-[normal] font-normal text-background-basic">
              {result.value}
            </p>
            <p className="font-body text-sm leading-[normal] font-semibold text-background-basic/80 uppercase">
              {result.label}
            </p>
            <p className="font-body text-xs leading-[normal] font-normal text-background-basic/60">
              {result.note}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

export const loader = loadProductDetailMetafield;

export const schema = createSchema({
  type: "product-details--results",
  title: "Clinical results",
  limit: 1,
  settings: [
    {
      group: "Results",
      inputs: [
        {
          type: "text",
          name: "metafield",
          label: "Product metafield",
          defaultValue: PRODUCT_DETAIL_METAFIELDS.results,
          placeholder: PRODUCT_DETAIL_METAFIELDS.results,
          shouldRevalidate: true,
          helpText:
            "Use a list of metaobjects with <strong>value</strong>, <strong>label</strong>, and <strong>note</strong> fields.",
        },
      ],
    },
  ],
});
