import {
  IconFilledStar,
  IconHalfFilledStar,
  IconStarReview,
} from "~/components/icon";
import { cn } from "~/utils/cn";

export function StarRating({
  rating,
  className,
}: {
  rating: number;
  className?: string;
}) {
  const normalizedRating = Number.isFinite(rating)
    ? Math.round(Math.min(5, Math.max(0, rating)) * 10) / 10
    : 0;

  return (
    <div className={cn("inline-flex h-4 gap-0.5 [&>svg]:size-4", className)}>
      {Array.from({ length: 5 }).map((_, index) => {
        if (normalizedRating >= index + 1) {
          return <IconFilledStar key={index} />;
        }
        if (normalizedRating >= index + 0.5) {
          return <IconHalfFilledStar key={index} />;
        }
        return <IconStarReview key={index} />;
      })}
    </div>
  );
}
