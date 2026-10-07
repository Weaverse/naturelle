import { useTranslation } from "@weaverse/hydrogen";
import { StarRating } from "~/components/star-rating";
import { useRootLoaderData } from "~/root";
import { DEFAULT_LOCALE } from "~/utils/const";
import { formatNumber } from "~/utils/locale";

type RatingValue = { value?: number | string };

export function parseProductRating(value?: string | null) {
  if (!value) {
    return 0;
  }

  try {
    const parsed = JSON.parse(value) as RatingValue | number | string;
    const rawValue =
      typeof parsed === "object" && parsed !== null ? parsed.value : parsed;
    const rating = Number(rawValue);
    return Number.isFinite(rating) ? Math.min(5, Math.max(0, rating)) : 0;
  } catch {
    const rating = Number(value);
    return Number.isFinite(rating) ? Math.min(5, Math.max(0, rating)) : 0;
  }
}

export function ProductCardRating({
  ratingValue,
  ratingCountValue,
  rating: ratingOverride,
  ratingCount: ratingCountOverride,
  detailed = false,
}: {
  ratingValue?: string | null;
  ratingCountValue?: string | null;
  rating?: number;
  ratingCount?: number;
  detailed?: boolean;
}) {
  const { t } = useTranslation();
  const locale = useRootLoaderData()?.selectedLocale ?? DEFAULT_LOCALE;
  const rating = ratingOverride ?? parseProductRating(ratingValue);
  const parsedRatingCount = Number(ratingCountValue);
  const ratingCount =
    ratingCountOverride ??
    (Number.isFinite(parsedRatingCount) ? Math.max(0, parsedRatingCount) : 0);

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <StarRating rating={rating} className="h-3.5 [&>svg]:size-3.5" />
      <span className="inline-flex items-center gap-1">
        <span className="font-body text-[13px] font-semibold leading-normal text-text">
          {detailed ? `${rating.toFixed(1)}/5.0` : rating.toFixed(1)}
        </span>
        <span className="font-body text-[13px] font-normal leading-normal text-text-subtle">
          (
          {ratingCount === 1
            ? t("reviews.count", { count: formatNumber(ratingCount, locale) })
            : t("reviews.count_other", {
                count: formatNumber(ratingCount, locale),
              })}
          )
        </span>
      </span>
    </div>
  );
}
