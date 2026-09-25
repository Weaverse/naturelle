import { Money, ShopPayButton } from "@shopify/hydrogen";
import {
  type ComponentLoaderArgs,
  createSchema,
  type HydrogenComponentProps,
  type WeaverseProduct,
} from "@weaverse/hydrogen";
import clsx from "clsx";
import type { RefObject } from "react";
import { useLoaderData } from "react-router";
import type {
  ProductQuery,
  ProductVariantFragmentFragment,
  VariantsQuery,
} from "storefront-api.generated";
import { Link } from "~/components/link";
import { AddToCartButton } from "~/components/product/add-to-cart-button";
import { BackInStockForm } from "~/components/product/back-in-stock-form";
import { SellingPlanPrice } from "~/components/product/selling-plan-price";
import { SellingPlanSelector } from "~/components/product/selling-plan-selector";
import { ProductDetail } from "~/components/product-form/product-detail";
import { Quantity } from "~/components/product-form/quantity";
import { layoutInputs, Section, type SectionProps } from "~/components/section";
import { StarRating } from "~/components/star-rating";
import { Text } from "~/components/text";
import { PRODUCT_QUERY, VARIANTS_QUERY } from "~/graphql/queries";
import { useSellingPlanSelection } from "~/hooks/use-selling-plan";
import type { ProductLoaderType } from "~/routes/($locale).products.$handle";
import { getExcerpt } from "~/utils/misc";
import { useProductFormState } from "../../components/product-form/pdp-form";
import { ProductPlaceholder } from "../../components/product-form/placeholder";
import { ProductMedia } from "../../components/product-form/product-media";
import { ProductVariants } from "../../components/product-form/variants";

interface SingleProductData extends SectionProps {
  product: WeaverseProduct;
  addToCartText: string;
  soldOutText: string;
  unavailableText: string;
  showVendor: boolean;
  showSalePrice: boolean;
  showDetails: boolean;
  showShippingPolicy: boolean;
  showRefundPolicy: boolean;
  showBackInStockForm: boolean;
  hideUnavailableOptions: boolean;
  showThumbnails: boolean;
  imageAspectRatio: string;
  mediaDirection: "horizontal" | "vertical";
  spacing: number;
  showSlideCounter: boolean;
  enableZoom: boolean;
}

type SingleProductProps = HydrogenComponentProps<
  Awaited<ReturnType<typeof loader>>
> &
  SingleProductData;

