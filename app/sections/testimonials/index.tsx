import { Image } from "@shopify/hydrogen";
import type {
  ComponentLoaderArgs,
  WeaverseImage,
  WeaverseProduct,
} from "@weaverse/hydrogen";
import {
  createSchema,
  useChildInstances,
  useTranslation,
} from "@weaverse/hydrogen";
import clsx from "clsx";
import type { CSSProperties, RefObject } from "react";
import type { ProductQuery } from "storefront-api.generated";
import { buttonVariants } from "~/components/button";
import { IconCaret, IconImageBlank } from "~/components/icon";
import { Link } from "~/components/link";
import { layoutInputs, Section, type SectionProps } from "~/components/section";
import { StarRating } from "~/components/star-rating";
import { PRODUCT_QUERY } from "~/graphql/queries";
import { useWeaverseStudioCheck } from "~/hooks/use-weaverse-studio-check";
import { useRootLoaderData } from "~/root";
import { cn } from "~/utils/cn";
import { DEFAULT_LOCALE } from "~/utils/const";
import { formatNumber } from "~/utils/locale";
import { isCompleteReview } from "./review";

interface TestimonialsData {
  backgroundImage?: WeaverseImage;
  product?: WeaverseProduct;
  reviewsPosition: string;
  textColor?: string;
  borderColor?: string;
  ratingText?: string;
  rating?: number;
  reviewCount?: number;
  ratingButtonText?: string;
  ratingOverlayColor?: string;
  reviewBackgroundColor?: string;
  desktopContentPadding?: number;
}

export const loader = async ({
  weaverse,
  data,
}: ComponentLoaderArgs<TestimonialsData>) => {
  if (!data?.product) {
    return null;
  }

  let metafield =
    weaverse.env.PRODUCT_CUSTOM_DATA_METAFIELD || "custom.details";
  const productData = await weaverse.storefront.query<ProductQuery>(
    PRODUCT_QUERY,
    {
      variables: {
        handle: data.product.handle,
        selectedOptions: [],
        namespace: metafield.split(".")[0],
        key: metafield.split(".")[1],
        language: weaverse.storefront.i18n.language,
        country: weaverse.storefront.i18n.country,
      },
    },
  );

  return {
    product: productData.product,
  };
};

type TestimonialsLoaderData = Awaited<ReturnType<typeof loader>>;

type TestimonialsProps = Omit<
  SectionProps<TestimonialsLoaderData>,
  keyof TestimonialsData
> &
  TestimonialsData;

let reviewsPositionContent: { [reviewsPosition: string]: string } = {
  left: "justify-start",
  right: "justify-end",
};

