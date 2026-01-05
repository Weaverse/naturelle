import { Money, useMoney } from "@shopify/hydrogen";
import type { MoneyV2 } from "@shopify/hydrogen/storefront-api-types";
import type { ProductVariantFragmentFragment } from "storefront-api.generated";
import { cn } from "~/utils/cn";

function CompareAtPrice({
  data,
  className,
}: {
  data: MoneyV2;
  className?: string;
}) {
  const { currencyNarrowSymbol, withoutTrailingZerosAndCurrency } =
    useMoney(data);
  return (
    <span className={cn("strike text-[var(--color-compare-price-text)]", className)}>
      {currencyNarrowSymbol}
      {withoutTrailingZerosAndCurrency}
    </span>
  );
}

export function VariantPrices({
  variant,
  showCompareAtPrice = true,
  className,
}: {
  variant:
    | ProductVariantFragmentFragment
    | { price: Pick<MoneyV2, "amount" | "currencyCode"> };
  showCompareAtPrice?: boolean;
  className?: string;
}) {
  if (variant) {
    const { price } = variant;
    const compareAtPrice =
      "compareAtPrice" in variant ? variant.compareAtPrice : undefined;
    if (price) {
      return (
        <div className={cn("flex items-center gap-2", className)}>
          <Money withoutTrailingZeros data={price} />
          {showCompareAtPrice &&
            compareAtPrice &&
            compareAtPrice?.amount > price?.amount && (
              <CompareAtPrice data={compareAtPrice as MoneyV2} />
            )}
        </div>
      );
    }
  }
  return null;
}
