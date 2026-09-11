import { Disclosure } from "@headlessui/react";
import { Money, ShopPayButton } from "@shopify/hydrogen";
import { createSchema, useThemeSettings } from "@weaverse/hydrogen";
import clsx from "clsx";
import type { RefObject } from "react";
import { useEffect, useState } from "react";
import { useLoaderData } from "react-router";
import type { ProductQuery, VariantsQuery } from "storefront-api.generated";
import {
  IconAnnouncementChevron,
  IconQuickViewFacebook,
  IconQuickViewInstagram,
  IconQuickViewX,
} from "~/components/icon";
import { Image } from "~/components/image";
import { Link } from "~/components/link";
import { AddToCartButton } from "~/components/product/add-to-cart-button";
import { isImageOption } from "~/components/product-form/options";
import { layoutInputs, Section, type SectionProps } from "~/components/section";
import { StarRating } from "~/components/star-rating";
import { Text } from "~/components/text";
import type { ProductLoaderType } from "~/routes/($locale).products.$handle";
import { getExcerpt } from "~/utils/misc";
import { ProductPlaceholder } from "../../components/product-form/placeholder";
import { ProductMedia } from "../../components/product-form/product-media";
import { ProductVariants } from "../../components/product-form/variants";
import { MetaFieldTable } from "./metafield";

interface ProductInformationProps extends SectionProps {
  addToCartText: string;
  soldOutText: string;
  unavailableText: string;
  widthButton: string;
  showVendor: boolean;
  showSalePrice: boolean;
  showDetails: boolean;
  showShippingPolicy: boolean;
  showRefundPolicy: boolean;
  hideUnavailableOptions: boolean;
  // product media props
  showThumbnails: boolean;
  imageAspectRatio: string;
  mediaDirection: "horizontal" | "vertical";
  spacing: number;
  showSlideCounter: boolean;
}

