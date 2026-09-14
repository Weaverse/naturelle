import { useEffect, useRef, useState } from "react";
import { useFetcher, useLoaderData } from "react-router";
import { Button } from "~/components/button";
import { StarRating } from "~/components/star-rating";
import type { ProductLoaderType } from "~/routes/($locale).products.$handle";
import type { JudgeMeReviewType, JudgemeReviewsData } from "~/utils/judgeme";
import { usePrefixPathWithLocale } from "~/utils/locale";

const REVIEWS_PER_PAGE = 5;

function formatReviewDate(dateString: string) {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    return dateString;
  }
  return date.toLocaleDateString("en-GB");
}

export function ReviewList({
  judgemeReviews,
  emptyReviewsText,
}: {
  judgemeReviews: JudgemeReviewsData;
  emptyReviewsText: string;
}) {
  const { product } = useLoaderData<ProductLoaderType>();
  const fetcher = useFetcher<JudgemeReviewsData>();
  const [reviews, setReviews] = useState(judgemeReviews.reviews);
  const [currentPage, setCurrentPage] = useState(judgemeReviews.currentPage);
  const [totalPage, setTotalPage] = useState(judgemeReviews.totalPage);
  const processedData = useRef<JudgemeReviewsData | undefined>(undefined);
  const reviewsApi = usePrefixPathWithLocale(`/api/review/${product.handle}`);

  useEffect(() => {
    setReviews(judgemeReviews.reviews);
    setCurrentPage(judgemeReviews.currentPage);
    setTotalPage(judgemeReviews.totalPage);
    processedData.current = undefined;
  }, [judgemeReviews]);

  useEffect(() => {
    const nextData = fetcher.data;
    if (
      fetcher.state !== "idle" ||
      !nextData ||
      processedData.current === nextData
    ) {
      return;
    }
    processedData.current = nextData;
    setReviews((current) => {
      const byId = new Map<string, JudgeMeReviewType>();
      for (const review of [...current, ...nextData.reviews]) {
        byId.set(review.id, review);
      }
      return [...byId.values()];
    });
    setCurrentPage(nextData.currentPage);
    setTotalPage(nextData.totalPage);
  }, [fetcher.data, fetcher.state]);

  const loadMore = () => {
    if (fetcher.state !== "idle" || currentPage >= totalPage) {
      return;
    }
    fetcher.load(
      `${reviewsApi}?page=${currentPage + 1}&per_page=${REVIEWS_PER_PAGE}`,
    );
  };

  return (
    <section className="min-w-0 rounded-lg bg-background-basic p-6 text-text md:p-8">
      <p className="text-center font-heading text-xl font-normal leading-normal tracking-[-0.01em] text-text uppercase">
        Reviews ({judgemeReviews.reviewNumber.toLocaleString()})
      </p>
      <div className="mx-auto mt-3 h-px w-10 bg-border-subtle" />

      {reviews.length === 0 ? (
        <p className="py-12 text-center text-text-subtle">{emptyReviewsText}</p>
      ) : (
        <div className="mt-6" aria-live="polite">
          {reviews.map((review) => (
            <article
              key={review.id}
              data-motion="fade-up"
              className="grid gap-4 border-border-subtle border-b py-6 first:pt-0 md:grid-cols-[minmax(8rem,0.8fr)_minmax(0,2fr)] md:gap-8"
            >
              <div className="space-y-2">
                <StarRating rating={review.rating} />
                <div>
                  <p className="font-semibold">{review.reviewer.name}</p>
                  {review.verified && (
                    <p className="text-text-subtle text-xs">
                      Verified purchase
                    </p>
                  )}
                </div>
              </div>
              <div className="min-w-0 space-y-2">
                {review.title && (
                  <p className="font-heading text-xl font-normal leading-normal tracking-[-0.01em] text-text">
                    {review.title}
                  </p>
                )}
                <time className="block text-text-subtle text-xs">
                  {formatReviewDate(review.created_at)}
                </time>
                <p className="text-sm leading-6">{review.body}</p>
              </div>
            </article>
          ))}
        </div>
      )}

      {currentPage < totalPage && (
        <div className="flex justify-center pt-6">
          <Button
            variant="outline"
            className="rounded-lg"
            loading={fetcher.state !== "idle"}
            disabled={fetcher.state !== "idle"}
            onClick={loadMore}
          >
            Load more
          </Button>
        </div>
      )}
    </section>
  );
}
