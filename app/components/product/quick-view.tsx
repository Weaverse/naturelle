import { Portal } from "@headlessui/react";
import { Money, ShopPayButton } from "@shopify/hydrogen";
import { useThemeSettings } from "@weaverse/hydrogen";
import { useEffect, useState } from "react";
import { useFetcher } from "react-router";
import { Button } from "~/components/button";
import { IconBag } from "~/components/icon";
import { Link } from "~/components/link";
import { Modal } from "~/components/modal";
import { AddToCartButton } from "~/components/product/add-to-cart-button";
import { BackInStockForm } from "~/components/product/back-in-stock-form";
import { SellingPlanPrice } from "~/components/product/selling-plan-price";
import { SellingPlanSelector } from "~/components/product/selling-plan-selector";
import {
  ProductQuantityInput,
  ProductShareLinks,
  useProductFormState,
} from "~/components/product-form/pdp-form";
import { ProductMedia } from "~/components/product-form/product-media";
import { ProductVariants } from "~/components/product-form/variants";
import { cn } from "~/utils/cn";
import {
  getSavingsPercentage,
  isNewArrival,
  type ProductData,
} from "~/utils/product";
import { getSelectedSellingPlan } from "~/utils/selling-plan";
import { ProductBadge, type ProductBadgeType } from "./product-badge";
import { ProductCardRating } from "./product-card-rating";

