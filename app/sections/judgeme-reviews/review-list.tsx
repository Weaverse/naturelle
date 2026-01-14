import { useState } from "react";
import { StarRating } from "~/components/star-rating";
import type { JudgemeReviewsData } from "~/utils/judgeme";

const reviewPerPage = 5;

export function ReviewList({
  judgemeReviews,
}: {
  judgemeReviews: JudgemeReviewsData;
}) {
  const pageNumber = Math.ceil(judgemeReviews.reviews.length / reviewPerPage);
  const [page, setPage] = useState(0);
  const reviews = judgemeReviews.reviews.slice(
    page * reviewPerPage,
    (page + 1) * reviewPerPage,
  );
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB");
  };
  return (
    <div className="lg:w-2/3 md:w-3/5 w-full py-6 flex flex-col gap-6">
      {/* User Reviews */}
      <div className="flex flex-col gap-6">
        <span className="text-xl font-semibold font-heading uppercase">
          Reviews ({judgemeReviews.reviewNumber})
        </span>
        {reviews.map((review, index) => (
          <div key={index} data-motion="fade-up" className="space-y-6">
            <div className="flex gap-4 flex-col md:flex-row">
              <div className="flex flex-col gap-4 md:w-1/4 w-full">
                <div className="flex items-center gap-0.5">
                  <StarRating rating={review?.rating} />
                </div>
                <div className="flex flex-col">
                  <p className="font-semibold font-heading text-xl">
                    {review.reviewer.name}
                  </p>
                  <p className=" font-normal text-sm text-foreground-subtle">
                    {review.reviewer.email}
                  </p>
                </div>
              </div>
              <div className="md:w-3/4 w-full flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <p className="font-semibold font-heading text-xl">
                    {review.title}
                  </p>
                  <p className="font-normal text-sm text-foreground-subtle">
                    {formatDate(review.created_at)}
                  </p>
                </div>
                <p className="font-normal text-base line-clamp-4">
                  {review.body}
                </p>
              </div>
            </div>
            <hr className="border-t border-border-subtle" />
          </div>
        ))}
      </div>
      {pageNumber > 1 && (
        <div data-motion="fade-up" className="flex justify-center gap-2">
          {Array.from({ length: pageNumber }, (_, i) => (
            <button
              type="button"
              key={i}
              onClick={() => setPage(i)}
              className="bg-[#3d490b]/5 px-4 py-2 rounded-full hover:bg-[#3d490b]/20 transition-colors duration-200 disabled:bg-[#3d490b] disabled:text-white"
              disabled={i === page}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
