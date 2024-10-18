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
interface ProductInformationProps extends HydrogenComponentProps {
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
      children,
      ...rest
    } = props;
    let [quantity, setQuantity] = useState<number>(1);
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
        <section ref={ref} {...rest}>
          <div className="container p-6 md:p-8 lg:p-12 lg:px-12 px-4 md:px-6 mx-auto">
            <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2 lg:gap-12">
              <ProductMedia
                media={product?.media.nodes}
                selectedVariant={selectedVariant}
                showThumbnails={showThumbnails}
                imageAspectRatio={imageAspectRatio}
                spacing={spacing}
              />
              <div
                style={
                  {
                    "--shop-pay-button-border-radius": "9999px",
                    "--shop-pay-button-height": "56px",
                  } as React.CSSProperties
                }
              >
                <div className="flex flex-col justify-start gap-6">
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                      <h2 className="text-3xl font-medium tracking-tighter sm:text-5xl">
                        {title}
                      </h2>
                      {showVendor && vendor && (
                        <Text className={"opacity-50 font-medium"}>
                          {vendor}
                        </Text>
                      )}
                      {children}
                      <p className="text-xl md:text-2xl/relaxed lg:text-2xl/relaxed xl:text-3xl/relaxed flex gap-3 font-heading">
                        {selectedVariant && selectedVariant.compareAtPrice && (
                          <Money
                            withoutTrailingZeros
                            data={selectedVariant.compareAtPrice}
                            className="text-label-sale line-through"
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
                      product={product}
                      selectedVariant={selectedVariant}
                      onSelectedVariantChange={handleSelectedVariantChange}
                      swatch={swatches}
                      variants={variants}
                      options={product?.options}
                      handle={product?.handle}
                      hideUnavailableOptions={hideUnavailableOptions}
                    />
                  </div>
                  <Quantity value={quantity} onChange={setQuantity} />
                  <div className="flex flex-col gap-3 sm:w-[360px]">
                    <AddToCartButton
                      disabled={!selectedVariant?.availableForSale}
                      lines={[
                        {
                          merchandiseId: selectedVariant?.id,
                          quantity,
                        },
                      ]}
                      variant="primary"
                      data-test="add-to-cart"
                      className="w-full"
                    >
                      <span> {atcText}</span>
                    </AddToCartButton>
                    {selectedVariant?.availableForSale && (
                      <ShopPayButton
                        width="100%"
                        variantIdsAndQuantities={[
                          {
                            id: selectedVariant?.id,
                            quantity,
                          },
                        ]}
                        storeDomain={storeDomain}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-4 mt-20 w-full">
              {descriptionHtml && <ProductDetail title="Description" content={descriptionHtml} /> }
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
          </div>
        </section>
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
          label: "Show thumbnails",
          name: "showThumbnails",
          type: "switch",
          defaultValue: true,
        },
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
          condition: "showThumbnails.eq.true",
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
