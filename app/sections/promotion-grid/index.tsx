import type { Image as ShopifyImage } from "@shopify/hydrogen/storefront-api-types";
import {
  type ComponentLoaderArgs,
  createSchema,
  IMAGES_PLACEHOLDERS,
  useTranslation,
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
  const selectedIds = [data?.firstCollection, data?.secondCollection].map(
    (collection) =>
      collection?.id ? `gid://shopify/Collection/${collection.id}` : null,
  );
  const ids = selectedIds.filter((id): id is string => Boolean(id));

  if (ids.length === 0) {
    return { collections: [null, null] };
  }

  const { country, language } = weaverse.storefront.i18n;
  const { nodes } = await weaverse.storefront.query<{
    nodes: Array<CollectionNode | null>;
  }>(COLLECTIONS_QUERY, {
    variables: { country, language, ids },
  });

  const collectionsById = new Map(
    nodes
      .filter((node): node is CollectionNode => Boolean(node))
      .map((node) => [node.id, node]),
  );

  return {
    collections: selectedIds.map((id) =>
      id ? (collectionsById.get(id) ?? null) : null,
    ),
  };
};

type PromotionGridLoaderData = Awaited<ReturnType<typeof loader>>;

const PLACEHOLDERS: CollectionNode[] = [
  {
    id: "gid://shopify/Collection/promotion-placeholder-1",
    title: "Collection title",
    handle: "",
    image: {
      altText: "Collection image placeholder",
      width: 1600,
      height: 900,
      url: IMAGES_PLACEHOLDERS.collection_1,
    } as Partial<ShopifyImage>,
  },
  {
    id: "gid://shopify/Collection/promotion-placeholder-2",
    title: "Collection title",
    handle: "",
    image: {
      altText: "Collection image placeholder",
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
  const { t } = useTranslation();
  const {
    loaderData,
    firstCollection: _firstCollection,
    secondCollection: _secondCollection,
    firstHeading,
    secondHeading,
    buttonText,
    children,
    ...rest
  } = props;
  const loadedCollections = loaderData?.collections ?? [];
  const collections = PLACEHOLDERS.map(
    (placeholder, index) => loadedCollections[index] ?? placeholder,
  );
  const headings = [
    firstHeading ?? "Promotion heading",
    secondHeading ?? "Promotion heading",
  ];

  return (
    <Section
      ref={ref}
      {...rest}
      containerClassName="grid grid-cols-1 gap-6 px-5 py-10 md:grid-cols-2 md:px-6 lg:gap-5 lg:px-10 lg:py-20"
    >
      {collections.map((collection, index) => (
        <Link
          key={`${collection.id}-${index}`}
          to={collection.handle ? `/collections/${collection.handle}` : "#"}
          aria-label={t("navigation.viewCollection", {
            collection: collection.title,
          })}
          className="group relative aspect-video min-w-0 overflow-hidden rounded-2xl bg-background-subtle-2 text-text-inverse"
          data-motion="fade-up"
        >
          <Image
            data={collection.image ?? PLACEHOLDERS[index].image}
            sizes="(min-width: 49.125em) 50vw, 100vw"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/30" />
          <div className="absolute inset-0 flex flex-col items-start justify-end p-6 md:p-9">
            <p className="text-center font-heading text-xl leading-[150%] font-normal tracking-[-0.2px] text-text-inverse">
              {collection.title}
            </p>
            <h4 className="mt-1 max-w-sm text-center">{headings[index]}</h4>
            <span
              className={cn(
                buttonVariants({
                  variant: "secondary",
                  shape: "default",
                }),
                "mt-5 rounded-xl px-6 py-3.5 font-body text-base leading-[160%] tracking-[-0.16px]",
              )}
            >
              {buttonText ?? "Explore collection"}
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
          defaultValue: "Promotion heading",
        },
        {
          type: "text",
          name: "secondHeading",
          label: "Second heading",
          defaultValue: "Promotion heading",
        },
        {
          type: "text",
          name: "buttonText",
          label: "Button text",
          defaultValue: "Explore collection",
        },
      ],
    },
  ],
  presets: {
    firstHeading: "Promotion heading",
    secondHeading: "Promotion heading",
    buttonText: "Explore collection",
    width: "full",
    verticalPadding: "none",
  },
});
