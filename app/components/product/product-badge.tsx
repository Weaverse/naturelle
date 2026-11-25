import type { MoneyV2 } from "@shopify/hydrogen/storefront-api-types";
import clsx from "clsx";
import { getSavingsPercentage, isNewArrival } from "~/utils/product";

export type ProductBadgeType = "save" | "new" | "sold-out";

export type ProductBadgeSettings = {
  saveBadgeText?: string;
  newBadgeText?: string;
  newBadgeDaysOld?: number;
  soldOutBadgeText?: string;
};

export function getProductBadge({
  variant,
  publishedAt,
  customBadge,
  settings,
}: {
  variant:
    | {
        availableForSale: boolean;
        price: MoneyV2;
        compareAtPrice?: MoneyV2 | null;
      }
    | null
    | undefined;
  publishedAt?: string | null;
  customBadge?: string;
  settings: ProductBadgeSettings;
}): { text: string; type: ProductBadgeType } | null {
  if (!variant) {
    return null;
  }

  const {
    saveBadgeText = "Save [percentage]%",
    newBadgeText = "New arrival",
    newBadgeDaysOld = 30,
    soldOutBadgeText = "Out of stock",
  } = settings;
  const savingsPercentage = getSavingsPercentage(
    variant.price,
    variant.compareAtPrice as MoneyV2,
  );

  if (!variant.availableForSale) {
    return { text: customBadge || soldOutBadgeText, type: "sold-out" };
  }
  if (savingsPercentage) {
    return {
      text:
        customBadge ||
        saveBadgeText.replace("[percentage]", String(savingsPercentage)),
      type: "save",
    };
  }
  if (publishedAt && isNewArrival(publishedAt, newBadgeDaysOld)) {
    return { text: customBadge || newBadgeText, type: "new" };
  }
  if (customBadge) {
    return { text: customBadge, type: "new" };
  }
  return null;
}

const backgroundColors: Record<ProductBadgeType, string> = {
  save: "var(--color-label-bg-save)",
  new: "var(--color-label-bg-new)",
  "sold-out": "var(--color-label-bg-soldout)",
};

export function ProductBadge({
  text,
  type,
  className,
}: {
  text: string;
  type: ProductBadgeType;
  className?: string;
}) {
  return (
    <span
      className={clsx(
        "pointer-events-none rounded-full px-3 py-1.5 text-xs leading-none text-text-inverse",
        className,
      )}
      style={{
        backgroundColor: backgroundColors[type],
      }}
    >
      {text}
    </span>
  );
}