let SingleProduct = ({
  ref,
  ...props
}: SingleProductProps & { ref?: RefObject<HTMLDivElement | null> }) => {
  let {
    addToCartText,
    soldOutText,
    unavailableText,
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
    enableZoom,
    children,
    loaderData,
    ...rest
  } = props;

  let { storeDomain, product, variants: _variants, shop } = loaderData || {};
  let variants = _variants?.product?.variants;
  const { judgemeReviews } = useLoaderData<ProductLoaderType>();
  let {
    isLoading,
    setIsLoading,
    selectedVariant,
    quantity,
    setQuantity,
    atcText,
    handleSelectedVariantChange,
  } = useProductFormState<ProductVariantFragmentFragment>({
    product,
    variants,
    addToCartText,
    soldOutText,
    unavailableText,
    syncVariantWithUrl: false,
  });
  const {
    selectedSellingPlan,
    selectedSellingPlanId,
    setSelectedSellingPlanId,
  } = useSellingPlanSelection(
    product?.sellingPlanGroups,
    product?.requiresSellingPlan,
  );

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
    return (
      <Section ref={ref} {...rest}>
        <div
          className={clsx(
            "grid grid-cols-1 items-start gap-5 md:grid-cols-2",
            "md:gap-[clamp(30px,5%,60px)]",
            "md:grid-cols-[1fr_clamp(360px,45%,480px)]",
          )}
        >
          <ProductMedia
            media={product?.media.nodes}
            selectedVariant={selectedVariant}
            showThumbnails={showThumbnails}
            imageAspectRatio={imageAspectRatio}
            spacing={spacing}
            showSlideCounter={showSlideCounter}
            direction={mediaDirection}
            enableZoom={enableZoom}
          />
          <div
            style={
              {
                "--shop-pay-button-border-radius": "9999px",
                "--shop-pay-button-height": "56px",
              } as React.CSSProperties
            }
          >
            <div className="flex flex-col justify-start gap-4 lg:gap-6">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-4 sm:gap-5">
                  <h2
                    data-motion="fade-up"
                    className="font-medium tracking-tighter"
                  >
                    {title}
                  </h2>
                  {judgemeReviews?.rating > 0 && (
                    <div
                      data-motion="fade-up"
                      className="flex items-center gap-0.5"
                    >
                      <StarRating rating={judgemeReviews.rating} />
                      <span className="ml-1">
                        ({judgemeReviews.rating.toFixed(1)})
                      </span>
                    </div>
                  )}
                  {showVendor && vendor && (
                    <Text
                      data-motion="fade-up"
                      className={"opacity-50 font-medium"}
                    >
                      {vendor}
                    </Text>
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
                  product={product}
                  selectedVariant={selectedVariant}
                  onSelectedVariantChange={handleSelectedVariantChange}
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
              <div className="grid grid-cols-[auto_1fr] gap-2 p-4 sm:w-[360px] sm:p-0 md:items-end">
                <div data-motion="fade-up">
                  <Quantity
                    value={quantity}
                    isDisabled={isLoading}
                    onChange={setQuantity}
                  />
                </div>
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
                    variant="primary"
                    onFetchingStateChange={(state) =>
                      setIsLoading(state === "submitting")
                    }
                    data-test="add-to-cart"
                    className="w-full"
                  >
                    <span> {atcText}</span>
                  </AddToCartButton>
                </div>
                {selectedVariant?.availableForSale &&
                  !selectedSellingPlanId && (
                    <div data-motion="fade-up" className="col-span-2">
                      <ShopPayButton
                        width="100%"
                        variantIdsAndQuantities={[
                          {
                            id: selectedVariant?.id,
                            quantity,
                          },
                        ]}
                        storeDomain={storeDomain}
                        data-motion="fade-up"
                      />
                    </div>
                  )}
              </div>
              <BackInStockForm
                variantId={selectedVariant?.id}
                availableForSale={selectedVariant?.availableForSale}
                enabled={showBackInStockForm}
              />
              {showShippingPolicy && shippingPolicy?.body && (
                <ProductDetail
                  title="Shipping"
                  content={getExcerpt(shippingPolicy.body)}
                  learnMore={`/policies/${shippingPolicy.handle}`}
                />
              )}
              {showRefundPolicy && refundPolicy?.body && (
                <ProductDetail
                  title="Returns"
                  content={getExcerpt(refundPolicy.body)}
                  learnMore={`/policies/${refundPolicy.handle}`}
                />
              )}
              {showDetails && descriptionHtml && (
                <ProductDetail title="Details" content={descriptionHtml} />
              )}
              <Link
                to={`/products/${product?.handle}`}
                className="w-fit text-sm underline"
              >
                View full details
              </Link>
            </div>
          </div>
        </div>
      </Section>
    );
  }

  return <div ref={ref} {...rest} />;
};

export default SingleProduct;

export const loader = async (args: ComponentLoaderArgs<SingleProductData>) => {
  let { weaverse, data } = args;
  let { storefront } = weaverse;
  if (!data.product) {
    return null;
  }
  let metafield =
    weaverse.env.PRODUCT_CUSTOM_DATA_METAFIELD || "custom.details";
  let productHandle = data.product.handle;
  let { product, shop } = await storefront.query<ProductQuery>(PRODUCT_QUERY, {
    variables: {
      handle: productHandle,
      selectedOptions: [],
      namespace: metafield.split(".")[0],
      key: metafield.split(".")[1],
      language: storefront.i18n.language,
      country: storefront.i18n.country,
    },
  });
  let variants = await storefront.query<VariantsQuery>(VARIANTS_QUERY, {
    variables: {
      handle: productHandle,
      language: storefront.i18n.language,
      country: storefront.i18n.country,
    },
  });

  return {
    product,
    shop,
    variants,
    storeDomain: shop.primaryDomain.url,
  };
};

export const schema = createSchema({
  type: "single-product",
  title: "Single product",
  childTypes: ["judgeme"],
  settings: [
    {
      group: "Single product",
      inputs: [
        {
          label: "Choose product",
          type: "product",
          name: "product",
          shouldRevalidate: true,
        },
      ],
    },
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
        {
          label: "Enable zoom",
          name: "enableZoom",
          type: "switch",
          defaultValue: true,
        },
      ],
    },
  ],
});
