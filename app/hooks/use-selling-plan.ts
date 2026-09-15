import { useSearchParams } from "react-router";
import type { SellingPlanGroupFragment } from "storefront-api.generated";
import { getSellingPlan } from "~/utils/selling-plan";

export function useSellingPlanSelection(sellingPlanGroups?: {
  nodes: SellingPlanGroupFragment[];
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedSellingPlanId = searchParams.get("selling_plan");
  const selectedSellingPlan = getSellingPlan(
    sellingPlanGroups,
    requestedSellingPlanId,
  );
  const selectedSellingPlanId = selectedSellingPlan?.id ?? null;

  function setSelectedSellingPlanId(sellingPlanId: string | null) {
    setSearchParams(
      (current) => {
        const next = new URLSearchParams(current);
        if (sellingPlanId) {
          next.set("selling_plan", sellingPlanId);
        } else {
          next.delete("selling_plan");
        }
        return next;
      },
      { replace: true, preventScrollReset: true },
    );
  }

  return {
    selectedSellingPlan,
    selectedSellingPlanId,
    setSelectedSellingPlanId,
  };
}
