import { StarRating } from "~/components/star-rating";

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
}: {
  ratingValue?: string | null;
  ratingCountValue?: string | null;
  rating?: number;
  ratingCount?: number;
}) {
  const rating = ratingOverride ?? parseProductRating(ratingValue);
  const parsedRatingCount = Number(ratingCountValue);
  const ratingCount =
    ratingCountOverride ??
    (Number.isFinite(parsedRatingCount) ? Math.max(0, parsedRatingCount) : 0);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <StarRating rating={rating} />
      <span className="text-xs text-[#3B3333]">
        {rating.toFixed(1)} ({ratingCount})
      </span>
    </div>
  );
}
