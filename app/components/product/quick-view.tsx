import { Portal } from "@headlessui/react";
import { Money, ShopPayButton } from "@shopify/hydrogen";
import { useThemeSettings } from "@weaverse/hydrogen";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { useFetcher } from "react-router";
import { Button } from "~/components/button";
import {
  IconQuickViewFacebook,
  IconQuickViewInstagram,
  IconQuickViewX,
} from "~/components/icon";
import { Image } from "~/components/image";
import { Link } from "~/components/link";
import { Modal } from "~/components/modal";
import { AddToCartButton } from "~/components/product/add-to-cart-button";
import { ProductMedia } from "~/components/product-form/product-media";
import { ProductVariants } from "~/components/product-form/variants";
import { isDiscounted, isNewArrival, type ProductData } from "~/utils/product";
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
  const variants = variantData?.product?.variants;
  const [isLoading, setIsLoading] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<any>(
    product?.selectedVariant ?? variants?.nodes?.[0],
  );
  const [quantity, setQuantity] = useState(1);
  const swatches = theme?.swatches || {
    configs: [],
    swatches: { imageSwatches: [], colorSwatches: [] },
  };

  if (!product || !selectedVariant || !variants) {
    return null;
  }

  const atcText = selectedVariant.availableForSale
    ? theme.addToCartText
    : selectedVariant.quantityAvailable === -1
      ? theme.unavailableText
      : theme.soldOutText;
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
  let badge: string | undefined;
  if (isDiscounted(selectedVariant.price, selectedVariant.compareAtPrice)) {
    badge = "Sale";
  } else if (publishedAt && isNewArrival(publishedAt)) {
    badge = "New arrival";
  } else if (!selectedVariant.availableForSale) {
    badge = "Out of stock";
  }
  const productUrl = `${window.location.origin}/products/${product.handle}`;

  return (
    <div className="max-h-[90vh] w-[min(94vw,1100px)] overflow-y-auto rounded-xl bg-background p-5 md:p-6">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.9fr)]">
        <div className="relative min-w-0 [&_.swiper-slide_img]:rounded-xl">
          <ProductMedia
            media={product.media.nodes}
            selectedVariant={selectedVariant}
            showThumbnails={theme.showThumbnails}
            imageAspectRatio={theme.imageAspectRatio}
            spacing={theme.spacing}
            showSlideCounter={theme.showSlideCounter}
            direction={theme.mediaDirection}
          />
          {badge && (
            <span className="pointer-events-none absolute right-3 top-3 z-20 rounded-full bg-[#77A96D] px-3 py-1.5 text-xs text-white md:right-4 md:top-4">
              {badge}
            </span>
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
                <h2 className="pr-8 font-heading text-3xl font-normal leading-tight md:text-4xl">
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
                  <Money
                    withoutTrailingZeros
                    data={selectedVariant.price}
                    as="span"
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
                          backgroundColor:
                            theme.quickViewLowStockProgressColor || "#4BAE42",
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
                onSelectedVariantChange={setSelectedVariant}
                swatch={swatches}
                variants={variants}
                options={product.options}
                handle={product.handle}
                hideUnavailableOptions={theme.hideUnavailableOptions}
              />
            </div>

            {!product.options.some((option) =>
              ["type", "types"].includes(option.name.trim().toLowerCase()),
            ) && (
              <VariantImageSelector
                variants={variants.nodes}
                selectedVariantId={selectedVariant.id}
                disabled={isLoading}
                onSelect={setSelectedVariant}
              />
            )}

            <div className="grid grid-cols-[auto_1fr] gap-2 [&_legend]:hidden [&_.space-y-3]:space-y-0 [&_input]:h-12 [&_input]:w-14 [&_button]:h-12 [&_button]:px-3">
              <QuickViewQuantity
                disabled={isLoading}
                value={quantity}
                onChange={setQuantity}
              />
              <AddToCartButton
                disabled={!selectedVariant.availableForSale}
                lines={[{ merchandiseId: selectedVariant.id, quantity }]}
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

            {selectedVariant.availableForSale && (
              <div
                className="group/shop-pay relative h-12 w-full overflow-hidden rounded-lg border border-(--shop-pay-border) bg-(--shop-pay-bg) transition-colors hover:border-(--shop-pay-hover-border) hover:bg-(--shop-pay-hover) active:border-(--shop-pay-active-border) active:bg-(--shop-pay-active)"
                style={
                  {
                    "--shop-pay-bg": theme.shopPayButtonBgColor || "#5A31F4",
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
                href={`https://x.com/intent/post?url=${encodeURIComponent(productUrl)}&text=${encodeURIComponent(product.title)}`}
              >
                <IconQuickViewX className="size-8" />
              </ShareLink>
            </div>
          </div>
        </div>
      </div>
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
        <span className="font-semibold">Type:</span> <span>{selectedType}</span>
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

function QuickViewQuantity({
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

export function QuickViewTrigger({
  productHandle,
  buttonText = "Select options",
}: {
  productHandle: string;
  buttonText?: string;
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
      <div className="absolute right-3 bottom-3 z-10 transition-opacity duration-300 md:inset-x-3 md:bottom-4 md:pointer-events-none md:opacity-0 md:group-hover/product-card:pointer-events-auto md:group-hover/product-card:opacity-100 md:group-focus-within/product-card:pointer-events-auto md:group-focus-within/product-card:opacity-100">
        <Button
          type="button"
          variant="primary"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            setOpen(true);
          }}
          loading={state === "loading"}
          className="size-11 rounded-full p-0 shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-button-primary-background md:h-12 md:w-full md:rounded-xl md:px-6 md:text-sm md:font-medium"
          classNameContainer="flex items-center justify-center"
          aria-label={buttonText}
        >
          <svg
            className="size-5 md:hidden"
            aria-hidden="true"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007Z"
            />
          </svg>
          <span className="hidden md:inline">{buttonText}</span>
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
