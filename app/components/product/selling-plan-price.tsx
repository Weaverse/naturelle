import { Money } from "@shopify/hydrogen";
import type { MoneyV2 } from "@shopify/hydrogen/storefront-api-types";
import type { SellingPlan } from "~/utils/selling-plan";
import { calculateSellingPlanPrice } from "~/utils/selling-plan";

export function SellingPlanPrice({
  price,
  sellingPlan,
  className,
}: {
  price: Pick<MoneyV2, "amount" | "currencyCode">;
  sellingPlan: SellingPlan | null;
  className?: string;
}) {
  const adjustedPrice = calculateSellingPlanPrice(price, sellingPlan);
  const hasDiscount = Number(adjustedPrice.amount) !== Number(price.amount);

  return (
    <span className={className}>
      <Money withoutTrailingZeros data={adjustedPrice} />
      {hasDiscount && (
        <Money
          withoutTrailingZeros
          data={price}
          className="ml-2 text-text-subtle text-sm line-through"
        />
      )}
    </span>
  );
}
