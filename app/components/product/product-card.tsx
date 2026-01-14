import type { ShopifyAnalyticsProduct } from "@shopify/hydrogen";
import {
  flattenConnection,
  Money,
  mapSelectedProductOptionToObject,
  useMoney,
} from "@shopify/hydrogen";
import type { MoneyV2, Product } from "@shopify/hydrogen/storefront-api-types";
import { useThemeSettings } from "@weaverse/hydrogen";
import { cva } from "class-variance-authority";
import clsx from "clsx";
import { useState } from "react";
import type {
  ProductCardFragment,
  ProductVariantFragmentFragment,
} from "storefront-api.generated";
import { Button } from "~/components/button";
import { Image } from "~/components/image";
import { Link } from "~/components/link";
import { AddToCartButton } from "~/components/product/add-to-cart-button";
import { Text } from "~/components/text";
import { getImageAspectRatio } from "~/utils/image";
import { getProductPlaceholder } from "~/utils/placeholders";
import { isDiscounted, isNewArrival } from "~/utils/product";
import { ProductCardOptions } from "./product-card-options";
import { QuickViewTrigger } from "./quick-view";

let styleVariants = cva("", {
  variants: {
    alignment: {
      left: "",
      center: "text-center items-center justify-center",
      right: "text-right items-end justify-end",
    },
  },
});

