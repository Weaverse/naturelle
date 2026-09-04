import type { Image as ShopifyImage } from "@shopify/hydrogen/storefront-api-types";
import {
  type ComponentLoaderArgs,
  createSchema,
  IMAGES_PLACEHOLDERS,
  type WeaverseCollection,
} from "@weaverse/hydrogen";
import type { RefObject } from "react";
import { buttonVariants } from "~/components/button";
import { Image } from "~/components/image";
import { Link } from "~/components/link";
import { Section, type SectionProps } from "~/components/section";
import { COLLECTIONS_QUERY, type CollectionNode } from "~/sections/collections";
import { cn } from "~/utils/cn";

interface PromotionGridData {
  firstCollection?: WeaverseCollection;
  secondCollection?: WeaverseCollection;
  firstHeading?: string;
  secondHeading?: string;
  buttonText?: string;
}

interface PromotionGridProps
  extends SectionProps<PromotionGridLoaderData>,
    PromotionGridData {}

export const loader = async ({
  data,
  weaverse,
}: ComponentLoaderArgs<PromotionGridData>) => {
  const ids = [data?.firstCollection, data?.secondCollection]
    .filter((collection): collection is WeaverseCollection =>
      Boolean(collection),
    )
    .map((collection) => `gid://shopify/Collection/${collection.id}`);

  if (ids.length === 0) {
    return { collections: [] };
  }

  const { country, language } = weaverse.storefront.i18n;
  const { nodes } = await weaverse.storefront.query<{
    nodes: Array<CollectionNode | null>;
  }>(COLLECTIONS_QUERY, {
    variables: { country, language, ids },
  });

  return {
    collections: nodes.filter((node): node is CollectionNode => Boolean(node)),
  };
};

type PromotionGridLoaderData = Awaited<ReturnType<typeof loader>>;

const PLACEHOLDERS: CollectionNode[] = [
  {
    id: "gid://shopify/Collection/promotion-placeholder-1",
    title: "The Ritual Collection",
    handle: "all",
    image: {
      altText: "The Ritual Collection",
      width: 1600,
      height: 900,
      url: IMAGES_PLACEHOLDERS.collection_1,
    } as Partial<ShopifyImage>,
  },
  {
    id: "gid://shopify/Collection/promotion-placeholder-2",
    title: "The Essentials Collection",
    handle: "all",
    image: {
      altText: "The Essentials Collection",
      width: 1600,
      height: 900,
      url: IMAGES_PLACEHOLDERS.collection_2,
    } as Partial<ShopifyImage>,
  },
];

export default function PromotionGrid({
  ref,
  ...props
}: PromotionGridProps & { ref?: RefObject<HTMLElement | null> }) {
  const {
    loaderData,
    firstHeading,
    secondHeading,
    buttonText,
    children,
    ...rest
  } = props;
  const collections = PLACEHOLDERS.map(
    (placeholder, index) => loaderData?.collections[index] ?? placeholder,
  );
  const headings = [
    firstHeading ?? "Glow from within",
    secondHeading ?? "Your best skin awaits",
  ];

  return (
    <Section
      ref={ref}
      {...rest}
      containerClassName="grid grid-cols-1 gap-6 px-5 py-10 md:grid-cols-2 md:px-6 lg:px-10 lg:py-20"
    >
      {collections.map((collection, index) => (
        <Link
          key={collection.id}
          to={`/collections/${collection.handle}`}
          aria-label={`View ${collection.title} collection`}
          className="group relative aspect-video min-w-0 overflow-hidden rounded-xl bg-background-subtle-2 text-text-inverse"
          data-motion="fade-up"
        >
          {collection.image && (
            <Image
              data={collection.image}
              sizes="(min-width: 49.125em) 50vw, 100vw"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          )}
          <div className="absolute inset-0 bg-black/30" />
          <div className="absolute inset-0 flex flex-col items-start justify-end p-6 md:p-9">
            <p className="text-sm font-normal leading-normal">
              {collection.title}
            </p>
            <h3 className="mt-1 max-w-sm font-heading text-3xl font-normal leading-tight md:text-4xl">
              {headings[index]}
            </h3>
            <span
              className={cn(
                buttonVariants({
                  variant: "secondary",
                  size: "sm",
                  shape: "default",
                }),
                "mt-5 px-5",
              )}
            >
              {buttonText ?? "Explore Now"}
            </span>
          </div>
        </Link>
      ))}
      {children}
    </Section>
  );
}

export const schema = createSchema({
  type: "promotion-grid",
  title: "Promotion grid",
  settings: [
    {
      group: "Collections",
      inputs: [
        {
          type: "collection",
          name: "firstCollection",
          label: "First collection",
        },
        {
          type: "collection",
          name: "secondCollection",
          label: "Second collection",
        },
        {
          type: "text",
          name: "firstHeading",
          label: "First heading",
          defaultValue: "Glow from within",
        },
        {
          type: "text",
          name: "secondHeading",
          label: "Second heading",
          defaultValue: "Your best skin awaits",
        },
        {
          type: "text",
          name: "buttonText",
          label: "Button text",
          defaultValue: "Explore Now",
        },
      ],
    },
  ],
  presets: {
    firstHeading: "Glow from within",
    secondHeading: "Your best skin awaits",
    buttonText: "Explore Now",
    width: "full",
    verticalPadding: "none",
  },
});
