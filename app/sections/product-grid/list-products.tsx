import type { Image as ShopifyImage } from "@shopify/hydrogen/storefront-api-types";
import {
  type ComponentLoaderArgs,
  createSchema,
  type HydrogenComponentProps,
  IMAGES_PLACEHOLDERS,
  type WeaverseCollection,
} from "@weaverse/hydrogen";
import type { RefObject } from "react";
import type { ProductCardFragment } from "storefront-api.generated";
import { IconCaret, IconImageBlank } from "~/components/icon";
import { Image } from "~/components/image";
import { Link } from "~/components/link";
import { ProductCard } from "~/components/product/product-card";
import { PRODUCT_CARD_FRAGMENT } from "~/graphql/fragments";
import type { JudgemeReviewsData } from "~/types/judgeme";
import { getImageLoadingPriority } from "~/utils/image";
import { getJudgemeReviews } from "~/utils/judgeme";

type ProductGridListData = {
  collection?: WeaverseCollection;
  showCollectionTitle: boolean;
  showCount: boolean;
  showRating: boolean;
  showProductBadge: boolean;
  collectionEyebrow: string;
  collectionHeading: string;
  collectionButtonText: string;
};

interface CollectionData {
  id: string;
  title: string;
  handle: string;
  image: Partial<ShopifyImage> | null;
  products: { nodes: ProductCardFragment[] };
  productCount: { nodes: Array<{ id: string }> };
}

interface ProductGridListProps
  extends HydrogenComponentProps<Awaited<ReturnType<typeof loader>>>,
    ProductGridListData {}

const PRODUCT_GRID_QUERY = `#graphql
  query ProductGridCollection(
    $country: CountryCode
    $language: LanguageCode
    $handle: String!
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      title
      handle
      image { id altText width height url }
      products(first: 4) {
        nodes { ...ProductCard }
      }
      productCount: products(first: 250) {
        nodes { id }
      }
    }
  }
  ${PRODUCT_CARD_FRAGMENT}
` as const;

export const loader = async ({
  data,
  weaverse,
}: ComponentLoaderArgs<ProductGridListData>) => {
  if (!data.collection?.handle) {
    return null;
  }

  const { country, language } = weaverse.storefront.i18n;
  const result = await weaverse.storefront.query<{
    collection: CollectionData | null;
  }>(PRODUCT_GRID_QUERY, {
    variables: { handle: data.collection.handle, country, language },
  });

  const ratings: Record<string, JudgemeReviewsData | null> = {};
  if (weaverse.env.JUDGEME_PRIVATE_API_TOKEN && result.collection) {
    const entries = await Promise.all(
      result.collection.products.nodes.map(
        async (product) =>
          [
            product.id,
            await getJudgemeReviews(
              weaverse.env.JUDGEME_PRIVATE_API_TOKEN,
              weaverse.env.PUBLIC_STORE_DOMAIN,
              product.handle,
            ),
          ] as const,
      ),
    );
    Object.assign(ratings, Object.fromEntries(entries));
  }

  return { ...result, ratings };
};

function ProductPlaceholder() {
  return (
    <div className="flex min-w-0 flex-col gap-3">
      <div className="flex aspect-square items-center justify-center overflow-hidden rounded-(--border-radius-lg) bg-background-subtle-2">
        <IconImageBlank
          className="h-full w-full opacity-70"
          viewBox="0 0 526 526"
        />
      </div>
      <div className="grid gap-1">
        <p className="text-sm text-text-subtle">Vendor</p>
        <p className="font-heading text-lg font-medium">Product title</p>
        <p className="text-sm">$0.00</p>
      </div>
    </div>
  );
}

