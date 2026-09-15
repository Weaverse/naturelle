import { createSchema } from "@weaverse/hydrogen";
import type { RefObject } from "react";
import { useLoaderData } from "react-router";
import { useWeaverseStudioCheck } from "~/hooks/use-weaverse-studio-check";
import type { ProductLoaderType } from "~/routes/($locale).products.$handle";
import ReviewForm from "./review-form";
import { ReviewList } from "./review-list";

type ReviewIndexProps = {
  reviewsPosition?: "left" | "right";
  reviewHeading?: string;
  reviewDescription?: string;
  writeReviewText?: string;
  formHeading?: string;
  formDescription?: string;
  emptyReviewsText?: string;
};
const ReviewIndex = ({
  ref,
  ...props
}: ReviewIndexProps & { ref?: RefObject<HTMLDivElement | null> }) => {
  let {
    reviewsPosition = "right",
    reviewHeading = "Review",
    reviewDescription = "Based on verified purchases and independent testing",
    writeReviewText = "Write a review",
    formHeading = "Write your review",
    formDescription = "Your honest opinion helps others find the perfect ritual.",
    emptyReviewsText = "No reviews yet. Be the first to write one.",
    ...rest
  } = props;
  const { judgemeReviews } = useLoaderData<ProductLoaderType>();
  const isDesignMode = useWeaverseStudioCheck();

  if (isDesignMode && judgemeReviews.reviewNumber === 0) {
    return (
      <div
        ref={ref}
        {...rest}
        className="rounded-lg border border-border-subtle border-dashed bg-background-basic px-6 py-12 text-center text-text"
      >
        <p className="font-heading text-xl uppercase">Judge.me reviews</p>
        <p className="mt-2 text-text-subtle text-sm">
          Reviews will appear here when this product has published reviews.
        </p>
      </div>
    );
  }

  return (
    <div
      ref={ref}
      {...rest}
      className={`grid items-start gap-5 pt-10 md:grid-cols-2 ${
        reviewsPosition === "left"
          ? "lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]"
          : "lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]"
      }`}
    >
      {reviewsPosition === "left" && (
        <ReviewList
          judgemeReviews={judgemeReviews}
          emptyReviewsText={emptyReviewsText}
        />
      )}
      <ReviewForm
        judgemeReviews={judgemeReviews}
        reviewHeading={reviewHeading}
        reviewDescription={reviewDescription}
        writeReviewText={writeReviewText}
        formHeading={formHeading}
        formDescription={formDescription}
      />
      {reviewsPosition === "right" && (
        <ReviewList
          judgemeReviews={judgemeReviews}
          emptyReviewsText={emptyReviewsText}
        />
      )}
    </div>
  );
};

export default ReviewIndex;

export const schema = createSchema({
  type: "judgeme-review--index",
  title: "Judgeme Review",
  limit: 1,
  settings: [
    {
      group: "Layout",
      inputs: [
        {
          type: "select",
          name: "reviewsPosition",
          label: "Reviews list position",
          configs: {
            options: [
              { value: "right", label: "Right" },
              { value: "left", label: "Left" },
            ],
          },
          defaultValue: "right",
        },
      ],
    },
    {
      group: "Content",
      inputs: [
        {
          type: "text",
          name: "reviewHeading",
          label: "Review heading",
          defaultValue: "Review",
        },
        {
          type: "text",
          name: "reviewDescription",
          label: "Review description",
          defaultValue: "Based on verified purchases and independent testing",
        },
        {
          type: "text",
          name: "writeReviewText",
          label: "Write review button text",
          defaultValue: "Write a review",
        },
        {
          type: "text",
          name: "formHeading",
          label: "Form heading",
          defaultValue: "Write your review",
        },
        {
          type: "text",
          name: "formDescription",
          label: "Form description",
          defaultValue:
            "Your honest opinion helps others find the perfect ritual.",
        },
        {
          type: "text",
          name: "emptyReviewsText",
          label: "Empty reviews message",
          defaultValue: "No reviews yet. Be the first to write one.",
        },
      ],
    },
  ],
});
