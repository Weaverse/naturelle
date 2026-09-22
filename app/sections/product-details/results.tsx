import { createSchema, type HydrogenComponentProps } from "@weaverse/hydrogen";
import type { Ref } from "react";
import { ProductMetafieldEmptyState } from "./metafield-empty-state";
import {
  createMetafieldInput,
  getProductDetailField,
  loadProductDetailMetafield,
  PRODUCT_DETAIL_METAFIELDS,
} from "./product-metafield";
import { useProductMetafieldData } from "./use-product-metafield-data";

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
  loaderData = useProductMetafieldData(metafield, loaderData);

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
    <section ref={ref} {...rest}>
      <div className="grid overflow-hidden rounded-xl bg-text md:grid-cols-3">
        {results.map((result) => (
          <article
            key={result.id}
            className="px-6 py-8 text-center md:border-l md:border-background-basic/15 md:first:border-l-0"
          >
            <p className="text-center font-display text-[48px] leading-[normal] font-normal text-background-basic">
              {result.value}
            </p>
            <p className="mt-2 text-xs font-semibold text-background-basic uppercase">
              {result.label}
            </p>
            <p className="mt-1 text-[10px] text-background-basic">
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
      inputs: [createMetafieldInput(PRODUCT_DETAIL_METAFIELDS.results)],
    },
  ],
});
