import { Disclosure } from "@headlessui/react";
import { Money, ShopPayButton } from "@shopify/hydrogen";
import { createSchema, useThemeSettings } from "@weaverse/hydrogen";
import clsx from "clsx";
import type { RefObject } from "react";
import { useLoaderData } from "react-router";
import type { ProductQuery, VariantsQuery } from "storefront-api.generated";
import { IconAnnouncementChevron } from "~/components/icon";
import { Link } from "~/components/link";
import { AddToCartButton } from "~/components/product/add-to-cart-button";
import { BackInStockForm } from "~/components/product/back-in-stock-form";
import { SellingPlanPrice } from "~/components/product/selling-plan-price";
import { SellingPlanSelector } from "~/components/product/selling-plan-selector";
import { layoutInputs, Section, type SectionProps } from "~/components/section";
import { StarRating } from "~/components/star-rating";
import { Text } from "~/components/text";
import { useSellingPlanSelection } from "~/hooks/use-selling-plan";
import type { ProductLoaderType } from "~/routes/($locale).products.$handle";
import { getExcerpt } from "~/utils/misc";
import {
  ProductQuantityInput,
  ProductShareLinks,
  useProductFormState,
} from "../../components/product-form/pdp-form";
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
  showBackInStockForm: boolean;
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
  let variants = _variants?.product?.variants;
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
    showBackInStockForm = true,
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
  const { judgemeReviews } = useLoaderData<ProductLoaderType>();
  let {
    isLoading,
    setIsLoading,
    selectedVariant,
    quantity,
    setQuantity,
    atcText,
    handleSelectedVariantChange,
  } = useProductFormState({
    product,
    variants,
    addToCartText,
    soldOutText,
    unavailableText,
  });
  const {
    selectedSellingPlan,
    selectedSellingPlanId,
    setSelectedSellingPlanId,
  } = useSellingPlanSelection(
    product?.sellingPlanGroups,
    product?.requiresSellingPlan,
  );
  let themeSettings = useThemeSettings();
  let swatches = themeSettings?.swatches || {
    configs: [],
    swatches: {
      imageSwatches: [],
      colorSwatches: [],
    },
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
            "grid grid-cols-1 items-start gap-8 md:grid-cols-2",
            "md:gap-12",
            "md:grid-cols-[1fr_clamp(360px,45%,480px)]",
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
            {showDetails && descriptionHtml && (
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
                  {judgemeReviews.reviewNumber > 0 && (
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
                      <SellingPlanPrice
                        price={selectedVariant.price}
                        sellingPlan={selectedSellingPlan}
                      />
                    ) : null}
                  </p>
                </div>
                <ProductVariants
                  isDisabled={isLoading}
                  product={product}
                  selectedVariant={selectedVariant}
                  onSelectedVariantChange={handleSelectedVariantChange}
                  swatch={swatches}
                  variants={variants}
                  hideUnavailableOptions={hideUnavailableOptions}
                  data-motion="fade-up"
                />
              </div>
              <SellingPlanSelector
                sellingPlanGroups={product.sellingPlanGroups}
                selectedSellingPlanId={selectedSellingPlanId}
                onChange={setSelectedSellingPlanId}
                requiresSellingPlan={product.requiresSellingPlan}
                disabled={isLoading}
              />
              <div className="grid grid-cols-[auto_1fr] gap-2 sm:w-(--width-button)">
                <ProductQuantityInput
                  value={quantity}
                  disabled={isLoading}
                  onChange={setQuantity}
                />
                <div data-motion="fade-up">
                  <AddToCartButton
                    disabled={
                      !selectedVariant?.availableForSale ||
                      (product.requiresSellingPlan && !selectedSellingPlanId)
                    }
                    lines={[
                      {
                        merchandiseId: selectedVariant?.id,
                        quantity,
                        selectedVariant,
                        sellingPlanId: selectedSellingPlanId || undefined,
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
              {selectedVariant?.availableForSale && !selectedSellingPlanId && (
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
              <BackInStockForm
                variantId={selectedVariant?.id}
                availableForSale={selectedVariant?.availableForSale}
                enabled={showBackInStockForm}
              />
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
              <ProductShareLinks productUrl={productUrl} title={title} />
            </div>
            {product?.metafield && <MetaFieldTable data={product?.metafield} />}
          </div>
        </div>
      </Section>
    );
  }
  return <div ref={ref} {...rest} />;
};

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
          type: "switch",
          label: "Show back-in-stock form",
          name: "showBackInStockForm",
          defaultValue: true,
          helpText:
            "Appears for sold-out variants when KLAVIYO_PRIVATE_API_TOKEN is configured.",
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
