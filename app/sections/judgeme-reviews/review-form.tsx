import { useTranslation } from "@weaverse/hydrogen";
import { type SyntheticEvent, useId, useRef, useState } from "react";
import { useLoaderData } from "react-router";
import { Button } from "~/components/button";
import { IconFilledStar, IconStarReview } from "~/components/icon";
import { Input } from "~/components/input";
import { StarRating } from "~/components/star-rating";
import { useRootLoaderData } from "~/root";
import type { ProductLoaderType } from "~/routes/($locale).products.$handle";
import type { JudgemeReviewsData } from "~/types/judgeme";
import { DEFAULT_LOCALE } from "~/utils/const";
import { formatNumber, usePrefixPathWithLocale } from "~/utils/locale";

type ReviewActionData = {
  message?: string;
  success?: boolean;
};

export function ReviewForm({
  judgemeReviews,
  reviewHeading,
  reviewDescription,
  writeReviewText,
  formHeading,
  formDescription,
}: {
  judgemeReviews: JudgemeReviewsData;
  reviewHeading: string;
  reviewDescription: string;
  writeReviewText: string;
  formHeading: string;
  formDescription: string;
}) {
  const { t } = useTranslation();
  const locale = useRootLoaderData()?.selectedLocale ?? DEFAULT_LOCALE;
  const { product } = useLoaderData<ProductLoaderType>();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isSuccessVisible, setIsSuccessVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [reviewBody, setReviewBody] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const formId = useId();
  const submitReviewApi = usePrefixPathWithLocale(
    `/api/review/${product.handle}`,
  );
  const displayRating = Number.isFinite(judgemeReviews.rating)
    ? judgemeReviews.rating
    : 0;
  const ratingRows = [5, 4, 3, 2, 1].map((value) => {
    const row = judgemeReviews.ratingDistribution.find(
      (item) => item.rating === value,
    );
    return {
      rating: value,
      frequency: row?.frequency ?? 0,
      percentage: row?.percentage ?? 0,
    };
  });

  const handleSubmit = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");
    setIsSubmitting(true);

    try {
      const response = await fetch(submitReviewApi, {
        method: "POST",
        body: new FormData(event.currentTarget),
      });

      if (!response.ok) {
        throw new Error("Review submission failed");
      }

      const result = (await response.json()) as ReviewActionData;

      if (!result.success) {
        throw new Error("Review submission failed");
      }

      setIsFormVisible(false);
      setIsSuccessVisible(true);
      setRating(0);
      setHover(0);
      setReviewBody("");
      formRef.current?.reset();
    } catch {
      setMessage(t("reviews.submitError"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex w-full flex-col gap-5">
      <section className="flex flex-col gap-6 rounded-2xl bg-background-basic px-8 py-10 text-center text-text">
        <div className="flex flex-col items-center gap-4">
          <p className="text-center font-heading text-xl font-normal leading-normal tracking-[-0.01em] text-text uppercase">
            {reviewHeading}
          </p>
          <div className="h-px w-12 bg-border-subtle" />
          <p className="text-sm text-text-subtle">{reviewDescription}</p>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-center gap-3">
            <StarRating
              rating={displayRating}
              className="h-6 gap-1 [&>svg]:size-6"
            />
            <span className="font-heading text-[2.5rem] font-normal leading-none text-text">
              {displayRating.toFixed(1)}
            </span>
            <span className="text-base text-text-subtle">
              {t("reviews.outOfFive")}
            </span>
          </div>

          <div className="flex flex-col gap-3 text-xs">
            <div className="flex items-center justify-between uppercase">
              <span>{t("reviews.ratingDistribution")}</span>
              <span className="text-text-subtle">
                {t("reviews.total", {
                  count: formatNumber(judgemeReviews.reviewNumber, locale),
                })}
              </span>
            </div>
            {ratingRows.map((row) => (
              <div
                key={row.rating}
                className="grid grid-cols-[0.5rem_minmax(0,1fr)_2.0625rem] items-center gap-3"
              >
                <span>{row.rating}</span>
                <div
                  className="h-1.5 overflow-hidden rounded-full bg-border-subtle"
                  aria-label={t("reviews.starsReviews", {
                    stars: row.rating,
                    count: row.frequency,
                  })}
                  aria-valuemax={100}
                  aria-valuemin={0}
                  aria-valuenow={row.percentage}
                  role="progressbar"
                >
                  <span
                    className="block h-full rounded-full bg-border"
                    style={{ width: `${row.percentage}%` }}
                  />
                </div>
                <span className="text-right text-text-subtle">
                  {formatNumber(row.frequency, locale)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <Button
          variant="primary"
          className="min-h-12 self-center rounded-lg px-6"
          onClick={() => {
            setMessage("");
            setIsSuccessVisible(false);
            setIsFormVisible((visible) => !visible);
          }}
          aria-expanded={isFormVisible}
          aria-controls={formId}
        >
          {writeReviewText}
        </Button>
      </section>

      {isFormVisible && (
        <section className="flex flex-col gap-8 rounded-2xl bg-background-basic px-8 py-10 text-text">
          <div className="text-center">
            <p className="text-center font-heading text-xl font-normal leading-normal tracking-[-0.01em] text-text uppercase">
              {formHeading}
            </p>
            <div className="mx-auto mt-3 h-px w-12 bg-border-subtle" />
            <p className="mt-4 text-base leading-[1.6] tracking-[-0.01em] text-text-subtle">
              {formDescription}
            </p>
          </div>

          <form
            id={formId}
            ref={formRef}
            method="POST"
            action={submitReviewApi}
            encType="multipart/form-data"
            className="flex flex-col gap-8"
            onSubmit={handleSubmit}
          >
            <input type="hidden" name="rating" value={rating} />

            <div className="flex flex-col gap-6">
              <fieldset className="flex flex-col gap-3">
                <legend className="text-base font-semibold leading-[1.6] tracking-[-0.01em]">
                  {t("reviews.rating")}
                </legend>
                <div className="flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((ratingValue) => (
                    <button
                      type="button"
                      key={ratingValue}
                      onClick={() => setRating(ratingValue)}
                      onMouseEnter={() => setHover(ratingValue)}
                      onMouseLeave={() => setHover(0)}
                      aria-label={t("reviews.rateStars", {
                        rating: ratingValue,
                      })}
                      aria-pressed={rating === ratingValue}
                      className="cursor-pointer"
                    >
                      {ratingValue <= (hover || rating) ? (
                        <IconFilledStar className="size-8" />
                      ) : (
                        <IconStarReview className="size-8" />
                      )}
                    </button>
                  ))}
                </div>
              </fieldset>

              <label
                htmlFor={`${formId}-email`}
                className="flex flex-col gap-2 text-base font-semibold leading-[1.6] tracking-[-0.01em]"
              >
                <span>{t("reviews.emailAddress")}</span>
                <Input
                  required
                  id={`${formId}-email`}
                  type="email"
                  name="email"
                  placeholder="laura@mymail.com"
                  autoComplete="email"
                  className="w-full rounded-lg bg-transparent"
                />
                <span className="block font-normal text-text-subtle text-xs">
                  {t("reviews.emailPrivacy")}
                </span>
              </label>

              <label
                htmlFor={`${formId}-name`}
                className="flex flex-col gap-2 text-base font-semibold leading-[1.6] tracking-[-0.01em]"
              >
                <span>{t("reviews.fullName")}</span>
                <Input
                  required
                  id={`${formId}-name`}
                  type="text"
                  name="name"
                  placeholder="Laura"
                  autoComplete="name"
                  className="w-full rounded-lg bg-transparent"
                />
              </label>

              <label
                htmlFor={`${formId}-title`}
                className="flex flex-col gap-2 text-base font-semibold leading-[1.6] tracking-[-0.01em]"
              >
                <span>{t("reviews.reviewTitle")}</span>
                <Input
                  required
                  id={`${formId}-title`}
                  type="text"
                  name="title"
                  className="w-full rounded-lg bg-transparent"
                />
              </label>

              <label
                htmlFor={`${formId}-body`}
                className="flex flex-col gap-2 text-base font-semibold leading-[1.6] tracking-[-0.01em]"
              >
                <span>{t("reviews.yourReview")}</span>
                <textarea
                  required
                  id={`${formId}-body`}
                  name="body"
                  rows={6}
                  maxLength={500}
                  value={reviewBody}
                  onChange={(event) => setReviewBody(event.target.value)}
                  placeholder={t("reviews.reviewPlaceholder")}
                  className="h-40 w-full resize-y rounded-xl border border-border-subtle bg-transparent px-3 py-3 font-normal outline-none placeholder:text-text-subtle focus-visible:border-border"
                />
                <span className="flex justify-between font-normal text-text-subtle text-xs">
                  <span>{t("reviews.opinionHint")}</span>
                  <span>{reviewBody.length}/500</span>
                </span>
              </label>

              {message && (
                <p
                  role="alert"
                  className="border border-border-subtle p-3 text-sm"
                >
                  {message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button
                type="button"
                variant="custom"
                className="rounded-xl border-0 bg-transparent font-semibold"
                onClick={() => setIsFormVisible(false)}
              >
                {t("actions.cancel")}
              </Button>
              <Button
                type="submit"
                loading={isSubmitting}
                disabled={rating === 0 || isSubmitting}
                className="rounded-xl font-semibold"
              >
                {t("reviews.submitReview")}
              </Button>
            </div>
          </form>
        </section>
      )}

      {isSuccessVisible && (
        <div
          role="status"
          className="rounded-lg bg-background-basic p-6 text-center text-text"
        >
          <p className="font-heading uppercase">{t("reviews.submitted")}</p>
          <p className="mt-2 text-text-subtle text-sm">
            {t("reviews.submittedThanks")}
          </p>
          <button
            type="button"
            className="mt-4 cursor-pointer underline underline-offset-4"
            onClick={() => setIsSuccessVisible(false)}
          >
            {t("accessibility.close")}
          </button>
        </div>
      )}
    </div>
  );
}
