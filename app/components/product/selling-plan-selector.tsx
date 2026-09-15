import { Money } from "@shopify/hydrogen";
import clsx from "clsx";
import type { SellingPlanGroupFragment } from "storefront-api.generated";
import { getSellingPlanDiscount } from "~/utils/selling-plan";

export function SellingPlanSelector({
  sellingPlanGroups,
  selectedSellingPlanId,
  onChange,
  disabled = false,
}: {
  sellingPlanGroups?: { nodes: SellingPlanGroupFragment[] };
  selectedSellingPlanId: string | null;
  onChange: (sellingPlanId: string | null) => void;
  disabled?: boolean;
}) {
  const groups =
    sellingPlanGroups?.nodes.filter(
      (group) => group.sellingPlans.nodes.length > 0,
    ) ?? [];

  if (groups.length === 0) {
    return null;
  }

  return (
    <fieldset className="space-y-3" disabled={disabled}>
      <legend className="mb-3 font-semibold text-sm">Purchase option</legend>
      <label
        className={clsx(
          "flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition-colors",
          selectedSellingPlanId
            ? "border-border-subtle"
            : "border-border bg-background-subtle-1",
        )}
      >
        <input
          type="radio"
          name="selling_plan"
          checked={!selectedSellingPlanId}
          onChange={() => onChange(null)}
        />
        <span className="font-medium text-sm">One-time purchase</span>
      </label>

      {groups.map((group) => (
        <div key={group.name} className="space-y-2">
          {group.sellingPlans.nodes.map((sellingPlan) => {
            const discount = getSellingPlanDiscount(sellingPlan);
            const adjustment = sellingPlan.priceAdjustments[0]?.adjustmentValue;
            return (
              <label
                key={sellingPlan.id}
                className={clsx(
                  "flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors",
                  selectedSellingPlanId === sellingPlan.id
                    ? "border-border bg-background-subtle-1"
                    : "border-border-subtle",
                )}
              >
                <input
                  type="radio"
                  name="selling_plan"
                  value={sellingPlan.id}
                  checked={selectedSellingPlanId === sellingPlan.id}
                  onChange={() => onChange(sellingPlan.id)}
                  className="mt-0.5"
                />
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-medium text-sm">
                      {sellingPlan.name}
                    </span>
                    {discount && (
                      <span className="rounded-full bg-background-subtle-2 px-2.5 py-1 font-semibold text-xs">
                        {adjustment && "adjustmentAmount" in adjustment ? (
                          <>
                            Save <Money data={adjustment.adjustmentAmount} />
                          </>
                        ) : (
                          discount
                        )}
                      </span>
                    )}
                  </span>
                  {sellingPlan.description && (
                    <span className="mt-1 block text-text-subtle text-xs">
                      {sellingPlan.description}
                    </span>
                  )}
                </span>
              </label>
            );
          })}
        </div>
      ))}
    </fieldset>
  );
}
