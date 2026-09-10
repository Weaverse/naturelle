import type { RefObject } from "react";
import { StarRating } from "~/components/star-rating";
import type { JudgeMeReviewType } from "~/types/judgeme";

interface ReviewProps {
  review: JudgeMeReviewType;
  verifiedLabel?: string;
  ref?: RefObject<HTMLDivElement | null>;
}

const Review = ({
  ref,
  review,
  verifiedLabel = "Verified Buyer",
}: ReviewProps) => {
  const reviewerName = review.reviewer.name;
  const date = review.created_at
    ? new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(new Date(review.created_at))
    : undefined;
  return (
    <div
      data-motion="fade-up"
      ref={ref}
      className="relative flex flex-col rounded-2xl border border-(--border-color) bg-black/20 px-6 py-4"
    >
      <div className="flex items-center gap-4">
        <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-button-primary-background font-medium text-text-inverse">
          {reviewerName?.trim().charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-3">
            {reviewerName && (
              <h4 className="font-medium text-(--text-color)">
                {reviewerName}
              </h4>
            )}
            {review.verified && (
              <span className="rounded-full bg-background-subtle-2 px-3 py-1 text-xs leading-none text-text-subtle">
                {verifiedLabel}
              </span>
            )}
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-(--text-color)">
            {date && <time dateTime={review.created_at}>{date}</time>}
          </div>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-4">
        <div className="flex [&_svg]:size-4">
          <StarRating rating={review.rating} />
        </div>
        <span className="text-xs text-background-subtle-2">
          {review.rating.toFixed(1)}
        </span>
      </div>
      {review.title && (
        <h5 className="mt-4 font-medium text-(--text-color)">{review.title}</h5>
      )}
      {review.body && (
        <p className="mt-2 text-sm font-normal text-(--text-color)">
          {review.body}
        </p>
      )}
      <div className="hover:opacity-10 hover:bg-white opacity-0 absolute inset-0 transition-opacity duration-500" />
    </div>
  );
};

export default Review;
