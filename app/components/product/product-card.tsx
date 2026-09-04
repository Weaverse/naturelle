import { Money } from "@shopify/hydrogen";
import type {
  MediaImage,
  MoneyV2,
} from "@shopify/hydrogen/storefront-api-types";
import clsx from "clsx";
import type {
  ProductCardFragment,
  ProductQuery,
} from "storefront-api.generated";
import { Image } from "~/components/image";
import { Link } from "~/components/link";
import type { JudgemeReviewsData } from "~/types/judgeme";
import { isDiscounted, isNewArrival } from "~/utils/product";
import { ProductCardRating } from "./product-card-rating";

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
  quickAdd?: boolean;
  showBadge?: boolean;
  showPrice?: boolean;
  showStar?: boolean;
  showViewDetailsLink?: boolean;
  viewDetailsLinkText?: string;
}

export function ProductCard({
  product,
  collection: collectionProp,
  reviewData,
  label,
  badgeText,
  className,
  loading,
  onClick,
  showBadge = true,
  showPrice = true,
  showStar = true,
  showViewDetailsLink = false,
  viewDetailsLinkText = "View full details",
}: ProductCardProps) {
  const variant = product.variants.nodes[0];
  if (!variant) {
    return null;
  }

  const cardProduct = product as CardProduct & {
    images?: ProductCardFragment["images"];
    media?: NonNullable<ProductQuery["product"]>["media"];
    collections?: {
      nodes: Array<{ id: string; title: string; handle: string }>;
    };
    rating?: { value: string } | null;
    ratingCount?: { value: string } | null;
    publishedAt?: string;
  };
  const mediaImage = cardProduct.media?.nodes.find(
    (node) => node.__typename === "MediaImage",
  ) as MediaImage | undefined;
  const image = cardProduct.images?.nodes[0] ?? mediaImage?.image;
  const collection = collectionProp ?? cardProduct.collections?.nodes[0];
  const { price, compareAtPrice } = variant;
  let badge = label ?? badgeText;
  if (!badge && isDiscounted(price as MoneyV2, compareAtPrice as MoneyV2)) {
    badge = "Sale";
  } else if (!badge && isNewArrival(cardProduct.publishedAt)) {
    badge = "New arrival";
  } else if (!badge && !variant.availableForSale) {
    badge = "Out of stock";
  }

  return (
    <article
      className={clsx(
        "flex min-w-0 w-full flex-col gap-3 rounded-2xl bg-background p-3",
        className,
      )}
    >
      <Link
        to={`/products/${product.handle}`}
        onClick={onClick}
        prefetch="intent"
        className="group relative block aspect-square overflow-hidden rounded-xl bg-background-subtle-2"
      >
        {image && (
          <Image
            data={image}
            alt={image.altText || product.title}
            loading={loading}
            sizes="(min-width: 64em) 25vw, 50vw"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
        {showBadge && badge && (
          <span className="absolute right-2 top-2 rounded-full bg-[#77A96D] px-3 py-1.5 text-xs text-white">
            {badge}
          </span>
        )}
      </Link>

      <div className="flex flex-col gap-2 px-2 pb-2 pt-1 font-sans">
        {collection && (
          <Link
            to={`/collections/${collection.handle}`}
            className="w-fit rounded-full bg-[#DCD8D6] px-3 py-1 text-xs leading-none"
          >
            {collection.title}
          </Link>
        )}
        <Link
          to={`/products/${product.handle}`}
          onClick={onClick}
          prefetch="intent"
          className="font-semibold line-clamp-1"
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
            {compareAtPrice &&
              isDiscounted(price as MoneyV2, compareAtPrice as MoneyV2) && (
                <Money
                  withoutTrailingZeros
                  data={compareAtPrice}
                  className="text-sm line-through text-label-sale-background"
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