export default function ProductGridList({
  ref,
  ...props
}: ProductGridListProps & { ref?: RefObject<HTMLDivElement | null> }) {
  const {
    loaderData,
    showCollectionTitle,
    showCount,
    showRating,
    showProductBadge,
    collectionEyebrow,
    collectionHeading,
    collectionButtonText,
    ...rest
  } = props;
  const collection = loaderData?.collection;
  const products = collection?.products.nodes ?? [];
  const collectionImage = collection?.image ?? {
    url: IMAGES_PLACEHOLDERS.collection_1,
    altText: "Collection image",
    width: 1000,
    height: 1400,
  };
  const collectionTitle = collection?.title ?? "New arrivals";
  const collectionHandle = collection?.handle ?? "all";
  const visibleCount = Math.min(4, products.length || 4);
  const totalCount = collection?.productCount.nodes.length ?? 4;

  return (
    <div
      ref={ref}
      {...rest}
      className="order-2 flex max-w-lg flex-col gap-10 lg:gap-12"
    >
      <div className="grid w-full items-stretch gap-6 md:grid-cols-2">
        <Link
          to={`/collections/${collectionHandle}`}
          className="group relative min-h-[30rem] overflow-hidden rounded-(--border-radius-xl) bg-background-subtle-2 lg:min-h-full"
          aria-label={`View ${collectionTitle} collection`}
          data-motion="fade-up"
        >
          <Image
            data={collectionImage}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(min-width: 64em) 50vw, 100vw"
          />
          <div className="absolute inset-0 bg-black/20" />
          {showCollectionTitle && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-white lg:p-10">
              {collectionEyebrow && (
                <p className="mb-3 text-sm uppercase tracking-[0.16em]">
                  {collectionEyebrow}
                </p>
              )}
              <h3 className="max-w-md font-heading text-4xl font-normal lg:text-5xl">
                {collectionHeading || collectionTitle}
              </h3>
              {collectionButtonText && (
                <span className="mt-6 inline-flex items-center gap-3 rounded-full bg-white px-5 py-3 text-sm text-[#3B3333] transition-transform group-hover:translate-y-[-2px]">
                  {collectionButtonText}
                  <IconCaret direction="right" aria-hidden="true" />
                </span>
              )}
            </div>
          )}
        </Link>

        <div className="flex min-w-0 flex-col justify-center">
          <div className="grid grid-cols-2 gap-4 lg:gap-6">
            {products.length
              ? products.slice(0, 4).map((product, index) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    collection={{
                      title: collectionTitle,
                      handle: collectionHandle,
                    }}
                    loading={getImageLoadingPriority(index)}
                    showBadge={showProductBadge}
                    reviewData={
                      showRating ? loaderData?.ratings[product.id] : null
                    }
                  />
                ))
              : Array.from({ length: 4 }, (_, index) => (
                  <ProductPlaceholder key={index} />
                ))}
          </div>
        </div>
      </div>

      {showCount && (
        <p className="text-center text-sm font-medium text-text-subtle">
          {visibleCount} <span aria-hidden="true">/</span> {totalCount}
        </p>
      )}
    </div>
  );
}

export const schema = createSchema({
  type: "product-grid--list",
  title: "Product grid list",
  limit: 1,
  settings: [
    {
      group: "Products",
      inputs: [
        {
          type: "collection",
          name: "collection",
          label: "Collection",
          helpText:
            "Select one collection. Its first 4 products are shown in the grid.",
        },
        {
          type: "text",
          name: "collectionEyebrow",
          label: "Collection subheading",
          defaultValue: "New collection",
        },
        {
          type: "text",
          name: "collectionHeading",
          label: "Collection heading",
          placeholder: "Uses the collection title when empty",
        },
        {
          type: "text",
          name: "collectionButtonText",
          label: "Collection button",
          defaultValue: "Shop collection",
        },
        {
          type: "switch",
          name: "showCollectionTitle",
          label: "Show collection title",
          defaultValue: true,
        },
        {
          type: "switch",
          name: "showProductBadge",
          label: "Show product badge",
          defaultValue: true,
        },
        {
          type: "switch",
          name: "showRating",
          label: "Show product ratings",
          helpText: "Uses Judge.me ratings when the integration is configured.",
          defaultValue: true,
        },
        {
          type: "switch",
          name: "showCount",
          label: "Show product count",
          helpText: "Shows 4 / total products in the selected collection.",
          defaultValue: true,
        },
      ],
    },
  ],
});
