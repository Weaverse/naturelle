import { Portal } from "@headlessui/react";
import { Money, ShopPayButton } from "@shopify/hydrogen";
import { useThemeSettings, useTranslation } from "@weaverse/hydrogen";
import { useEffect, useState } from "react";
import { useFetcher } from "react-router";
import { Button } from "~/components/button";
import { IconBag } from "~/components/icon";
import { Link } from "~/components/link";
import { Modal } from "~/components/modal";
import { AddToCartButton } from "~/components/product/add-to-cart-button";
import { BackInStockForm } from "~/components/product/back-in-stock-form";
import { LowStockIndicator } from "~/components/product/low-stock-indicator";
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
import { usePrefixPathWithLocale } from "~/utils/locale";
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
  const { t } = useTranslation();
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
    addToCartText: theme.addToCartText || t("product.addToCart"),
    soldOutText: theme.soldOutText || t("product.soldOut"),
    unavailableText: theme.unavailableText || t("product.unavailable"),
    syncVariantWithUrl: false,
  });
  if (!product || !selectedVariant || !variants) {
    return null;
  }

  const selectedSellingPlan = getSelectedSellingPlan(
    product.sellingPlanGroups,
    requestedSellingPlanId,
    product.requiresSellingPlan,
  );
  const selectedSellingPlanId = selectedSellingPlan?.id ?? null;

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
                  {t("product.vendor")}{" "}
                  <span className="text-text-primary">{product.vendor}</span>
                  {product.productType && (
                    <>
                      <span className="px-2">|</span>
                      {t("product.type")}{" "}
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
                    />
                  )}
                  <SellingPlanPrice
                    price={selectedVariant.price}
                    sellingPlan={selectedSellingPlan}
                  />
                </div>
                <LowStockIndicator
                  availableForSale={selectedVariant.availableForSale}
                  stock={selectedVariant.quantityAvailable}
                  threshold={theme.lowStockThreshold}
                  progressColor={theme.lowStockProgressColor}
                  className="space-y-2"
                  messageClassName="text-sm"
                />
              </div>

              <ProductVariants
                product={product}
                selectedVariant={selectedVariant}
                onSelectedVariantChange={handleSelectedVariantChange}
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
                    <span aria-hidden="true">▱</span>{" "}
                    {t("product.viewShippingPolicy")}
                  </Link>
                )}
                {theme.showRefundPolicy && shop.refundPolicy?.handle && (
                  <Link
                    to={`/policies/${shop.refundPolicy.handle}`}
                    className="flex items-center gap-2 hover:text-text-primary"
                  >
                    <span aria-hidden="true">↩</span>{" "}
                    {t("product.viewReturnsPolicy")}
                  </Link>
                )}
              </div>
            )}

            <Link
              to={`/products/${product.handle}`}
              className="w-fit text-sm text-text-primary underline underline-offset-4"
            >
              {t("product.viewDetails")}
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
  buttonText,
  alwaysShowButton = false,
}: {
  productHandle: string;
  buttonText?: string;
  alwaysShowButton?: boolean;
}) {
  const { t } = useTranslation();
  const resolvedButtonText = buttonText ?? t("product.selectOptions");
  const productQueryPath = usePrefixPathWithLocale("/api/query/products");
  const [open, setOpen] = useState(false);
  const { load, data, state } = useFetcher<ProductData | { error: string }>();
  const productData = data && !("error" in data) ? data : null;
  const hasError = Boolean(data && "error" in data);
  useEffect(() => {
    if (open && !data && state !== "loading") {
      load(`${productQueryPath}?handle=${encodeURIComponent(productHandle)}`);
    }
  }, [open, data, load, productHandle, productQueryPath, state]);

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
            aria-label={resolvedButtonText}
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
          {resolvedButtonText}
        </Button>
      </div>
      {open && productData && (
        <Portal>
          <Modal onClose={() => setOpen(false)}>
            <QuickView data={productData} onAdded={() => setOpen(false)} />
          </Modal>
        </Portal>
      )}
      {open && hasError && (
        <Portal>
          <Modal onClose={() => setOpen(false)}>
            <div className="flex min-h-48 w-[min(90vw,28rem)] flex-col items-center justify-center gap-4 rounded-xl bg-background p-6 text-center">
              <p>{t("system.loadError")}</p>
              <Button
                type="button"
                variant="primary"
                loading={state === "loading"}
                onClick={() =>
                  load(
                    `${productQueryPath}?handle=${encodeURIComponent(productHandle)}`,
                  )
                }
              >
                {t("system.tryAgain")}
              </Button>
            </div>
          </Modal>
        </Portal>
      )}
    </>
  );
}
