import { Button } from "~/components/button";
import { useFetcher } from "@remix-run/react";
import { Jsonify } from "@remix-run/server-runtime/dist/jsonify";
import { Money, ShopPayButton } from "@shopify/hydrogen";
import { useThemeSettings } from "@weaverse/hydrogen";
import { useEffect, useState } from "react";
import { Text } from "~/components/Text";
import { ProductData } from "~/lib/utils/products";
import { getExcerpt } from "~/lib/utils";
import { ProductDetail } from "~/sections/product-information/product-detail";
import { AddToCartButton } from "./AddToCartButton";
import { Modal } from "./Modal";
import { ProductMedia } from "./product-form/product-media";
import { Quantity } from "./product-form/quantity";
import { ProductVariants } from "./product-form/variants";
import { Portal } from "@headlessui/react";
import { Link } from "./Link";

export function QuickView(props: { data: Jsonify<ProductData> }) {
  const { data } = props;
  let themeSettings = useThemeSettings();
  const [isLoading, setIsLoading] = useState(false);
  let swatches = themeSettings?.swatches || {
    configs: [],
    swatches: {
      imageSwatches: [],
      colorSwatches: [],
    },
  };
  let { product, variants: _variants, storeDomain, shop } = data || {};

  let [selectedVariant, setSelectedVariant] = useState<any>(
    product?.selectedVariant
  );

  let variants = _variants?.product?.variants;
  let [quantity, setQuantity] = useState<number>(1);
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
  } = themeSettings;
  let handleSelectedVariantChange = (variant: any) => {
    setSelectedVariant(variant);
  };
  useEffect(() => {
    if (variants?.nodes?.length) {
      if (!selectedVariant) {
        setSelectedVariant(variants?.nodes?.[0]);
      } else if (selectedVariant?.id !== product?.selectedVariant?.id) {
        setSelectedVariant(product?.selectedVariant);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product?.id]);

  const { shippingPolicy, refundPolicy } = shop;

  const { title, vendor, descriptionHtml } = product;
  let atcText = selectedVariant?.availableForSale
    ? addToCartText
    : selectedVariant?.quantityAvailable === -1
    ? unavailableText
    : soldOutText;
  return (
    <div className="p-10 rounded-2xl bg-background w-[80vw] max-w-[1000px]">
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2 lg:gap-12">
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
          <div className="flex flex-col justify-start gap-4">
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-2">
                <h2 className="font-medium tracking-tighter">{title}</h2>
                {showVendor && vendor && (
                  <Text className={"opacity-50 font-medium"}>{vendor}</Text>
                )}
                <h4 className="flex gap-3">
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
                </h4>
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
              />
            </div>
            <Quantity
              isDisabled={isLoading}
              value={quantity}
              onChange={setQuantity}
            />
            <div className="flex flex-col gap-3">
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
                data-test="add-to-cart"
                className="w-[360px]"
              >
                <span> {atcText}</span>
              </AddToCartButton>
              {selectedVariant?.availableForSale && (
                <ShopPayButton
                  className="w-[360px]"
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
            <div className="flex flex-col gap-3">
              {showDetails && (
                <p
                  className="prose text-base font-normal text-text-subtle line-clamp-3"
                  dangerouslySetInnerHTML={{
                    __html: descriptionHtml
                      .replace(/(<br\s*\/?>\s*)+/g, "")
                      .trim(),
                  }}
                />
              )}
              <Link
                to={`/products/${product?.handle}`}
                className="underline font-body text-text-primary font-normal"
              >
                View full details
              </Link>
            </div>
            {(showShippingPolicy && shippingPolicy?.body) ||
            (showRefundPolicy && refundPolicy?.body) ? (
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
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export function QuickViewTrigger(props: { productHandle: string }) {
  let [quickAddOpen, setQuickAddOpen] = useState(false);
  const { productHandle } = props;
  let { load, data, state } = useFetcher<ProductData>();
  useEffect(() => {
    if (quickAddOpen && !data && state !== "loading") {
      load(`/api/query/products?handle=${productHandle}`);
    }
  }, [quickAddOpen, data, load, state]);
  return (
    <>
      <div className="mt-2 absolute rounded-b bottom-0 hidden lg:group-hover/productCard:block py-5 px-3 w-full opacity-100 bg-[rgba(238,239,234,0.10)] backdrop-blur-2xl">
        <Button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setQuickAddOpen(true);
          }}
          loading={state === "loading"}
          className="w-full"
        >
          Select options
        </Button>
      </div>
      {quickAddOpen && data && (
        <Portal>
          <Modal onClose={() => setQuickAddOpen(false)}>
            {data && <QuickView data={data} />}
          </Modal>
        </Portal>
      )}
    </>
  );
}
