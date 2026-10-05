import { useTranslation } from "@weaverse/hydrogen";
import { useRootLoaderData } from "~/root";
import { cn } from "~/utils/cn";
import { DEFAULT_LOCALE } from "~/utils/const";
import { formatNumber } from "~/utils/locale";

interface LowStockIndicatorProps {
  availableForSale: boolean;
  stock?: number | null;
  threshold?: number | string | null;
  progressColor?: string;
  className?: string;
  messageClassName?: string;
}

export function LowStockIndicator({
  availableForSale,
  stock,
  threshold,
  progressColor,
  className,
  messageClassName,
}: LowStockIndicatorProps) {
  const { t } = useTranslation();
  const locale = useRootLoaderData()?.selectedLocale ?? DEFAULT_LOCALE;
  const configuredThreshold = Number(threshold);
  const lowStockThreshold = Number.isFinite(configuredThreshold)
    ? Math.min(20, Math.max(0, configuredThreshold))
    : 5;
  const stockValue = typeof stock === "number" ? stock : 0;
  const showLowStock =
    availableForSale && stockValue > 0 && stockValue <= lowStockThreshold;

  if (!showLowStock) {
    return null;
  }

  const lowStockPercentage =
    lowStockThreshold > 0
      ? Math.min(100, (stockValue / lowStockThreshold) * 100)
      : 0;

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <p className={cn("text-base font-semibold", messageClassName)}>
        {stockValue === 1
          ? t("product.lowStockOne", {
              count: formatNumber(stockValue, locale),
            })
          : t("product.lowStock", {
              count: formatNumber(stockValue, locale),
            })}
      </p>
      <div
        role="progressbar"
        aria-label={t("product.lowStockThreshold", {
          count: lowStockThreshold,
        })}
        aria-valuemin={0}
        aria-valuemax={lowStockThreshold}
        aria-valuenow={stockValue}
        className="relative h-1 w-full overflow-hidden rounded-full bg-border-subtle"
      >
        <div
          className="h-full w-full origin-left rounded-full transition-[transform,background-color]"
          style={{
            backgroundColor: progressColor,
            transform: `scaleX(${lowStockPercentage / 100})`,
          }}
        />
      </div>
    </div>
  );
}
