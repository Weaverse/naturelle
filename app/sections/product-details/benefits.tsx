import {
  CheckCircle,
  Drop,
  Leaf,
  type Icon as PhosphorIcon,
  Shield,
} from "@phosphor-icons/react";
import { createSchema, type HydrogenComponentProps } from "@weaverse/hydrogen";
import type { Ref } from "react";
import { cn } from "~/utils/cn";
import { ProductMetafieldEmptyState } from "./metafield-empty-state";
import {
  createMetafieldInput,
  getProductDetailField,
  loadProductDetailMetafield,
  PRODUCT_DETAIL_METAFIELDS,
} from "./product-metafield";
import { useProductMetafieldData } from "./use-product-metafield-data";

interface BenefitsData {
  heading: string;
  description: string;
  metafield?: string;
}

type BenefitsLoaderData = Awaited<
  ReturnType<typeof loadProductDetailMetafield>
>;
type BenefitsProps = HydrogenComponentProps<BenefitsLoaderData> & BenefitsData;

export default function ProductBenefits({
  ref,
  heading,
  description,
  metafield,
  loaderData,
  className,
  ...rest
}: BenefitsProps & { ref?: Ref<HTMLElement> }) {
  loaderData = useProductMetafieldData(metafield, loaderData);

  if (!loaderData?.entries.length) {
    return (
      <ProductMetafieldEmptyState
        ref={ref}
        {...rest}
        className={className}
        loaderData={loaderData}
        metafield={metafield}
      />
    );
  }

  const icons: PhosphorIcon[] = [Drop, Shield, Leaf, CheckCircle];
  const benefits = loaderData.entries
    .slice(0, icons.length)
    .map((entry, index) => ({
      id: entry.id,
      Icon: icons[index],
      title: getProductDetailField(entry, "title"),
      copy: getProductDetailField(entry, "content"),
    }))
    .filter((benefit) => benefit.title && benefit.copy);

  if (!benefits.length) {
    return (
      <ProductMetafieldEmptyState
        ref={ref}
        {...rest}
        className={className}
        loaderData={loaderData}
        metafield={metafield}
        message="This metafield must contain title and content fields."
      />
    );
  }

  return (
    <section
      ref={ref}
      {...rest}
      className={cn("flex flex-col gap-6", className)}
    >
      <header className="flex flex-col items-start gap-3 self-stretch">
        <h2 className="font-display text-[40px] leading-[normal] font-normal tracking-normal text-text">
          {heading}
        </h2>
        <p className="font-body text-[18px] leading-[160%] font-normal text-(--product-detail-text-color)">
          {description}
        </p>
      </header>
      <div className="mx-auto flex w-full flex-col gap-4 md:flex-row">
        {benefits.map(({ id, Icon, title, copy }) => (
          <article
            key={id}
            className="flex w-full flex-[1_0_0] flex-col items-center gap-3 rounded-xl bg-(--product-detail-background-color) p-6 text-center"
          >
            <Icon aria-hidden="true" className="size-6" weight="regular" />
            <p className="font-body text-sm leading-[normal] font-semibold text-text">
              {title}
            </p>
            <p className="font-body text-xs leading-[normal] font-normal text-(--product-detail-text-color)">
              {copy}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

export const loader = loadProductDetailMetafield;

export const schema = createSchema({
  type: "product-details--benefits",
  title: "Benefits",
  limit: 1,
  settings: [
    {
      group: "Content",
      inputs: [
        {
          type: "text",
          name: "heading",
          label: "Heading",
          defaultValue: "Product Benefits",
        },
        {
          type: "textarea",
          name: "description",
          label: "Description",
          defaultValue:
            "Explore the key features and benefits of this product.",
        },
        createMetafieldInput(PRODUCT_DETAIL_METAFIELDS.benefits),
      ],
    },
  ],
});
