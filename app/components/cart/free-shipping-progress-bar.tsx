import { Money } from "@shopify/hydrogen";
import type { CartCost } from "@shopify/hydrogen/storefront-api-types";
import { useThemeSettings } from "@weaverse/hydrogen";
import { cn } from "~/utils/cn";

interface FreeShippingProgressBarProps {
  cost: CartCost;
  className?: string;
}

export function FreeShippingProgressBar({
  cost,
  className,
}: FreeShippingProgressBarProps) {
  const {
    enableFreeShippingProgressBar,
    freeShippingThreshold,
    freeShippingProgressMessage,
    freeShippingSuccessMessage,
  } = useThemeSettings();

  if (!(enableFreeShippingProgressBar && freeShippingThreshold)) {
    return null;
  }

  const subtotalAmount = Number(cost?.subtotalAmount?.amount || 0);
  const currencyCode = cost?.subtotalAmount?.currencyCode || "USD";
  const threshold = Number(freeShippingThreshold);
  const remaining = Math.max(0, threshold - subtotalAmount);
  const progress = Math.min(100, (subtotalAmount / threshold) * 100);
  const hasReachedFreeShipping = remaining <= 0;
  const message =
    (hasReachedFreeShipping
      ? freeShippingSuccessMessage
      : freeShippingProgressMessage) ||
    (hasReachedFreeShipping
      ? "Congratulations! You've got free shipping!"
      : "{{amount}} away from free shipping!");

  return (
    <div className={cn("space-y-2", className)}>
      <div className="relative h-[2px] w-full overflow-hidden rounded-full bg-border-subtle">
        <div
          className="absolute inset-y-0 left-0 bg-text-primary transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-sm text-text-subtle">
        {hasReachedFreeShipping ? (
          message
        ) : (
          <>
            {message.split("{{amount}}")[0]}
            <span className="inline-block font-medium text-text-primary">
              <Money
                data={{ amount: String(remaining), currencyCode }}
                withoutTrailingZeros
              />
            </span>
            {message.split("{{amount}}")[1]}
          </>
        )}
      </p>
    </div>
  );
}
