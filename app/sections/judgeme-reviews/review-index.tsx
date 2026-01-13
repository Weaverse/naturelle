import type { HydrogenComponentSchema } from "@weaverse/hydrogen";
import { createSchema } from "@weaverse/hydrogen";
import type { RefObject } from "react";
import { useLoaderData } from "react-router";
import type { ProductLoaderType } from "~/routes/($locale).products.$handle";
import ReviewForm from "./review-form";
import { ReviewList } from "./review-list";

type ReviewIndexProps = Record<string, never>;
const ReviewIndex = ({
  ref,
  ...props
}: ReviewIndexProps & { ref?: RefObject<HTMLDivElement | null> }) => {
  let { ...rest } = props;
  const { judgemeReviews } = useLoaderData<ProductLoaderType>();
  return (
    <div
      ref={ref}
      {...rest}
      className="flex flex-col md:flex-row md:gap-10 gap-5"
    >
      <ReviewForm judgemeReviews={judgemeReviews} />
      {judgemeReviews.reviews.length > 0 && (
        <ReviewList judgemeReviews={judgemeReviews} />
      )}
    </div>
  );
};

export default ReviewIndex;

export const schema = createSchema({
  type: "judgeme-review--index",
  title: "Judgeme Review",
  limit: 1,
  settings: [],
});
