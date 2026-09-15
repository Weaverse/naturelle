import { Money } from "@shopify/hydrogen";
import type {
  MediaImage,
  MoneyV2,
} from "@shopify/hydrogen/storefront-api-types";
import { useThemeSettings } from "@weaverse/hydrogen";
import clsx from "clsx";
import type {
  ProductCardFragment,
  ProductQuery,
} from "storefront-api.generated";
import { Image } from "~/components/image";
import { Link } from "~/components/link";
import type { JudgemeReviewsData } from "~/types/judgeme";
import {
  getSavingsPercentage,
  isDiscounted,
  isNewArrival,
} from "~/utils/product";
import { ProductBadge, type ProductBadgeType } from "./product-badge";
import { ProductCardRating } from "./product-card-rating";
import { QuickViewTrigger } from "./quick-view";

type CardProduct = ProductCardFragment | NonNullable<ProductQuery["product"]>;

export interface ProductCardProps {
  product: CardProduct;
  collection?: { title: string; handle: string } | null;
  reviewData?: JudgemeReviewsData | null;
  label?: string;
  badgeText?: string;
  className?: string;
  loading?: HTMLImageElement["loading"];
  onClick?: () => void;
  enableQuickView?: boolean;
  showBadge?: boolean;
  showPrice?: boolean;
  showStar?: boolean;
  showViewDetailsLink?: boolean;
  viewDetailsLinkText?: string;
}

export function ProductCard({
  product,
  reviewData,
  label,
  badgeText,
  className,
  loading,
  onClick,
  enableQuickView = true,
  showBadge = true,
  showPrice = true,
  showStar = true,
  showViewDetailsLink = false,
  viewDetailsLinkText = "View full details",
}: ProductCardProps) {
  const {
    pcardEnableQuickView,
    pcardQuickViewButtonText,
    pcardShowImageOnHover,
    pcardBorderRadius = 16,
    pcardImageRatio = "1/1",
    pcardAlignment = "left",
    pcardShowVendor = false,
    pcardShowSalePrice = true,
    saveBadgeText = "Save [percentage]%",
    newBadgeText = "New arrival",
    newBadgeDaysOld = 30,
    soldOutBadgeText = "Out of stock",
  } = useThemeSettings();
  const variant = product.variants.nodes[0];
  if (!variant) {
    return null;
  }

  const cardProduct = product as CardProduct & {
    images?: ProductCardFragment["images"];
    media?: NonNullable<ProductQuery["product"]>["media"];
    rating?: { value: string } | null;
    ratingCount?: { value: string } | null;
    publishedAt?: string;
  };
  const mediaImages = cardProduct.media?.nodes.filter(
    (node) => node.__typename === "MediaImage",
  ) as MediaImage[] | undefined;
  const image = cardProduct.images?.nodes[0] ?? mediaImages?.[0]?.image;
  const secondImage = cardProduct.images?.nodes[1] ?? mediaImages?.[1]?.image;
  const { price, compareAtPrice } = variant;
  const customBadge = label ?? badgeText;
  const savingsPercentage = getSavingsPercentage(
    price as MoneyV2,
    compareAtPrice as MoneyV2,
  );
  let badge: { text: string; type: ProductBadgeType } | null = null;

  if (!variant.availableForSale) {
    badge = { text: customBadge || soldOutBadgeText, type: "sold-out" };
  } else if (savingsPercentage) {
    badge = {
      text:
        customBadge || saveBadgeText.replace("[percentage]", savingsPercentage),
      type: "save",
    };
  } else if (isNewArrival(cardProduct.publishedAt, newBadgeDaysOld)) {
    badge = { text: customBadge || newBadgeText, type: "new" };
  } else if (customBadge) {
    badge = { text: customBadge, type: "new" };
  }

  return (
    <article
      className={clsx(
        "flex min-w-0 w-full flex-col gap-3 rounded-[var(--pcard-border-radius)] bg-background p-3 transition-[border-radius] duration-300 hover:rounded-none",
        className,
      )}
      style={
        {
          "--pcard-border-radius": `${pcardBorderRadius}px`,
        } as React.CSSProperties
      }
    >
      <div
        className="group/product-card relative"
        style={{ aspectRatio: pcardImageRatio.replace("/", " / ") }}
      >
        <Link
          to={`/products/${product.handle}`}
          onClick={onClick}
          prefetch="intent"
          className="group block h-full overflow-hidden bg-background-subtle-2"
          style={{ borderRadius: `${Math.max(0, pcardBorderRadius - 4)}px` }}
        >
          {image && (
            <Image
              data={image}
              alt={image.altText || product.title}
              loading={loading}
              sizes="(min-width: 64em) 25vw, 50vw"
              className={clsx(
                "h-full w-full object-cover",
                pcardShowImageOnHover &&
                  secondImage &&
                  "transition-opacity duration-300 group-hover:opacity-50",
              )}
            />
          )}
          {pcardShowImageOnHover && secondImage && (
            <Image
              data={secondImage}
              alt={secondImage.altText || `Second picture of ${product.title}`}
              loading="lazy"
              sizes="(min-width: 64em) 25vw, 50vw"
              className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            />
          )}
        </Link>
        {showBadge && badge && (
          <ProductBadge
            text={badge.text}
            type={badge.type}
            className="absolute right-2 top-2"
          />
        )}
        {enableQuickView && pcardEnableQuickView !== false && (
          <QuickViewTrigger
            productHandle={product.handle}
            buttonText={pcardQuickViewButtonText || "Select options"}
          />
        )}
      </div>

      <div
        className={clsx(
          "flex flex-col gap-2 px-2 pb-2 pt-1 font-sans",
          pcardAlignment === "center" && "items-center text-center",
          pcardAlignment === "right" && "items-end text-right",
          pcardAlignment === "left" && "items-start text-left",
        )}
      >
        {pcardShowVendor && product.vendor && (
          <span className="w-fit rounded-full bg-background-subtle-2 px-3 py-1 text-xs leading-none">
            {product.vendor}
          </span>
        )}
        <Link
          to={`/products/${product.handle}`}
          onClick={onClick}
          prefetch="intent"
          className="line-clamp-2 text-base font-semibold leading-[160%] tracking-[-0.16px]"
        >
          {product.title}
        </Link>
        {showStar && (
          <ProductCardRating
            ratingValue={cardProduct.rating?.value}
            ratingCountValue={cardProduct.ratingCount?.value}
            rating={reviewData?.averageRating}
            ratingCount={reviewData?.totalReviews}
          />
        )}
        {showPrice && (
          <div className="flex items-center gap-1.5">
            {pcardShowSalePrice &&
              compareAtPrice &&
              isDiscounted(price as MoneyV2, compareAtPrice as MoneyV2) && (
                <Money
                  withoutTrailingZeros
                  data={compareAtPrice}
                  className="text-sm line-through text-label-save-background"
                />
              )}
            <Money withoutTrailingZeros data={price} className="font-medium" />
          </div>
        )}
        {showViewDetailsLink && (
          <Link
            to={`/products/${product.handle}`}
            className="text-sm underline underline-offset-4"
          >
            {viewDetailsLinkText}
          </Link>
        )}
      </div>
    </article>
  );
}
