import type { Image as ShopifyImage } from "@shopify/hydrogen/storefront-api-types";
import {
  type ComponentLoaderArgs,
  createSchema,
  IMAGES_PLACEHOLDERS,
  type WeaverseCollection,
} from "@weaverse/hydrogen";
import type { RefObject } from "react";
import { Image } from "~/components/image";
import { Link } from "~/components/link";
import { Section, type SectionProps } from "~/components/section";
import { COLLECTIONS_QUERY, type CollectionNode } from "~/sections/collections";

interface PromotionGridData {
  firstCollection?: WeaverseCollection;
  secondCollection?: WeaverseCollection;
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
  const { loaderData, buttonText, children, ...rest } = props;
  const collections = PLACEHOLDERS.map(
    (placeholder, index) => loaderData?.collections[index] ?? placeholder,
  );

  return (
    <Section
      ref={ref}
      {...rest}
      containerClassName="grid grid-cols-1 gap-6 px-5 py-10 md:grid-cols-2 md:px-6 lg:px-10 lg:py-20"
    >
      {collections.map((collection) => (
        <Link
          key={collection.id}
          to={`/collections/${collection.handle}`}
          aria-label={`View ${collection.title} collection`}
          className="group relative aspect-video min-w-0 overflow-hidden rounded-sm bg-background-subtle-2 text-text-inverse"
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
          <div className="absolute inset-0 flex flex-col items-start justify-between p-6 md:p-9">
            <h3 className="max-w-sm font-heading text-3xl font-normal leading-tight md:text-4xl">
              {collection.title}
            </h3>
            <span className="border-b border-current pb-1 text-sm font-medium">
              {buttonText || "Shop collection"}
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
          name: "buttonText",
          label: "Button text",
          defaultValue: "Shop collection",
        },
      ],
    },
  ],
  presets: {
    buttonText: "Shop collection",
    width: "full",
    verticalPadding: "none",
  },
});
