import {
  createSchema,
  type HydrogenComponentProps,
  useTranslation,
} from "@weaverse/hydrogen";
import type { RefObject } from "react";
import { StarRating } from "~/components/star-rating";
import { useWeaverseStudioCheck } from "~/hooks/use-weaverse-studio-check";
import { useRootLoaderData } from "~/root";
import { DEFAULT_LOCALE } from "~/utils/const";
import { formatDate } from "~/utils/locale";

export type ReviewData = {
  reviewerName: string;
  reviewDate?: number | string;
  rating: number;
  title?: string;
  description?: string;
  showVerifiedBuyer?: boolean;
  verifiedBuyerText?: string;
};

export function isCompleteReview(data: ReviewData) {
  const numericRating = Number(data.rating);
  const hasValidRating =
    Number.isFinite(numericRating) && numericRating >= 1 && numericRating <= 5;
  const parsedDate = data.reviewDate ? new Date(data.reviewDate) : undefined;
  const hasValidDate = Boolean(
    parsedDate && !Number.isNaN(parsedDate.getTime()),
  );
  const showVerifiedBuyer = data.showVerifiedBuyer ?? true;
  return Boolean(
    data.reviewerName?.trim() &&
      hasValidDate &&
      hasValidRating &&
      data.title?.trim() &&
      data.description?.trim() &&
      (!showVerifiedBuyer || data.verifiedBuyerText?.trim()),
  );
}

type ReviewProps = HydrogenComponentProps & ReviewData;

const Review = ({
  ref,
  reviewerName,
  reviewDate,
  rating,
  title,
  description,
  showVerifiedBuyer = true,
  verifiedBuyerText = "Verified Buyer",
  ...rest
}: ReviewProps & { ref?: RefObject<HTMLDivElement | null> }) => {
  const { t } = useTranslation();
  const locale = useRootLoaderData()?.selectedLocale ?? DEFAULT_LOCALE;
  const isDesignMode = useWeaverseStudioCheck();
  const numericRating = Number(rating);
  const normalizedRating =
    Number.isFinite(numericRating) && numericRating >= 1 && numericRating <= 5
      ? numericRating
      : 5;
  const parsedDate = reviewDate ? new Date(reviewDate) : undefined;
  const date =
    parsedDate && !Number.isNaN(parsedDate.getTime())
      ? formatDate(parsedDate, locale)
      : undefined;
  const isComplete = isCompleteReview({
    reviewerName,
    reviewDate,
    rating,
    title,
    description,
    showVerifiedBuyer,
    verifiedBuyerText,
  });

  if (!isDesignMode && !isComplete) {
    return null;
  }

  return (
    <div
      data-motion="fade-up"
      ref={ref}
      {...rest}
      className="relative flex flex-col gap-3 rounded-2xl border border-(--border-color) bg-(--review-background-color) px-6 py-4"
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
            {showVerifiedBuyer && verifiedBuyerText && (
              <span className="rounded-full bg-background-subtle-2 px-3 py-1 text-xs leading-none text-text-subtle">
                {verifiedBuyerText}
              </span>
            )}
          </div>
          <div className="flex flex-wrap items-center font-body text-xs leading-none font-normal tracking-[0.24px] text-(--text-color)">
            {date && (
              <span>
                {t("reviews.reviewed")}{" "}
                <time dateTime={parsedDate?.toISOString()}>{date}</time>
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex [&_svg]:size-4">
          <StarRating rating={normalizedRating} />
        </div>
        <span className="text-xs text-background-subtle-2">
          {normalizedRating.toFixed(1)}
        </span>
      </div>
      {title && (
        <p className="font-heading text-[26px] leading-[110%] font-normal text-(--text-color)">
          {title}
        </p>
      )}
      {description && (
        <p className="font-body text-base leading-[160%] font-normal tracking-[-0.16px] text-(--text-color) md:line-clamp-2">
          {description}
        </p>
      )}
      <div className="absolute inset-0 opacity-0 transition-opacity duration-500 hover:bg-white hover:opacity-10" />
    </div>
  );
};

export default Review;

export const schema = createSchema({
  type: "testimonials--review",
  title: "Review item",
  limit: 3,
  settings: [
    {
      group: "Review",
      inputs: [
        {
          type: "text",
          name: "reviewerName",
          label: "Name",
          defaultValue: "Jane Doe",
        },
        {
          type: "datepicker",
          name: "reviewDate",
          label: "Review date",
          defaultValue: Date.UTC(2025, 0, 15),
        },
        {
          type: "range",
          name: "rating",
          label: "Rating",
          defaultValue: 5,
          configs: { min: 1, max: 5, step: 0.1 },
        },
        {
          type: "text",
          name: "title",
          label: "Title",
          defaultValue: "Amazing product",
        },
        {
          type: "textarea",
          name: "description",
          label: "Description",
          defaultValue:
            "This product exceeded my expectations and quickly became part of my daily routine.",
        },
        {
          type: "switch",
          name: "showVerifiedBuyer",
          label: "Show verified buyer",
          defaultValue: true,
        },
        {
          type: "text",
          name: "verifiedBuyerText",
          label: "Verified buyer text",
          defaultValue: "Verified Buyer",
          condition: "showVerifiedBuyer.eq.true",
        },
      ],
    },
  ],
  presets: {
    reviewerName: "Jane Doe",
    reviewDate: Date.UTC(2025, 0, 15),
    rating: 5,
    title: "Amazing product",
    description:
      "This product exceeded my expectations and quickly became part of my daily routine.",
    showVerifiedBuyer: true,
    verifiedBuyerText: "Verified Buyer",
  },
});
