import { createSchema, type HydrogenComponentProps } from "@weaverse/hydrogen";
import { Clock, Droplet, type LucideIcon, Sparkles } from "lucide-react";
import type { Ref } from "react";
import { cn } from "~/utils/cn";
import { ProductMetafieldEmptyState } from "./metafield-empty-state";
import {
  getProductDetailField,
  loadProductDetailMetafield,
  PRODUCT_DETAIL_METAFIELDS,
} from "./product-metafield";

interface IngredientsData {
  heading: string;
  description: string;
  metafield?: string;
}

type IngredientsLoaderData = Awaited<
  ReturnType<typeof loadProductDetailMetafield>
>;
type IngredientsProps = HydrogenComponentProps<IngredientsLoaderData> &
  IngredientsData;

export default function KeyIngredients({
  ref,
  heading,
  description,
  metafield,
  loaderData,
  className,
  ...rest
}: IngredientsProps & { ref?: Ref<HTMLElement> }) {
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

  const icons: LucideIcon[] = [Sparkles, Clock, Droplet];
  const ingredients = loaderData.entries
    .slice(0, icons.length)
    .map((entry, index) => ({
      id: entry.id,
      Icon: icons[index],
      title: getProductDetailField(entry, "title"),
      copy: getProductDetailField(entry, "content"),
    }))
    .filter((ingredient) => ingredient.title && ingredient.copy);

  if (!ingredients.length) {
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
      data-product-metafield-section
      className={cn("flex flex-col gap-10", className)}
    >
      <header className="flex max-w-[600px] flex-col gap-3">
        <h2 className="font-display text-[32px] leading-[normal] font-normal tracking-normal text-text">
          {heading}
        </h2>
        <p className="font-body text-[16px] leading-[160%] font-normal text-(--product-detail-text-color)">
          {description}
        </p>
      </header>
      <div className="mx-auto flex w-full flex-col gap-6 md:flex-row">
        {ingredients.map(({ id, Icon, title, copy }) => (
          <article
            key={id}
            className="flex w-full flex-[1_0_0] flex-col gap-4 rounded-2xl border border-border-subtle p-6"
          >
            <span className="flex size-12 items-center justify-center rounded-full bg-(--product-detail-background-color)">
              <Icon aria-hidden="true" className="size-6" strokeWidth={1.5} />
            </span>
            <div className="flex flex-col gap-2">
              <p className="font-body text-[18px] leading-[normal] font-semibold text-text">
                {title}
              </p>
              <p className="font-body text-[14px] leading-[150%] font-normal text-(--product-detail-text-color)">
                {copy}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export const loader = loadProductDetailMetafield;

export const schema = createSchema({
  type: "product-details--ingredients",
  title: "Key ingredients",
  limit: 1,
  settings: [
    {
      group: "Content",
      inputs: [
        {
          type: "text",
          name: "heading",
          label: "Heading",
          defaultValue: "Key Ingredients",
        },
        {
          type: "textarea",
          name: "description",
          label: "Description",
          defaultValue:
            "A potent blend of clinical actives and botanical extracts designed to restore youthful vitality.",
        },
        {
          type: "text",
          name: "metafield",
          label: "Product metafield",
          defaultValue: PRODUCT_DETAIL_METAFIELDS.ingredients,
          placeholder: PRODUCT_DETAIL_METAFIELDS.ingredients,
          shouldRevalidate: true,
          helpText:
            "Use a list of metaobjects with <strong>title</strong> and <strong>content</strong> fields.",
        },
      ],
    },
  ],
});
