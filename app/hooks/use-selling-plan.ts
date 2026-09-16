import { useSearchParams } from "react-router";
import type { SellingPlanGroupFragment } from "storefront-api.generated";
import { getSelectedSellingPlan } from "~/utils/selling-plan";

export function useSellingPlanSelection(
  sellingPlanGroups?: { nodes: SellingPlanGroupFragment[] },
  requiresSellingPlan = false,
) {
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedSellingPlanId = searchParams.get("selling_plan");
  const selectedSellingPlan = getSelectedSellingPlan(
    sellingPlanGroups,
    requestedSellingPlanId,
    requiresSellingPlan,
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