const Testimonials = ({
  ref,
  ...props
}: TestimonialsProps & { ref?: RefObject<HTMLElement | null> }) => {
  const { t } = useTranslation();
  const locale = useRootLoaderData()?.selectedLocale ?? DEFAULT_LOCALE;
  let {
    backgroundImage,
    reviewsPosition,
    textColor,
    borderColor,
    ratingText = "Overall rating",
    rating = 4.9,
    reviewCount = 3,
    ratingButtonText = "Explore this product",
    ratingOverlayColor,
    reviewBackgroundColor = "#000000",
    desktopContentPadding = 80,
    loaderData,
    children,
    ...rest
  } = props;
  let selectedProduct = loaderData?.product;
  let productImage = selectedProduct?.media.nodes.find(
    (media) => media.__typename === "MediaImage",
  )?.image;
  const displayImage = productImage || backgroundImage;
  const isDesignMode = useWeaverseStudioCheck();
  const reviewInstances = useChildInstances().filter(
    ({ data }) => data.type === "testimonials--review",
  );

  const canRenderTestimonials = Boolean(selectedProduct);

  if (!canRenderTestimonials && !isDesignMode) {
    return null;
  }

  let productUrl = selectedProduct
    ? `/products/${selectedProduct.handle}`
    : "#";
  const numericRating = Number(rating);
  const displayedRating = Number.isFinite(numericRating)
    ? Math.min(5, Math.max(1, numericRating))
    : 0;
  const numericReviewCount = Number(reviewCount);
  const displayedRatingCount = Number.isFinite(numericReviewCount)
    ? Math.max(3, Math.round(numericReviewCount))
    : 3;
  const hasReviewItems = reviewInstances.length > 0;
  const hasCompleteReview = reviewInstances.some(({ data }) =>
    isCompleteReview({
      reviewerName: data.reviewerName,
      reviewDate: data.reviewDate,
      rating: data.rating,
      title: data.title,
      description: data.description,
      showVerifiedBuyer: data.showVerifiedBuyer,
      verifiedBuyerText: data.verifiedBuyerText,
    }),
  );
  const hasReviews = isDesignMode ? hasReviewItems : hasCompleteReview;

  let sectionStyle: CSSProperties = {
    "--text-color": textColor,
    "--border-color": borderColor,
    "--rating-overlay-background": `color-mix(in srgb, ${ratingOverlayColor} 40%, transparent)`,
    "--review-background-color": `color-mix(in srgb, ${reviewBackgroundColor} 20%, transparent)`,
    "--desktop-content-padding": `${desktopContentPadding}px`,
  } as CSSProperties;

  if (!hasReviews) {
    if (!isDesignMode) {
      return null;
    }

    return (
      <Section ref={ref} {...rest} style={sectionStyle}>
        <div className="rounded-lg border border-border-subtle border-dashed bg-background-basic px-6 py-12 text-center text-text">
          <p className="font-heading text-xl uppercase">Testimonials</p>
          <p className="mt-2 text-text-subtle text-sm">
            Add at least one complete testimonial
          </p>
        </div>
      </Section>
    );
  }

  return (
    <Section
      ref={ref}
      {...rest}
      verticalPadding="none"
      className="relative overflow-hidden bg-background-basic px-0"
      containerClassName="max-w-none p-0"
      style={sectionStyle}
    >
      <div className="absolute inset-0 hidden md:block">
        {displayImage ? (
          <div className="grid h-full grid-cols-2">
            <Image
              data={displayImage}
              className="h-full w-full object-cover"
              sizes="50vw"
            />
            <Image
              data={displayImage}
              className="h-full w-full object-cover"
              sizes="50vw"
            />
          </div>
        ) : isDesignMode ? (
          <div className="flex h-full w-full items-center justify-center bg-background-subtle-2">
            <IconImageBlank
              className="w-96 h-96 opacity-80"
              viewBox="0 0 526 526"
            />
          </div>
        ) : null}
      </div>
      {(displayImage || isDesignMode) && (
        <div className="relative h-[834px] w-full md:hidden">
          {displayImage ? (
            <Image
              data={displayImage}
              className="h-full w-full object-cover"
              sizes="100vw"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-background-subtle-2">
              <IconImageBlank
                className="h-64 w-64 opacity-80"
                viewBox="0 0 526 526"
              />
            </div>
          )}
        </div>
      )}
      {reviewsPosition === "right" && (
        <div
          className={cn(
            "pointer-events-none z-20 grid grid-cols-1 md:grid-cols-2",
            displayImage || isDesignMode
              ? "absolute inset-x-0 top-0"
              : "relative",
          )}
        >
          <div className="flex flex-col items-start gap-3 p-5 pt-8 md:p-12 lg:p-[72px]">
            <div className="flex w-full max-w-[320px] flex-col gap-3 rounded-2xl border border-(--border-color) bg-(--rating-overlay-background) p-6 text-(--text-color) shadow-[0_10px_24px_rgba(0,0,0,0.2)] backdrop-blur-xl">
              <p className="text-xs font-semibold leading-none uppercase tracking-wide opacity-90">
                {ratingText}
              </p>
              <div className="flex leading-none [&_svg]:size-6">
                <StarRating rating={displayedRating} />
              </div>
              <div className="flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5">
                <strong className="h5 font-heading font-normal">
                  {displayedRating.toFixed(1)}
                </strong>
                <span className="text-xs font-semibold leading-none opacity-90">
                  {t("reviews.outOfFive")}
                </span>
                <span className="text-xs font-semibold leading-none opacity-90">
                  ({formatNumber(displayedRatingCount, locale)}{" "}
                  {t("reviews.label")})
                </span>
              </div>
            </div>
            {ratingButtonText && (
              <Link
                to={productUrl}
                prefetch="intent"
                className={buttonVariants({
                  variant: "primary",
                  className:
                    "pointer-events-auto flex h-auto min-h-9 w-fit max-w-[320px] items-center justify-between gap-3 rounded-xl px-[18px] py-3 font-body text-base leading-[1.6] font-semibold tracking-[-0.16px] shadow-[0_10px_24px_rgba(0,0,0,0.2)]",
                })}
              >
                <span>{ratingButtonText}</span>
                <IconCaret
                  direction="right"
                  className="size-4.5 shrink-0"
                  aria-hidden="true"
                />
              </Link>
            )}
          </div>
        </div>
      )}
      <div
        className={clsx(
          "relative z-10 mt-0 flex w-full items-stretch",
          reviewsPositionContent[reviewsPosition],
        )}
      >
        <div
          className={clsx(
            "relative w-full bg-black/20 backdrop-blur-2xl",
            reviewsPosition === "full" ? "md:w-full" : "md:w-1/2",
          )}
        >
          <div className="absolute inset-0 md:hidden">
            {displayImage ? (
              <Image
                data={displayImage}
                className="h-full w-full object-cover"
                sizes="100vw"
              />
            ) : isDesignMode ? (
              <div className="h-full w-full bg-background-subtle-2" />
            ) : null}
            <div className="absolute inset-0 bg-black/20 backdrop-blur-2xl" />
          </div>
          <div className="relative z-10 flex flex-col gap-10 px-5 py-16 text-(--text-color) [&>.heading]:hidden md:px-6 lg:px-(--desktop-content-padding)">
            <h2 className="line-clamp-1 font-serif text-4xl leading-tight">
              {selectedProduct?.title || "Product name"}
            </h2>
            <div className="flex flex-col gap-5">{children}</div>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default Testimonials;

export const schema = createSchema({
  type: "testimonials",
  title: "Testimonials",
  settings: [
    {
      group: "Layout",
      inputs: layoutInputs.filter(
        ({ name }) =>
          name !== "divider" &&
          name !== "borderRadius" &&
          name !== "gap" &&
          name !== "verticalPadding",
      ),
    },
    {
      group: "Testimonials",
      inputs: [
        {
          label: "Choose product",
          type: "product",
          name: "product",
          shouldRevalidate: true,
        },
        {
          type: "image",
          name: "backgroundImage",
          label: "Background image",
        },
        {
          type: "toggle-group",
          label: "Reviews position",
          name: "reviewsPosition",
          configs: {
            options: [
              { label: "Left", value: "left" },
              { label: "Right", value: "right" },
              { label: "Full width", value: "full" },
            ],
          },
          defaultValue: "right",
        },
        {
          type: "text",
          name: "ratingText",
          label: "Rating heading",
          defaultValue: "Overall rating",
          condition: "reviewsPosition.eq.right",
        },
        {
          type: "range",
          name: "rating",
          label: "Overall rating",
          defaultValue: 4.9,
          configs: {
            min: 1,
            max: 5,
            step: 0.1,
          },
          condition: "reviewsPosition.eq.right",
        },
        {
          type: "range",
          name: "reviewCount",
          label: "Review count",
          defaultValue: 3,
          configs: {
            min: 3,
            max: 1000,
            step: 1,
          },
          condition: "reviewsPosition.eq.right",
        },
        {
          type: "text",
          name: "ratingButtonText",
          label: "Rating button text",
          defaultValue: "Explore this product",
          condition: "reviewsPosition.eq.right",
        },
        {
          type: "color",
          name: "textColor",
          label: "Text color",
          defaultValue: "#FFFFFF",
        },
        {
          type: "color",
          name: "borderColor",
          label: "Border color",
          defaultValue: "#443E40",
        },
        {
          type: "color",
          name: "ratingOverlayColor",
          label: "Rating overlay color",
          defaultValue: "#000000",
          condition: "reviewsPosition.eq.right",
        },
        {
          type: "color",
          name: "reviewBackgroundColor",
          label: "Review background color",
          defaultValue: "#000000",
        },
        {
          type: "range",
          label: "Desktop content padding horizontal",
          name: "desktopContentPadding",
          configs: {
            min: 20,
            max: 120,
            step: 4,
            unit: "px",
          },
          defaultValue: 80,
        },
      ],
    },
  ],
  childTypes: ["testimonials--review"],
  presets: {
    reviewsPosition: "right",
    rating: 4.9,
    reviewCount: 3,
    children: [
      {
        type: "testimonials--review",
        reviewerName: "Olivia Bennett",
        reviewDate: Date.UTC(2026, 0, 18),
        rating: 4.9,
        title: "A new daily favorite",
        description:
          "The texture feels beautiful and my skin looks noticeably calmer and more radiant.",
        showVerifiedBuyer: true,
        verifiedBuyerText: "Verified Buyer",
      },
      {
        type: "testimonials--review",
        reviewerName: "Sophia Martinez",
        reviewDate: Date.UTC(2026, 1, 3),
        rating: 5,
        title: "Exactly what my routine needed",
        description:
          "Gentle, effective, and easy to use. I noticed a real difference after only a few weeks.",
        showVerifiedBuyer: true,
        verifiedBuyerText: "Verified Buyer",
      },
      {
        type: "testimonials--review",
        reviewerName: "Emily Chen",
        reviewDate: Date.UTC(2026, 1, 21),
        rating: 4.8,
        title: "Beautiful results",
        description:
          "It layers perfectly with the rest of my skincare and leaves my skin feeling soft all day.",
        showVerifiedBuyer: true,
        verifiedBuyerText: "Verified Buyer",
      },
    ],
  },
});
