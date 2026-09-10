import { Image } from "@shopify/hydrogen";
import type {
  ComponentLoaderArgs,
  WeaverseImage,
  WeaverseProduct,
} from "@weaverse/hydrogen";
import { createSchema } from "@weaverse/hydrogen";
import clsx from "clsx";
import type { CSSProperties, RefObject } from "react";
import type { ProductQuery } from "storefront-api.generated";
import { IconCaret, IconImageBlank } from "~/components/icon";
import { Link } from "~/components/link";
import { layoutInputs, Section, type SectionProps } from "~/components/section";
import { StarRating } from "~/components/star-rating";
import { PRODUCT_QUERY } from "~/graphql/queries";
import { getJudgemeReviews } from "~/utils/judgeme";
import Review from "./review";

interface TestimonialsData {
  backgroundImage?: WeaverseImage;
  product?: WeaverseProduct;
  reviewsPosition: string;
  textColor?: string;
  borderColor?: string;
  ratingText?: string;
  ratingLink?: string;
  ratingButtonText?: string;
  ratingOverlayColor?: string;
  desktopContentPadding?: number;
  reviewsToShow?: number;
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
  const [productData, judgemeReviews] = await Promise.all([
    weaverse.storefront.query<ProductQuery>(PRODUCT_QUERY, {
      variables: {
        handle: data.product.handle,
        selectedOptions: [],
        namespace: metafield.split(".")[0],
        key: metafield.split(".")[1],
        language: weaverse.storefront.i18n.language,
        country: weaverse.storefront.i18n.country,
      },
    }),
    getJudgemeReviews(
      weaverse.env.JUDGEME_PRIVATE_API_TOKEN,
      weaverse.env.PUBLIC_STORE_DOMAIN,
      data.product.handle,
      { weaverseContext: weaverse, perPage: 5 },
    ),
  ]);

  return { product: productData.product, judgemeReviews };
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
  let {
    backgroundImage,
    reviewsPosition,
    textColor,
    borderColor,
    ratingText = "Overall rating",
    ratingLink,
    ratingButtonText = "See what buyers think about this product",
    ratingOverlayColor,
    desktopContentPadding = 80,
    reviewsToShow = 3,
    loaderData,
    ...rest
  } = props;
  let selectedProduct = loaderData?.product;
  let productImage = selectedProduct?.media.nodes.find(
    (media) => media.__typename === "MediaImage",
  )?.image;
  let productUrl = selectedProduct
    ? `/products/${selectedProduct.handle}`
    : ratingLink || "#";
  const reviews =
    loaderData?.judgemeReviews.reviews.slice(0, reviewsToShow) || [];
  const displayedRating = loaderData?.judgemeReviews.averageRating || 0;
  const displayedRatingCount = loaderData?.judgemeReviews.totalReviews || 0;

