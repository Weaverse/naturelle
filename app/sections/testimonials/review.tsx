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
      className="relative flex flex-col rounded-2xl border border-(--border-color) bg-black/20 px-6 py-4 gap-3"
    >
      <div className="flex items-center gap-4">
        <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-button-primary-background font-medium text-text-inverse">
          {reviewerName?.trim().charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0 flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-3">
            {reviewerName && (
              <p className="font-body text-base leading-[160%] font-semibold tracking-[-0.16px] text-(--text-color)">
                {reviewerName}
              </p>
            )}
            {review.verified && (
              <span className="rounded-full bg-background-subtle-2 px-3 py-1 text-xs leading-none text-text-subtle">
                {verifiedLabel}
              </span>
            )}
          </div>
          <div className="flex flex-wrap items-center font-body text-xs leading-none font-normal tracking-[0.24px] text-(--text-color)">
            {date && (
              <span>
                Reviewed: <time dateTime={review.created_at}>{date}</time>
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex [&_svg]:size-4">
          <StarRating rating={review.rating} />
        </div>
        <span className="text-xs text-background-subtle-2">
          {review.rating.toFixed(1)}
        </span>
      </div>
      {review.title && (
        <p className="font-heading text-[26px] leading-[110%] font-normal text-(--text-color)">
          {review.title}
        </p>
      )}
      {review.body && (
        <p className="font-body text-base leading-[160%] font-normal tracking-[-0.16px] text-(--text-color)">
          {review.body}
        </p>
      )}
      <div className="hover:opacity-10 hover:bg-white opacity-0 absolute inset-0 transition-opacity duration-500" />
    </div>
  );
};

export default Review;