let ProductInformation = ({
  ref,
  ...props
}: ProductInformationProps & { ref?: RefObject<HTMLDivElement | null> }) => {
  let {
    product,
    shop,
    variants: _variants,
    storeDomain,
  } = useLoaderData<
    ProductQuery & {
      variants: VariantsQuery;
      storeDomain: string;
    }
  >();
  const [isLoading, setIsLoading] = useState(false);
  let variants = _variants?.product?.variants;
  let [selectedVariant, setSelectedVariant] = useState<any>(
    product?.selectedVariant,
  );
  let {
    addToCartText,
    soldOutText,
    unavailableText,
    widthButton,
    showVendor,
    showSalePrice,
    showDetails,
    showShippingPolicy,
    showRefundPolicy,
    hideUnavailableOptions,
    showThumbnails,
    imageAspectRatio,
    mediaDirection,
    spacing,
    showSlideCounter,
    children,
    className,
    containerClassName,
    ...rest
  } = props;
  let [quantity, setQuantity] = useState<number>(1);
  const { judgemeReviews } = useLoaderData<ProductLoaderType>();
  let atcText = selectedVariant?.availableForSale
    ? addToCartText
    : selectedVariant?.quantityAvailable === -1
      ? unavailableText
      : soldOutText;
  useEffect(() => {
    if (!selectedVariant) {
      setSelectedVariant(variants?.nodes?.[0]);
    } else if (selectedVariant?.id !== product?.selectedVariant?.id) {
      setSelectedVariant(product?.selectedVariant);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product?.selectedVariant, selectedVariant, variants?.nodes?.[0]]);
  let themeSettings = useThemeSettings();
  let swatches = themeSettings?.swatches || {
    configs: [],
    swatches: {
      imageSwatches: [],
      colorSwatches: [],
    },
  };

  let handleSelectedVariantChange = (variant: any) => {
    setSelectedVariant(variant);
    // update the url
    let searchParams = new URLSearchParams(window.location.search);
    for (const option of variant.selectedOptions) {
      searchParams.set(option.name, option.value);
    }
    let url = `${window.location.pathname}?${searchParams.toString()}`;
    window.history.replaceState({}, "", url);
  };

  if (!product || !selectedVariant) {
    return (
      <section className="w-full py-12 md:py-24 lg:py-32" ref={ref} {...rest}>
        <ProductPlaceholder />
      </section>
    );
  }
  if (product && variants) {
    const { title, vendor, descriptionHtml } = product;
    const { shippingPolicy, refundPolicy } = shop;
    const productUrl = `${storeDomain.replace(/\/$/, "")}/products/${product.handle}`;
    return (
      <Section
        ref={ref}
        {...rest}
        verticalPadding="none"
        className={clsx(className, "px-5 pt-10 pb-16 md:px-6 lg:px-0")}
        containerClassName={clsx(containerClassName, "py-0")}
      >
        <div
          className={clsx(
            "grid grid-cols-1 items-start gap-8 lg:grid-cols-2",
            "lg:gap-12",
            "lg:grid-cols-[1fr_clamp(360px,45%,480px)]",
          )}
        >
          <div className="min-w-0">
            <ProductMedia
              media={product?.media.nodes}
              selectedVariant={selectedVariant}
              showThumbnails={showThumbnails}
              imageAspectRatio={imageAspectRatio}
              spacing={spacing}
              showSlideCounter={showSlideCounter}
              direction={mediaDirection}
            />
            {descriptionHtml && (
              <ProductDescription
                title="Description"
                content={descriptionHtml}
              />
            )}
            {showShippingPolicy && shippingPolicy?.body && (
              <ProductDescription
                title="Shipping"
                content={getExcerpt(shippingPolicy.body)}
                learnMore={`/policies/${shippingPolicy.handle}`}
              />
            )}
            {showRefundPolicy && refundPolicy?.body && (
              <ProductDescription
                title="Returns"
                content={getExcerpt(refundPolicy.body)}
                learnMore={`/policies/${refundPolicy.handle}`}
              />
            )}
          </div>
          <div
            className="min-w-0"
            style={
              {
                "--shop-pay-button-border-radius": "9999px",
                "--shop-pay-button-height": "56px",
                "--width-button": widthButton,
              } as React.CSSProperties
            }
          >
            <div className="flex flex-col justify-start gap-4 lg:gap-6">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-4 sm:gap-5">
                  <h1
                    data-motion="fade-up"
                    className="font-heading text-3xl font-normal leading-tight tracking-tight md:text-4xl"
                  >
                    {title}
                  </h1>
                  {((showVendor && vendor) || product.productType) && (
                    <Text
                      data-motion="fade-up"
                      className="text-sm font-normal text-text-subtle"
                    >
                      {showVendor && vendor && (
                        <>
                          Vendor:{" "}
                          <span className="text-text-primary">{vendor}</span>
                        </>
                      )}
                      {product.productType && (
                        <>
                          {showVendor && vendor && (
                            <span className="px-2">|</span>
                          )}
                          Type:{" "}
                          <span className="text-text-primary">
                            {product.productType}
                          </span>
                        </>
                      )}
                    </Text>
                  )}
                  {judgemeReviews && (
                    <div
                      data-motion="fade-up"
                      className="flex items-center gap-0.5"
                    >
                      <StarRating rating={judgemeReviews.rating} />
                      <span className="ml-1">
                        {judgemeReviews.rating.toFixed(1)}/5.0 (
                        {judgemeReviews.reviewNumber} reviews)
                      </span>
                    </div>
                  )}
                  {children}
                  <p
                    data-motion="fade-up"
                    className="text-xl/[1.1] md:text-2xl/[1.1] lg:text-3xl/[1.1] font-heading font-medium flex gap-3"
                  >
                    {showSalePrice && selectedVariant?.compareAtPrice && (
                      <Money
                        withoutTrailingZeros
                        data={selectedVariant.compareAtPrice}
                        className="text-label-save-background line-through"
                        as="span"
                      />
                    )}

                    {selectedVariant ? (
                      <Money
                        withoutTrailingZeros
                        data={selectedVariant.price}
                        as="span"
                      />
                    ) : null}
                  </p>
                  {showDetails && descriptionHtml && (
                    <div
                      data-motion="fade-up"
                      className="prose line-clamp-5 max-w-none text-sm text-text-subtle"
                      dangerouslySetInnerHTML={{
                        __html: removeEmptyDescriptionLines(descriptionHtml),
                      }}
                    />
                  )}
                </div>
                <ProductVariants
                  isDisabled={isLoading}
                  product={product}
                  selectedVariant={selectedVariant}
                  onSelectedVariantChange={handleSelectedVariantChange}
                  swatch={swatches}
                  variants={variants}
                  options={product?.options}
                  handle={product?.handle}
                  hideUnavailableOptions={hideUnavailableOptions}
                  data-motion="fade-up"
                />
              </div>
              {!product.options.some((option) =>
                isImageOption(option.name),
              ) && (
                <VariantImageSelector
                  variants={variants.nodes}
                  selectedVariantId={selectedVariant.id}
                  disabled={isLoading}
                  onSelect={handleSelectedVariantChange}
                />
              )}
              <div className="grid grid-cols-[auto_1fr] gap-2 sm:w-(--width-button)">
                <ProductQuantity
                  value={quantity}
                  disabled={isLoading}
                  onChange={setQuantity}
                />
                <div data-motion="fade-up">
                  <AddToCartButton
                    disabled={!selectedVariant?.availableForSale}
                    lines={[
                      {
                        merchandiseId: selectedVariant?.id,
                        quantity,
                      },
                    ]}
                    onFetchingStateChange={(state) =>
                      setIsLoading(state === "submitting")
                    }
                    variant="primary"
                    data-test="add-to-cart"
                    className="h-12 w-full rounded-lg"
                  >
                    <span> {atcText}</span>
                  </AddToCartButton>
                </div>
              </div>
              {selectedVariant?.availableForSale && (
                <div data-motion="fade-up" className="sm:w-(--width-button)">
                  <ShopPayButton
                    width="100%"
                    variantIdsAndQuantities={[
                      { id: selectedVariant?.id, quantity },
                    ]}
                    storeDomain={storeDomain}
                    data-motion="fade-up"
                  />
                </div>
              )}
              {(showShippingPolicy || showRefundPolicy) && (
                <div className="flex flex-col gap-3 py-2 text-sm text-text-subtle">
                  {showShippingPolicy && shippingPolicy?.handle && (
                    <Link
                      to={`/policies/${shippingPolicy.handle}`}
                      className="flex items-center gap-2 hover:text-text-primary"
                    >
                      <span aria-hidden="true">▱</span> View shipping policy
                    </Link>
                  )}
                  {showRefundPolicy && refundPolicy?.handle && (
                    <Link
                      to={`/policies/${refundPolicy.handle}`}
                      className="flex items-center gap-2 hover:text-text-primary"
                    >
                      <span aria-hidden="true">↩</span> View returns policy
                    </Link>
                  )}
                </div>
              )}
              <Link
                to={`/products/${product.handle}`}
                className="w-fit text-sm text-text-primary underline underline-offset-4"
              >
                View product details
              </Link>
              <ProductShare productUrl={productUrl} title={title} />
            </div>
            {product?.metafield && <MetaFieldTable data={product?.metafield} />}
          </div>
        </div>
      </Section>
    );
  }
  return <div ref={ref} {...rest} />;
};

function removeEmptyDescriptionLines(content: string) {
  return content.replace(
    /<(p|div)\b[^>]*>(?:\s|&nbsp;|<br\s*\/?\s*>)*<\/\1>/gi,
    "",
  );
}

function ProductDescription({
  title,
  content,
  learnMore,
}: {
  title: string;
  content: string;
  learnMore?: string;
}) {
  return (
    <Disclosure as="div" className="mt-6 border-t border-border-subtle">
      {({ open }) => (
        <>
          <Disclosure.Button className="flex w-full items-center justify-between py-5 text-left">
            <Text as="span" className="text-base font-normal">
              {title}
            </Text>
            <IconAnnouncementChevron
              className={clsx(
                "h-3 w-2 transition-transform duration-300",
                open ? "rotate-90" : "rotate-0",
              )}
            />
          </Disclosure.Button>
          <Disclosure.Panel className="pb-5">
            <div
              className="prose max-w-none text-sm text-text-subtle"
              dangerouslySetInnerHTML={{ __html: content }}
            />
            {learnMore && (
              <Link
                to={learnMore}
                className="mt-4 inline-block text-sm underline underline-offset-4"
              >
                Learn more
              </Link>
            )}
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}

function ProductQuantity({
  value,
  disabled,
  onChange,
}: {
  value: number;
  disabled: boolean;
  onChange: (value: number) => void;
}) {
  return (
    <div className="flex h-12 items-center overflow-hidden rounded-lg border border-border">
      <button
        type="button"
        className="h-full px-3 text-lg disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="Decrease quantity"
        disabled={disabled || value <= 1}
        onClick={() => onChange(Math.max(1, value - 1))}
      >
        −
      </button>
      <span className="min-w-8 text-center text-sm" aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        className="h-full px-3 text-lg disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="Increase quantity"
        disabled={disabled}
        onClick={() => onChange(value + 1)}
      >
        +
      </button>
    </div>
  );
}

function VariantImageSelector({
  variants,
  selectedVariantId,
  disabled,
  onSelect,
}: {
  variants: any[];
  selectedVariantId: string;
  disabled: boolean;
  onSelect: (variant: any) => void;
}) {
  const imageVariants = variants.filter((variant) => variant.image);
  if (imageVariants.length < 2) {
    return null;
  }

  const selectedIndex = Math.max(
    0,
    imageVariants.findIndex((variant) => variant.id === selectedVariantId),
  );
  const selectedType = `Set ${String.fromCharCode(65 + selectedIndex)}`;

  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm">
        <span className="font-semibold">Type:</span> {selectedType}
      </p>
      <div className="flex flex-wrap gap-2.5">
        {imageVariants.map((variant, index) => {
          const isSelected = variant.id === selectedVariantId;
          return (
            <button
              key={variant.id}
              type="button"
              disabled={disabled || !variant.availableForSale}
              aria-label={`Select Set ${String.fromCharCode(65 + index)}`}
              aria-pressed={isSelected}
              className={clsx(
                "size-12 overflow-hidden rounded-lg border p-0.5 transition-colors",
                isSelected
                  ? "border-border"
                  : "border-transparent hover:border-border-subtle",
                !variant.availableForSale &&
                  "diagonal cursor-not-allowed border-border-subtle opacity-50",
              )}
              onClick={() => onSelect(variant)}
            >
              <Image
                data={variant.image}
                sizes="48px"
                className="h-full w-full rounded-md object-cover"
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ProductShare({
  productUrl,
  title,
}: {
  productUrl: string;
  title: string;
}) {
  return (
    <div className="flex items-center gap-3 pt-2 text-sm">
      <span className="font-semibold">Share:</span>
      <ShareLink
        label="Share on Facebook"
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}`}
      >
        <IconQuickViewFacebook className="size-8" />
      </ShareLink>
      <ShareLink
        label="Share on Instagram"
        href={`https://www.instagram.com/?url=${encodeURIComponent(productUrl)}`}
      >
        <IconQuickViewInstagram className="size-8" />
      </ShareLink>
      <ShareLink
        label="Share on X"
        href={`https://x.com/intent/post?url=${encodeURIComponent(productUrl)}&text=${encodeURIComponent(title)}`}
      >
        <IconQuickViewX className="size-8" />
      </ShareLink>
    </div>
  );
}

function ShareLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className="flex size-8 items-center justify-center rounded-full transition-opacity hover:opacity-70"
    >
      {children}
    </a>
  );
}

export default ProductInformation;

export const schema = createSchema({
  type: "product-information",
  title: "Product information",
  childTypes: ["judgeme"],
  limit: 1,
  enabledOn: {
    pages: ["PRODUCT"],
  },
  settings: [
    {
      group: "Layout",
      inputs: layoutInputs.filter(({ name }) => name !== "borderRadius"),
    },
    {
      group: "Product form",
      inputs: [
        {
          type: "text",
          label: "Add to cart text",
          name: "addToCartText",
          defaultValue: "Add to cart",
          placeholder: "Add to cart",
        },
        {
          type: "text",
          label: "Sold out text",
          name: "soldOutText",
          defaultValue: "Sold out",
          placeholder: "Sold out",
        },
        {
          type: "text",
          label: "Unavailable text",
          name: "unavailableText",
          defaultValue: "Unavailable",
          placeholder: "Unavailable",
        },
        {
          label: "Width button",
          name: "widthButton",
          type: "toggle-group",
          defaultValue: "100%",
          configs: {
            options: [
              { value: "25%", label: "1/4" },
              { value: "50%", label: "1/2" },
              { value: "75%", label: "3/4" },
              { value: "100%", label: "Full" },
            ],
          },
        },
        {
          type: "switch",
          label: "Show vendor",
          name: "showVendor",
          defaultValue: true,
        },
        {
          type: "switch",
          label: "Show sale price",
          name: "showSalePrice",
          defaultValue: true,
        },
        {
          type: "switch",
          label: "Show details",
          name: "showDetails",
          defaultValue: true,
        },
        {
          type: "switch",
          label: "Show shipping policy",
          name: "showShippingPolicy",
          defaultValue: true,
        },
        {
          type: "switch",
          label: "Show refund policy",
          name: "showRefundPolicy",
          defaultValue: true,
        },
        {
          label: "Hide unavailable options",
          type: "switch",
          name: "hideUnavailableOptions",
        },
      ],
    },
    {
      group: "Product Media",
      inputs: [
        {
          type: "select",
          name: "imageAspectRatio",
          label: "Aspect ratio",
          defaultValue: "1/1",
          configs: {
            options: [
              { value: "1/1", label: "Square (1/1)" },
              { value: "3/4", label: "Portrait (3/4)" },
              { value: "4/3", label: "Landscape (4/3)" },
              { value: "16/9", label: "Widescreen (16/9)" },
            ],
          },
        },
        {
          label: "Media direction",
          name: "mediaDirection",
          type: "toggle-group",
          defaultValue: "horizontal",
          configs: {
            options: [
              { value: "horizontal", label: "Horizontal" },
              { value: "vertical", label: "Vertical" },
            ],
          },
        },
        {
          label: "Show slide counter",
          name: "showSlideCounter",
          type: "switch",
          defaultValue: true,
        },
        {
          label: "Show thumbnails",
          name: "showThumbnails",
          type: "switch",
          defaultValue: true,
        },
        {
          label: "Gap between images",
          name: "spacing",
          type: "range",
          configs: {
            min: 0,
            step: 2,
            max: 100,
          },
          defaultValue: 10,
          condition: "showThumbnails.eq.true",
        },
      ],
    },
  ],
});
