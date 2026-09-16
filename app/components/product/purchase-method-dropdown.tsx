import { CaretDownIcon } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";
import type { SellingPlanGroupFragment } from "storefront-api.generated";
import { cn } from "~/utils/cn";
import { getSellingPlans } from "~/utils/selling-plan";

export function PurchaseMethodDropdown({
  sellingPlanGroups,
  selectedSellingPlanId,
  onChange,
  requiresSellingPlan = false,
  disabled = false,
}: {
  sellingPlanGroups?: { nodes: SellingPlanGroupFragment[] };
  selectedSellingPlanId: string | null;
  onChange: (sellingPlanId: string | null) => void;
  requiresSellingPlan?: boolean;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const sellingPlans = getSellingPlans(sellingPlanGroups);
  const selectedSellingPlan = sellingPlans.find(
    (sellingPlan) => sellingPlan.id === selectedSellingPlanId,
  );

  useEffect(() => {
    if (!open) {
      return;
    }
    function closeOnOutsideClick(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", closeOnOutsideClick);
    return () => document.removeEventListener("mousedown", closeOnOutsideClick);
  }, [open]);

  if (sellingPlans.length === 0) {
    return <span className="text-text-subtle text-sm">One-time purchase</span>;
  }

  function select(sellingPlanId: string | null) {
    onChange(sellingPlanId);
    setOpen(false);
  }

  return (
    <div ref={containerRef} className="relative min-w-48">
      <button
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className="flex h-11 w-full items-center justify-between gap-3 rounded-lg border border-border-subtle px-3 text-left text-sm disabled:opacity-50"
      >
        <span className="truncate">
          {selectedSellingPlan?.name ?? "One-time purchase"}
        </span>
        <CaretDownIcon
          className={cn("size-4 shrink-0 transition", open && "rotate-180")}
        />
      </button>
      {open && (
        <div
          role="listbox"
          className="absolute z-30 mt-1 max-h-64 w-full overflow-y-auto rounded-lg border border-border-subtle bg-background-basic p-1 shadow-lg"
        >
          {!requiresSellingPlan && (
            <div>
              <button
                type="button"
                role="option"
                aria-selected={!selectedSellingPlanId}
                onClick={() => select(null)}
                className={cn(
                  "w-full rounded-md px-3 py-2.5 text-left text-sm",
                  !selectedSellingPlanId && "bg-background-subtle-1",
                )}
              >
                One-time purchase
              </button>
            </div>
          )}
          {sellingPlans.map((sellingPlan) => (
            <div key={sellingPlan.id}>
              <button
                type="button"
                role="option"
                aria-selected={sellingPlan.id === selectedSellingPlanId}
                onClick={() => select(sellingPlan.id)}
                className={cn(
                  "w-full rounded-md px-3 py-2.5 text-left text-sm",
                  sellingPlan.id === selectedSellingPlanId &&
                    "bg-background-subtle-1",
                )}
              >
                {sellingPlan.name}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