export function QuickView({
  data,
  onAdded,
}: {
  data: ProductData;
  onAdded?: () => void;
}) {
  const theme = useThemeSettings();
  const { product, variants: variantData, storeDomain, shop } = data;
  const [requestedSellingPlanId, setRequestedSellingPlanId] = useState<
    string | null
  >(null);
  const variants = variantData?.product?.variants;
  const {
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
    addToCartText: theme.addToCartText || "Add to cart",
    soldOutText: theme.soldOutText || "Sold out",
    unavailableText: theme.unavailableText || "Unavailable",
    syncVariantWithUrl: false,
  });
  const swatches = theme?.swatches || {
    configs: [],
    swatches: { imageSwatches: [], colorSwatches: [] },
  };

  if (!product || !selectedVariant || !variants) {
    return null;
  }

  const selectedSellingPlan = getSelectedSellingPlan(
    product.sellingPlanGroups,
    requestedSellingPlanId,
    product.requiresSellingPlan,
  );
  const selectedSellingPlanId = selectedSellingPlan?.id ?? null;

  const stock = selectedVariant.quantityAvailable;
  const configuredLowStockThreshold = Number(theme.quickViewLowStockThreshold);
  const lowStockThreshold = Number.isFinite(configuredLowStockThreshold)
    ? Math.min(20, Math.max(0, configuredLowStockThreshold))
    : 5;
  const showLowStock =
    selectedVariant.availableForSale &&
    typeof stock === "number" &&
    stock > 0 &&
    stock <= lowStockThreshold;
  const publishedAt = (product as typeof product & { publishedAt?: string })
    .publishedAt;
  const savingsPercentage = getSavingsPercentage(
    selectedVariant.price,
    selectedVariant.compareAtPrice,
  );
  let badge: { text: string; type: ProductBadgeType } | null = null;
  if (!selectedVariant.availableForSale) {
    badge = {
      text: theme.soldOutBadgeText || "Out of stock",
      type: "sold-out",
    };
  } else if (savingsPercentage) {
    badge = {
      text: (theme.saveBadgeText || "Save [percentage]%").replace(
        "[percentage]",
        savingsPercentage,
      ),
      type: "save",
    };
  } else if (
    publishedAt &&
    isNewArrival(publishedAt, theme.newBadgeDaysOld || 30)
  ) {
    badge = { text: theme.newBadgeText || "New arrival", type: "new" };
  }
  const productUrl = `${storeDomain.replace(/\/$/, "")}/products/${product.handle}`;

  return (
    <div className="max-h-[90vh] w-[min(94vw,1100px)] overflow-y-auto rounded-xl bg-background p-5 md:p-6">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.9fr)]">
        <div className="relative min-w-0 [&_.swiper-slide_img]:rounded-xl">
          <ProductMedia
            media={product.media.nodes}
            selectedVariant={selectedVariant}
            showThumbnails
            thumbnailLayout="strip"
            showPagination={false}
            imageAspectRatio={theme.imageAspectRatio}
            showSlideCounter={theme.showSlideCounter}
            direction="horizontal"
          />
          {badge && (
            <ProductBadge
              text={badge.text}
              type={badge.type}
              className="absolute right-3 top-3 z-20 md:right-4 md:top-4"
            />
          )}
        </div>

        <div
          className="min-w-0 py-1 md:pr-1"
          style={
            {
              "--shop-pay-button-border-radius": "8px",
              "--shop-pay-button-height": "48px",
            } as React.CSSProperties
          }
        >
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-4">
                <h2 className="md:pr-8 font-heading text-3xl font-normal leading-tight md:text-4xl">
                  {product.title}
                </h2>
                <p className="text-sm text-text-subtle">
                  Vendor:{" "}
                  <span className="text-text-primary">{product.vendor}</span>
                  {product.productType && (
                    <>
                      <span className="px-2">|</span>
                      Type:{" "}
                      <span className="text-text-primary">
                        {product.productType}
                      </span>
                    </>
                  )}
                </p>
                <ProductCardRating
                  ratingValue={product.rating?.value}
                  ratingCountValue={product.ratingCount?.value}
                  detailed
                />
                <div className="flex items-center gap-3 font-heading text-xl">
                  {theme.showSalePrice && selectedVariant.compareAtPrice && (
                    <Money
                      withoutTrailingZeros
                      data={selectedVariant.compareAtPrice}
                      className="text-text-subtle line-through"
                      as="span"
                    />
                  )}
                  <SellingPlanPrice
                    price={selectedVariant.price}
                    sellingPlan={selectedSellingPlan}
                  />
                </div>
                {showLowStock && (
                  <div className="space-y-2">
                    <p className="text-sm font-semibold">
                      Hurry up! Only {stock} items in stock.
                    </p>
                    <div
                      role="progressbar"
                      aria-label={`Low stock threshold: ${lowStockThreshold}`}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={lowStockThreshold}
                      className="relative h-1 w-full overflow-hidden rounded-full bg-border-subtle"
                    >
                      <div
                        className="h-full w-full origin-left rounded-full transition-[transform,background-color]"
                        style={{
                          backgroundColor: theme.quickViewLowStockProgressColor,
                          transform: `scaleX(${lowStockThreshold / 100})`,
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <ProductVariants
                isDisabled={isLoading}
                product={product}
                selectedVariant={selectedVariant}
                onSelectedVariantChange={handleSelectedVariantChange}
                swatch={swatches}
                variants={variants}
                hideUnavailableOptions={theme.hideUnavailableOptions}
              />
            </div>

            <SellingPlanSelector
              sellingPlanGroups={product.sellingPlanGroups}
              selectedSellingPlanId={selectedSellingPlanId}
              onChange={setRequestedSellingPlanId}
              requiresSellingPlan={product.requiresSellingPlan}
              disabled={isLoading}
            />

            <div className="grid grid-cols-[auto_1fr] gap-2">
              <ProductQuantityInput
                disabled={isLoading}
                value={quantity}
                onChange={setQuantity}
              />
              <AddToCartButton
                disabled={
                  !selectedVariant.availableForSale ||
                  (product.requiresSellingPlan && !selectedSellingPlanId)
                }
                lines={[
                  {
                    merchandiseId: selectedVariant.id,
                    quantity,
                    selectedVariant,
                    sellingPlanId: selectedSellingPlanId || undefined,
                  },
                ]}
                onFetchingStateChange={(state) =>
                  setIsLoading(state !== "idle")
                }
                onAdded={onAdded}
                data-test="add-to-cart"
                className="h-12 w-full rounded-lg"
              >
                <span>{atcText}</span>
              </AddToCartButton>
            </div>

            {selectedVariant.availableForSale && !selectedSellingPlanId && (
              <div
                className="group/shop-pay relative h-12 w-full overflow-hidden rounded-lg border border-(--shop-pay-border) bg-(--shop-pay-bg) transition-colors hover:border-(--shop-pay-hover-border) hover:bg-(--shop-pay-hover) active:border-(--shop-pay-active-border) active:bg-(--shop-pay-active)"
                style={
                  {
                    "--shop-pay-bg": theme.shopPayButtonBgColor,
                    "--shop-pay-text": theme.buttonTextPrimary,
                    "--shop-pay-border": theme.buttonBorderColorPrimary,
                    "--shop-pay-hover": theme.buttonBgHoverPrimary,
                    "--shop-pay-hover-text": theme.buttonTextHoverPrimary,
                    "--shop-pay-hover-border": theme.buttonBorderHoverPrimary,
                    "--shop-pay-active": theme.buttonBgActivePrimary,
                    "--shop-pay-active-text": theme.buttonTextActivePrimary,
                    "--shop-pay-active-border": theme.buttonBorderActivePrimary,
                  } as React.CSSProperties
                }
              >
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-[inherit] font-body font-normal text-(--shop-pay-text) transition-colors group-hover/shop-pay:text-(--shop-pay-hover-text) group-active/shop-pay:text-(--shop-pay-active-text)">
                  ShopPay
                </div>
                <ShopPayButton
                  key={selectedVariant.id}
                  className="absolute inset-0 z-10 h-full w-full opacity-0"
                  width="100%"
                  variantIdsAndQuantities={[
                    { id: selectedVariant.id, quantity },
                  ]}
                  storeDomain={storeDomain}
                />
              </div>
            )}

            <BackInStockForm
              variantId={selectedVariant.id}
              availableForSale={selectedVariant.availableForSale}
            />

            {(theme.showShippingPolicy || theme.showRefundPolicy) && (
              <div className="flex flex-col gap-3 py-2 text-sm text-text-subtle">
                {theme.showShippingPolicy && shop.shippingPolicy?.handle && (
                  <Link
                    to={`/policies/${shop.shippingPolicy.handle}`}
                    className="flex items-center gap-2 hover:text-text-primary"
                  >
                    <span aria-hidden="true">▱</span> View shipping policy
                  </Link>
                )}
                {theme.showRefundPolicy && shop.refundPolicy?.handle && (
                  <Link
                    to={`/policies/${shop.refundPolicy.handle}`}
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

            <ProductShareLinks productUrl={productUrl} title={product.title} />
          </div>
        </div>
      </div>
    </div>
  );
}

export function QuickViewTrigger({
  productHandle,
  buttonText = "Select options",
  alwaysShowButton = false,
}: {
  productHandle: string;
  buttonText?: string;
  alwaysShowButton?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const { load, data, state } = useFetcher<ProductData>();
  useEffect(() => {
    if (open && !data && state !== "loading") {
      load(`/api/query/products?handle=${productHandle}`);
    }
  }, [open, data, load, state, productHandle]);

  return (
    <>
      <div
        className={cn(
          "absolute z-10 transition-opacity duration-300",
          alwaysShowButton
            ? "inset-x-3 bottom-4"
            : "right-3 bottom-3 md:inset-x-3 md:bottom-4 md:pointer-events-none md:opacity-0 md:group-hover/product-card:pointer-events-auto md:group-hover/product-card:opacity-100 md:group-focus-within/product-card:pointer-events-auto md:group-focus-within/product-card:opacity-100",
        )}
      >
        {!alwaysShowButton && (
          <Button
            type="button"
            variant="custom"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              setOpen(true);
            }}
            loading={state === "loading"}
            className="h-auto rounded-full border border-border-subtle bg-background-basic p-3 text-text shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border md:hidden"
            classNameContainer="flex items-center justify-center"
            aria-label={buttonText}
          >
            <IconBag
              aria-hidden="true"
              className="size-3.5 aspect-square"
              viewBox="0 0 24 24"
            />
          </Button>
        )}
        <Button
          type="button"
          variant="primary"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            setOpen(true);
          }}
          loading={state === "loading"}
          className={cn(
            "h-12 w-full rounded-xl px-6 text-sm font-medium shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-button-primary-background",
            alwaysShowButton ? "inline-flex" : "hidden md:inline-flex",
          )}
          classNameContainer="flex items-center justify-center"
        >
          {buttonText}
        </Button>
      </div>
      {open && data && (
        <Portal>
          <Modal onClose={() => setOpen(false)}>
            <QuickView data={data} onAdded={() => setOpen(false)} />
          </Modal>
        </Portal>
      )}
    </>
  );
}
