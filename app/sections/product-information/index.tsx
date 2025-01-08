import { useLoaderData } from "@remix-run/react";
import { Money, ShopPayButton } from "@shopify/hydrogen";
import {
  useThemeSettings,
  type HydrogenComponentProps,
  type HydrogenComponentSchema,
} from "@weaverse/hydrogen";
import { forwardRef, useEffect, useState } from "react";
import type { ProductQuery, VariantsQuery } from "storefrontapi.generated";
import { AddToCartButton } from "~/components/AddToCartButton";
import { Text } from "~/components/Text";
import { getExcerpt } from "~/lib/utils";
import { ProductPlaceholder } from "../../components/product-form/placeholder";
import { ProductMedia } from "../../components/product-form/product-media";
import { Quantity } from "../../components/product-form/quantity";
import { ProductVariants } from "../../components/product-form/variants";
import { ProductDetail } from "./product-detail";
import { ProductLoaderType } from "~/routes/($locale).products.$handle";
import { StarRating } from "~/components/StarRating";
import { layoutInputs, Section, SectionProps } from "../atoms/Section";
interface ProductInformationProps extends SectionProps {
  addToCartText: string;
  soldOutText: string;
  unavailableText: string;
  showVendor: boolean;
  showSalePrice: boolean;
  showDetails: boolean;
  showShippingPolicy: boolean;
  showRefundPolicy: boolean;
  hideUnavailableOptions: boolean;
  // product media props
  showThumbnails: boolean;
  imageAspectRatio: string;
  spacing: number;
  showSlideCounter: boolean;
}

let ProductInformation = forwardRef<HTMLDivElement, ProductInformationProps>(
  (props, ref) => {
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
      product?.selectedVariant
    );
    let {
      addToCartText,
      soldOutText,
      unavailableText,
      showVendor,
      showSalePrice,
      showDetails,
      showShippingPolicy,
      showRefundPolicy,
      hideUnavailableOptions,
      showThumbnails,
      imageAspectRatio,
      spacing,
      showSlideCounter,
      children,
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
    }, [product?.id]);
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

    if (!product || !selectedVariant)
      return (
        <section className="w-full py-12 md:py-24 lg:py-32" ref={ref} {...rest}>
          <ProductPlaceholder />
        </section>
      );
    if (product && variants) {
      const { title, vendor, descriptionHtml } = product;
      const { shippingPolicy, refundPolicy } = shop;
      return (
        <Section ref={ref} {...rest}>
          <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-2 lg:gap-12">
            <ProductMedia
              media={product?.media.nodes}
              selectedVariant={selectedVariant}
              showThumbnails={showThumbnails}
              imageAspectRatio={imageAspectRatio}
              spacing={spacing}
              showSlideCounter={showSlideCounter}
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
                    {judgemeReviews?.rating === 0 && (
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
                      className="text-xl/[1.1] md:text-2xl/[1.1] lg:text-2xl/[1.1] xl:text-3xl/[1.1] font-heading font-medium flex gap-3"
                    >
                      {selectedVariant && selectedVariant.compareAtPrice && (
                        <Money
                          withoutTrailingZeros
                          data={selectedVariant.compareAtPrice}
                          className="text-[#AB2E2E] line-through"
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
                <Quantity
                  data-motion="fade-up"
                  value={quantity}
                  isDisabled={isLoading}
                  onChange={setQuantity}
                />
                <div className="flex flex-col gap-3 sm:w-[360px] p-4 sm:p-0">
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
                      className="w-full"
                    >
                      <span> {atcText}</span>
                    </AddToCartButton>
                  </div>
                  {selectedVariant?.availableForSale && (
                    <div data-motion="fade-up">
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
              </div>
            </div>
          </div>
          <div
            data-motion="fade-up"
            className="flex flex-col gap-4 mt-20 w-full"
          >
            {descriptionHtml && (
              <ProductDetail title="Description" content={descriptionHtml} />
            )}
            <div className="grid gap-4 py-4">
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
            </div>
          </div>
        </Section>
      );
    }
    return <div ref={ref} {...rest} />;
  }
);

export default ProductInformation;

export let schema: HydrogenComponentSchema = {
  type: "product-information",
  title: "Product information",
  childTypes: ["judgeme"],
  limit: 1,
  enabledOn: {
    pages: ["PRODUCT"],
  },
  inspector: [
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
  toolbar: ["general-settings", ["duplicate", "delete"]],
};
