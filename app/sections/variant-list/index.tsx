import { createSchema } from "@weaverse/hydrogen";
import type { RefObject } from "react";
import { useState } from "react";
import { useLoaderData } from "react-router";
import type { ProductVariantFragmentFragment } from "storefront-api.generated";
import { Image } from "~/components/image";
import { AddToCartButton } from "~/components/product/add-to-cart-button";
import { PurchaseMethodDropdown } from "~/components/product/purchase-method-dropdown";
import { SellingPlanPrice } from "~/components/product/selling-plan-price";
import { ProductQuantityInput } from "~/components/product-form/pdp-form";
import { layoutInputs, Section, type SectionProps } from "~/components/section";
import type { ProductLoaderType } from "~/routes/($locale).products.$handle";
import { getSelectedSellingPlan } from "~/utils/selling-plan";

function VariantRow({
  variant,
  sellingPlanGroups,
  requiresSellingPlan,
}: {
  variant: ProductVariantFragmentFragment;
  sellingPlanGroups: NonNullable<
    ReturnType<typeof useLoaderData<ProductLoaderType>>["product"]
  >["sellingPlanGroups"];
  requiresSellingPlan: boolean;
}) {
  const [quantity, setQuantity] = useState(1);
  const [requestedSellingPlanId, setRequestedSellingPlanId] = useState<
    string | null
  >(null);
  const selectedSellingPlan = getSelectedSellingPlan(
    sellingPlanGroups,
    requestedSellingPlanId,
    requiresSellingPlan,
  );
  const selectedSellingPlanId = selectedSellingPlan?.id ?? null;

  return (
    <li className="grid items-center gap-4 border-border-subtle border-b py-5 md:grid-cols-[minmax(0,1fr)_minmax(12rem,0.7fr)_auto_auto]">
      <div className="flex min-w-0 items-center gap-4">
        {variant.image && (
          <Image
            data={variant.image}
            sizes="72px"
            className="size-18 shrink-0 rounded-lg object-cover"
          />
        )}
        <div className="min-w-0">
          <p className="font-medium">{variant.title}</p>
          {variant.sku && (
            <p className="text-text-subtle text-xs">SKU: {variant.sku}</p>
          )}
          <p className="mt-1 text-text-subtle text-xs">
            {variant.availableForSale ? "In stock" : "Out of stock"}
          </p>
        </div>
      </div>

      <PurchaseMethodDropdown
        sellingPlanGroups={sellingPlanGroups}
        selectedSellingPlanId={selectedSellingPlanId}
        onChange={setRequestedSellingPlanId}
        requiresSellingPlan={requiresSellingPlan}
        disabled={!variant.availableForSale}
      />

      <ProductQuantityInput
        value={quantity}
        disabled={!variant.availableForSale}
        onChange={setQuantity}
        className="w-fit"
      />

      <div className="flex min-w-32 flex-col items-stretch gap-2 md:items-end">
        <SellingPlanPrice
          price={variant.price}
          sellingPlan={selectedSellingPlan}
          className="font-medium"
        />
        <AddToCartButton
          disabled={
            !variant.availableForSale ||
            (requiresSellingPlan && !selectedSellingPlanId)
          }
          lines={[
            {
              merchandiseId: variant.id,
              quantity,
              selectedVariant: variant,
              sellingPlanId: selectedSellingPlanId || undefined,
            },
          ]}
          className="h-10 rounded-lg px-4 py-2 text-sm"
        >
          Add to cart
        </AddToCartButton>
      </div>
    </li>
  );
}

export default function VariantList({
  ref,
  ...props
}: SectionProps & { ref?: RefObject<HTMLElement | null> }) {
  const { product, variants } = useLoaderData<ProductLoaderType>();
  const variantNodes = variants.product?.variants.nodes ?? [];

  if (!product || variantNodes.length === 0) {
    return null;
  }

  return (
    <Section ref={ref} {...props}>
      <div className="mb-6">
        <h2 className="font-heading text-3xl">Select variants</h2>
        <p className="mt-2 text-text-subtle text-sm">
          Choose a purchase option and quantity for each variant.
        </p>
      </div>
      <ul className="border-border-subtle border-t">
        {variantNodes.map((variant) => (
          <VariantRow
            key={variant.id}
            variant={variant}
            sellingPlanGroups={product.sellingPlanGroups}
            requiresSellingPlan={product.requiresSellingPlan}
          />
        ))}
      </ul>
    </Section>
  );
}

export const schema = createSchema({
  type: "variant-list",
  title: "Variant list",
  enabledOn: { pages: ["PRODUCT"] },
  settings: [
    {
      group: "Layout",
      inputs: layoutInputs,
    },
  ],
  presets: {},
});