  let sectionStyle: CSSProperties = {
    "--text-color": textColor,
    "--border-color": borderColor,
    "--rating-overlay-background": `color-mix(in srgb, ${ratingOverlayColor} 40%, transparent)`,
    "--desktop-content-padding": `${desktopContentPadding}px`,
  } as CSSProperties;
  return (
    <Section
      ref={ref}
      {...rest}
      verticalPadding="none"
      className="relative overflow-hidden px-0 md:h-screen-no-nav"
      containerClassName="max-w-none p-0 md:h-full"
      style={sectionStyle}
    >
      <div className="absolute inset-0 hidden md:block">
        {productImage ? (
          <div className="grid h-full grid-cols-2">
            <Image
              data={productImage}
              className="h-full w-full object-contain"
              sizes="50vw"
            />
            <Image
              data={productImage}
              className="h-full w-full object-contain"
              sizes="50vw"
            />
          </div>
        ) : backgroundImage ? (
          <div className="grid h-full grid-cols-2">
            <Image
              data={backgroundImage}
              className="h-full w-full object-contain"
              sizes="50vw"
            />
            <Image
              data={backgroundImage}
              className="h-full w-full object-contain"
              sizes="50vw"
            />
          </div>
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-background-subtle-2">
            <IconImageBlank
              className="w-96 h-96 opacity-80"
              viewBox="0 0 526 526"
            />
          </div>
        )}
      </div>
      <div className="relative h-[420px] w-full md:hidden">
        {productImage ? (
          <Image
            data={productImage}
            className="h-full w-full object-contain"
            sizes="100vw"
          />
        ) : backgroundImage ? (
          <Image
            data={backgroundImage}
            className="h-full w-full object-contain"
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
      {reviewsPosition === "right" && (
        <div className="pointer-events-none absolute inset-x-0 top-0 z-20 grid grid-cols-1 md:grid-cols-2">
          <div className="flex flex-col items-start gap-3 p-5 pt-8 md:p-12 lg:p-16">
            <div className="flex w-full max-w-[247px] flex-col gap-3 rounded-xl border border-(--border-color) bg-(--rating-overlay-background) p-6 text-(--text-color) shadow-[0_10px_24px_rgba(0,0,0,0.2)] backdrop-blur-xl">
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
                  out of 5
                </span>
                <span className="text-xs font-semibold leading-none opacity-90">
                  ({displayedRatingCount.toLocaleString("en-US")} reviews)
                </span>
              </div>
            </div>
            {ratingButtonText && (
              <Link
                to={productUrl}
                prefetch="intent"
                className="pointer-events-auto flex min-h-9 w-fit max-w-[247px] items-center justify-between gap-3 rounded-lg border border-(--border-color) bg-(--color-button-primary-background) px-3 py-2 text-xs font-semibold text-(--text-color) shadow-[0_10px_24px_rgba(0,0,0,0.2)]"
              >
                <span>{ratingButtonText}</span>
                <IconCaret
                  direction="right"
                  className="size-4 shrink-0"
                  aria-hidden="true"
                />
              </Link>
            )}
          </div>
        </div>
      )}
      <div
        className={clsx(
          "relative z-10 mt-0 flex w-full items-stretch md:h-full",
          reviewsPositionContent[reviewsPosition],
        )}
      >
        <div
          className={clsx(
            "relative w-full bg-black/20 backdrop-blur-2xl md:h-full md:overflow-y-auto",
            reviewsPosition === "full" ? "md:w-full" : "md:w-1/2",
          )}
        >
          <div className="absolute inset-0 md:hidden">
            {productImage ? (
              <Image
                data={productImage}
                className="h-full w-full object-contain"
                sizes="100vw"
              />
            ) : backgroundImage ? (
              <Image
                data={backgroundImage}
                className="h-full w-full object-contain"
                sizes="100vw"
              />
            ) : (
              <div className="h-full w-full bg-background-subtle-2" />
            )}
            <div className="absolute inset-0 bg-black/20 backdrop-blur-2xl" />
          </div>
          <div className="relative z-10 flex min-h-full flex-col gap-12 px-5 py-16 text-(--text-color) [&>.heading]:hidden md:px-6 lg:px-(--desktop-content-padding)">
            <h2 className="line-clamp-1 font-serif text-4xl leading-tight">
              {selectedProduct?.title || "Product name"}
            </h2>
            <div className="flex flex-col gap-5">
              {reviews.map((review) => (
                <Review
                  key={review.id}
                  review={review}
                  verifiedLabel="Verified Buyer"
                />
              ))}
            </div>
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
          name !== "divider" && name !== "borderRadius" && name !== "gap",
      ),
    },
    {
      group: "Testimonials",
      inputs: [
        {
          type: "range",
          name: "reviewsToShow",
          label: "Reviews to show",
          defaultValue: 3,
          configs: {
            min: 2,
            max: 5,
            step: 1,
          },
        },
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
          type: "text",
          name: "ratingButtonText",
          label: "Rating button text",
          defaultValue: "Explore this product",
          condition: "reviewsPosition.eq.right",
        },
        {
          type: "url",
          name: "ratingLink",
          label: "Rating link",
          defaultValue: "#",
          condition: "reviewsPosition.eq.right",
        },
        {
          type: "color",
          name: "textColor",
          label: "Text color",
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
});
