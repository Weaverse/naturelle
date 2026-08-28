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
import { IconCaret, IconImageBlank, IconStar } from "~/components/icon";
import { Link } from "~/components/link";
import { layoutInputs, Section, type SectionProps } from "~/components/section";
import { PRODUCT_QUERY } from "~/graphql/queries";

interface TestimonialsData {
  backgroundImage?: WeaverseImage;
  product?: WeaverseProduct;
  reviewsPosition: string;
  textColor?: string;
  borderColor?: string;
  ratingText?: string;
  ratingValue?: number;
  ratingLink?: string;
  ratingButtonText?: string;
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
  let { product } = await weaverse.storefront.query<ProductQuery>(
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

  return { product };
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
    ratingValue = 4.8,
    ratingLink,
    ratingButtonText = "See what buyers think about this product",
    children,
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

  let sectionStyle: CSSProperties = {
    "--text-color": textColor,
    "--border-color": borderColor,
  } as CSSProperties;
  return (
    <Section
      ref={ref}
      {...rest}
      verticalPadding="none"
      className="relative bg-[#f8f8f0] overflow-hidden px-0"
      containerClassName="max-w-none p-0"
      style={sectionStyle}
    >
      <div className="absolute inset-0 hidden md:block">
        {productImage ? (
          <div className="grid h-full grid-cols-2">
            <Image
              data={productImage}
              className="h-full w-full object-cover"
              sizes="50vw"
            />
            <Image
              data={productImage}
              className="h-full w-full object-cover"
              sizes="50vw"
            />
          </div>
        ) : backgroundImage ? (
          <div className="grid h-full grid-cols-2">
            <Image
              data={backgroundImage}
              className="h-full w-full object-cover"
              sizes="50vw"
            />
            <Image
              data={backgroundImage}
              className="h-full w-full object-cover"
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
            className="h-full w-full object-cover"
            sizes="100vw"
          />
        ) : backgroundImage ? (
          <Image
            data={backgroundImage}
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
        {reviewsPosition === "right" && (
          <div className="absolute inset-0 z-10">
            <div className="absolute top-[32.5px] left-5 flex h-[145px] w-[calc(100%-40px)] max-w-[320px] flex-col justify-center rounded-2xl border border-(--border-color) bg-black/40 px-6 text-(--text-color) shadow-[0_10px_24px_rgba(0,0,0,0.2)] backdrop-blur-xl">
              <p className="text-xs font-semibold uppercase tracking-wide opacity-90">
                {ratingText}
              </p>
              <div className="mt-3 flex gap-2">
                {Array.from({ length: 5 }).map((_, index) => (
                  <IconStar
                    key={index}
                    className="size-6"
                    fill="var(--text-color)"
                    stroke="var(--text-color)"
                  />
                ))}
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <strong className="font-serif text-3xl font-normal">
                  {ratingValue.toFixed(1)}
                </strong>
                <span className="text-base opacity-90">out of 5</span>
              </div>
            </div>
            {ratingButtonText && (
              <Link
                to={productUrl}
                prefetch="intent"
                className="absolute top-[188px] left-[20.5px] flex h-11 w-[214px] items-center justify-between rounded-xl border border-(--border-color) bg-(--color-button-primary-background) px-[18px] text-sm text-(--text-color) shadow-[0_10px_24px_rgba(0,0,0,0.2)]"
              >
                <span className="truncate">{ratingButtonText}</span>
                <IconCaret
                  direction="right"
                  className="size-4 shrink-0"
                  aria-hidden="true"
                />
              </Link>
            )}
          </div>
        )}
      </div>
      {reviewsPosition === "right" && (
        <div className="pointer-events-none absolute inset-0 z-20 hidden md:block">
          <div className="absolute top-[73px] left-[71px] flex h-[145px] w-[320px] flex-col justify-center rounded-2xl border border-(--border-color) bg-black/40 px-6 text-(--text-color) shadow-[0_10px_24px_rgba(0,0,0,0.2)] backdrop-blur-xl">
            <p className="text-xs font-semibold uppercase tracking-wide opacity-90">
              {ratingText}
            </p>
            <div className="mt-3 flex gap-2">
              {Array.from({ length: 5 }).map((_, index) => (
                <IconStar
                  key={index}
                  className="size-6"
                  fill="var(--text-color)"
                  stroke="var(--text-color)"
                />
              ))}
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <strong className="font-serif text-3xl font-normal">
                {ratingValue.toFixed(1)}
              </strong>
              <span className="text-base opacity-90">out of 5</span>
            </div>
          </div>
          {ratingButtonText && (
            <Link
              to={productUrl}
              prefetch="intent"
              className="pointer-events-auto absolute top-[230px] left-[73px] flex h-11 w-[214px] items-center justify-between rounded-xl border border-(--border-color) bg-(--color-button-primary-background) px-[18px] text-sm text-(--text-color) shadow-[0_10px_24px_rgba(0,0,0,0.2)]"
            >
              <span className="truncate">{ratingButtonText}</span>
              <IconCaret
                direction="right"
                className="size-4 shrink-0"
                aria-hidden="true"
              />
            </Link>
          )}
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
            {productImage ? (
              <Image
                data={productImage}
                className="h-full w-full object-cover"
                sizes="100vw"
              />
            ) : backgroundImage ? (
              <Image
                data={backgroundImage}
                className="h-full w-full object-cover"
                sizes="100vw"
              />
            ) : (
              <div className="h-full w-full bg-background-subtle-2" />
            )}
            <div className="absolute inset-0 bg-black/20 backdrop-blur-2xl" />
          </div>
          <div className="relative z-10 flex flex-col gap-12 px-5 py-16 text-(--text-color) [&>.heading]:hidden md:px-6 lg:px-20">
            <h2 className="font-serif text-4xl leading-tight">
              {selectedProduct?.title || "Product name"}
            </h2>
            {children}
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
          name: "ratingValue",
          label: "Rating value",
          configs: { min: 0, max: 5, step: 0.1 },
          defaultValue: 4.8,
          condition: "reviewsPosition.eq.right",
        },
        {
          type: "text",
          name: "ratingButtonText",
          label: "Rating button text",
          defaultValue: "See what buyers think about this product",
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
      ],
    },
  ],
  childTypes: ["heading", "content-reviews--review"],
  presets: {
    children: [
      {
        type: "content-reviews--review",
      },
    ],
  },
});
