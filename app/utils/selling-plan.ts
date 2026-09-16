import type { MoneyV2 } from "@shopify/hydrogen/storefront-api-types";
import type { SellingPlanGroupFragment } from "storefront-api.generated";

export type SellingPlan =
  SellingPlanGroupFragment["sellingPlans"]["nodes"][number];

export function getSellingPlans(sellingPlanGroups?: {
  nodes: SellingPlanGroupFragment[];
}): SellingPlan[] {
  return (
    sellingPlanGroups?.nodes.flatMap((group) => group.sellingPlans.nodes) ?? []
  );
}

export function getSellingPlan(
  sellingPlanGroups: { nodes: SellingPlanGroupFragment[] } | undefined,
  sellingPlanId: string | null,
) {
  if (!sellingPlanId) {
    return null;
  }
  return (
    getSellingPlans(sellingPlanGroups).find(
      (sellingPlan) => sellingPlan.id === sellingPlanId,
    ) ?? null
  );
}

export function getSelectedSellingPlan(
  sellingPlanGroups: { nodes: SellingPlanGroupFragment[] } | undefined,
  requestedSellingPlanId: string | null,
  requiresSellingPlan = false,
) {
  return (
    getSellingPlan(sellingPlanGroups, requestedSellingPlanId) ??
    (requiresSellingPlan ? getSellingPlans(sellingPlanGroups)[0] : null) ??
    null
  );
}

export function getSellingPlanDiscount(sellingPlan: SellingPlan) {
  const adjustment = sellingPlan.priceAdjustments[0]?.adjustmentValue;
  if (!adjustment) {
    return null;
  }
  if ("adjustmentPercentage" in adjustment) {
    return `Save ${adjustment.adjustmentPercentage}%`;
  }
  if ("adjustmentAmount" in adjustment) {
    return `Save ${adjustment.adjustmentAmount.currencyCode} ${adjustment.adjustmentAmount.amount}`;
  }
  return null;
}

export function calculateSellingPlanPrice(
  price: Pick<MoneyV2, "amount" | "currencyCode">,
  sellingPlan: SellingPlan | null,
): Pick<MoneyV2, "amount" | "currencyCode"> {
  const adjustment = sellingPlan?.priceAdjustments[0]?.adjustmentValue;
  if (!adjustment) {
    return price;
  }
  if ("price" in adjustment) {
    return adjustment.price;
  }
  if ("adjustmentAmount" in adjustment) {
    return {
      amount: String(
        Math.max(
          0,
          Number(price.amount) - Number(adjustment.adjustmentAmount.amount),
        ),
      ),
      currencyCode: price.currencyCode,
    };
  }
  if ("adjustmentPercentage" in adjustment) {
    return {
      amount: String(
        Number(price.amount) * (1 - adjustment.adjustmentPercentage / 100),
      ),
      currencyCode: price.currencyCode,
    };
  }
  return price;
}
