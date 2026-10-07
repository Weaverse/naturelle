import { Money } from "@shopify/hydrogen";
import type { CartCost } from "@shopify/hydrogen/storefront-api-types";
import { useThemeSettings, useTranslation } from "@weaverse/hydrogen";
import { cn } from "~/utils/cn";

interface FreeShippingProgressBarProps {
  cost: CartCost;
  className?: string;
}

export function FreeShippingProgressBar({
  cost,
  className,
}: FreeShippingProgressBarProps) {
  const { t } = useTranslation();
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
      ? t("cart.freeShippingUnlocked")
      : t("cart.freeShippingRemaining", { amount: "{{amount}}" }));

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="relative h-1 w-full overflow-hidden rounded-lg bg-background-subtle-2">
        <div
          className="absolute inset-y-0 left-0 rounded-lg bg-border transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="font-body text-sm leading-[160%] font-normal tracking-[-0.14px] text-text-subtle">
        {hasReachedFreeShipping ? (
          message
        ) : (
          <>
            {message.split("{{amount}}")[0]}
            <span className="inline-block font-medium text-text-primary">
              <Money
                data={{ amount: String(remaining), currencyCode }}
                withoutTrailingZeros
                as="span"
              />
            </span>
            {message.split("{{amount}}")[1]}
          </>
        )}
      </p>
    </div>
  );
}