export function ProductCard({
  product,
  label,
  className,
  loading,
  onClick,
  quickAdd,
}: {
  product: ProductCardFragment;
  label?: string;
  className?: string;
  loading?: HTMLImageElement["loading"];
  onClick?: () => void;
  quickAdd?: boolean;
}) {
  let {
    pcardBorderRadius,
    pcardShowImageOnHover,
    pcardImageRatio,
    pcardAlignment,
    pcardShowVendor,
    pcardShowSalePrice,
  } = useThemeSettings();
  let cardLabel, labelClass;
  const cardProduct: Product = product?.variants
    ? (product as Product)
    : getProductPlaceholder();
  if (!cardProduct?.variants?.nodes?.length) return null;
  let [selectedVariant, setSelectedVariant] =
    useState<ProductVariantFragmentFragment | null>(null);
  const [isImageLoading, setIsImageLoading] = useState(false);

  const variants = flattenConnection(cardProduct.variants);
  const firstVariant = flattenConnection(cardProduct.variants)[0];
  if (!firstVariant) return null;
  const { price, compareAtPrice } = firstVariant;
  let params = new URLSearchParams(
    mapSelectedProductOptionToObject(
      (selectedVariant || firstVariant).selectedOptions,
    ),
  );
  let [image, secondImage] = product.images.nodes;
  if (selectedVariant && selectedVariant.image) {
    image = selectedVariant.image;
    let imageUrl = image.url;
    let imageIndex = product.images.nodes.findIndex(
      ({ url }) => url === imageUrl,
    );
    if (imageIndex > 0 && imageIndex < product.images.nodes.length - 1) {
      secondImage = product.images.nodes[imageIndex + 1];
    }
  }

  if (label) {
    cardLabel = label;
  } else if (isDiscounted(price as MoneyV2, compareAtPrice as MoneyV2)) {
    if (compareAtPrice?.amount) {
      let discount =
        100 -
        Math.round(
          (Number.parseFloat(price.amount) /
            Number.parseFloat(compareAtPrice?.amount)) *
            100,
        );
      cardLabel = `Save ${discount}%`;
      labelClass = "bg-label-sale-background text-label-text";
    }
  } else if (isNewArrival(product.publishedAt)) {
    cardLabel = "New Arrival";
    labelClass = "bg-label-new-background text-label-text";
  } else if (!product.variants.nodes[0].availableForSale) {
    cardLabel = "Out of Stock";
    labelClass = "bg-label-soldout-background text-label-text";
  }

  const productAnalytics: ShopifyAnalyticsProduct = {
    productGid: product.id,
    variantGid: firstVariant.id,
    name: product.title,
    variantName: firstVariant.title,
    brand: product.vendor,
    price: firstVariant.price.amount,
    quantity: 1,
  };

  return (
    <div
      className="flex flex-col gap-2 w-full"
      style={
        {
          "--card-border-radius": `${pcardBorderRadius}px`,
          "--card-image-ratio": getImageAspectRatio(image, pcardImageRatio),
        } as React.CSSProperties
      }
    >
      <div className={clsx("grid gap-4", className)}>
        <div className="card-image group/productCard relative aspect-(--card-image-ratio) bg-primary/5">
          {image && (
            <Link
              onClick={onClick}
              to={`/products/${product.handle}?${params.toString()}`}
              prefetch="intent"
              className={({ isTransitioning }) => {
                return isTransitioning ? "vt-product-image" : "";
              }}
            >
              {secondImage && pcardShowImageOnHover ? (
                <>
                  <Image
                    className={clsx(
                      "absolute inset-0 h-full w-full",
                      "opacity-100 transition-opacity duration-300 md:group-hover/productCard:opacity-0",
                      "rounded-(--card-border-radius) object-cover",
                    )}
                    sizes="(min-width: 64em) 25vw, (min-width: 48em) 30vw, 45vw"
                    aspectRatio={pcardImageRatio}
                    data={image}
                    alt={image?.altText || `Picture of ${product.title}`}
                    loading={loading}
                    onLoad={() => setIsImageLoading(false)}
                  />
                  <Image
                    className={clsx(
                      "absolute inset-0 h-full w-full",
                      "opacity-0 transition-opacity duration-300 md:group-hover/productCard:opacity-100",
                      "rounded-(--card-border-radius) object-cover",
                    )}
                    sizes="(min-width: 64em) 25vw, (min-width: 48em) 30vw, 45vw"
                    aspectRatio={pcardImageRatio}
                    data={secondImage}
                    alt={secondImage?.altText || `Picture of ${product.title}`}
                    loading={loading}
                  />
                </>
              ) : (
                <Image
                  className={clsx(
                    "w-full h-full",
                    isImageLoading && "opacity-0",
                    "rounded-(--card-border-radius) object-cover transition-opacity duration-300",
                  )}
                  sizes="(min-width: 64em) 25vw, (min-width: 48em) 30vw, 45vw"
                  aspectRatio={pcardImageRatio}
                  data={image}
                  alt={image.altText || `Picture of ${product.title}`}
                  loading={loading}
                  onLoad={() => setIsImageLoading(false)}
                />
              )}
            </Link>
          )}
          <span
            className={clsx(
              "text-notice absolute text-sm right-2 top-2 px-3 py-2 text-right font-body",
              labelClass,
            )}
          >
            {cardLabel}
          </span>
          {quickAdd && variants.length > 1 && (
            <QuickViewTrigger productHandle={product.handle} />
          )}
          {quickAdd &&
            variants.length === 1 &&
            firstVariant.availableForSale && (
              <div className="absolute bottom-0 hidden w-full rounded-b bg-[rgba(238,239,234,0.10)] px-3 py-5 opacity-100 backdrop-blur-2xl lg:group-hover/productCard:block">
                <AddToCartButton
                  className="w-full"
                  lines={[
                    {
                      quantity: 1,
                      merchandiseId: firstVariant.id,
                    },
                  ]}
                  variant="secondary"
                  analytics={{
                    products: [productAnalytics],
                    totalValue: Number.parseFloat(productAnalytics.price),
                  }}
                >
                  <Text
                    as="span"
                    className="flex items-center justify-center gap-2"
                  >
                    Add to Bag
                  </Text>
                </AddToCartButton>
              </div>
            )}
        </div>
        <div
          className={clsx(
            "grid gap-2",
            styleVariants({ alignment: pcardAlignment }),
          )}
        >
          {pcardShowVendor && (
            <p className="text-text-subtle">{product.vendor}</p>
          )}
          <h4 className="w-full space-x-1 overflow-hidden text-ellipsis whitespace-nowrap text-xl font-medium">
            <Link
              onClick={onClick}
              to={`/products/${product.handle}`}
              prefetch="intent"
              className={({ isTransitioning }) => {
                return isTransitioning ? "vt-product-image block" : "";
              }}
            >
              <span>{product.title}</span>
              {firstVariant.sku && <span>({firstVariant.sku})</span>}
            </Link>
          </h4>
          <div
            className={clsx(
              "flex",
              styleVariants({ alignment: pcardAlignment }),
            )}
          >
            <Text className="flex gap-2">
              {pcardShowSalePrice &&
                isDiscounted(price as MoneyV2, compareAtPrice as MoneyV2) && (
                  <CompareAtPrice
                    className="text-[#AB2E2E] line-through"
                    data={compareAtPrice as MoneyV2}
                  />
                )}
              <Money withoutTrailingZeros data={price!} />
            </Text>
          </div>
        </div>
      </div>
      {quickAdd && variants.length === 1 && firstVariant.availableForSale && (
        <AddToCartButton
          lines={[
            {
              quantity: 1,
              merchandiseId: firstVariant.id,
            },
          ]}
          variant="secondary"
          className="mt-4 w-full lg:hidden"
          analytics={{
            products: [productAnalytics],
            totalValue: Number.parseFloat(productAnalytics.price),
          }}
        >
          <Text as="span" className="flex items-center justify-center gap-2">
            Add to Bag
          </Text>
        </AddToCartButton>
      )}
      {quickAdd && variants.length > 1 && (
        <Button
          className="mt-4 lg:hidden"
          variant="secondary"
          to={`/products/${product.handle}`}
        >
          Select Options
        </Button>
      )}
      {quickAdd && variants.length === 1 && !firstVariant.availableForSale && (
        <Button variant="secondary" className="mt-4 lg:hidden" disabled>
          <Text as="span" className="flex items-center justify-center gap-2">
            Sold out
          </Text>
        </Button>
      )}
      <ProductCardOptions
        product={product}
        selectedVariant={selectedVariant as ProductVariantFragmentFragment}
        setSelectedVariant={(variant) => {
          if (variant?.image?.url !== selectedVariant?.image?.url) {
            setIsImageLoading(true);
          }
          setSelectedVariant(variant as ProductVariantFragmentFragment);
        }}
      />
    </div>
  );
}

function CompareAtPrice({
  data,
  className,
}: {
  data: MoneyV2;
  className?: string;
}) {
  const { currencyNarrowSymbol, withoutTrailingZerosAndCurrency } =
    useMoney(data);

  const styles = clsx("strike", className);

  return (
    <span className={styles}>
      {currencyNarrowSymbol}
      {withoutTrailingZerosAndCurrency}
    </span>
  );
}
