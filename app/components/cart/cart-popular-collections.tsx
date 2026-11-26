import type { Collection } from "@shopify/hydrogen/storefront-api-types";
import { useTranslation } from "@weaverse/hydrogen";
import { useEffect, useRef } from "react";
import { useFetcher } from "react-router";
import { Image } from "~/components/image";
import { cn } from "~/utils/cn";
import { getImageLoadingPriority } from "~/utils/image";
import { usePrefixPathWithLocale } from "~/utils/locale";
import { Grid } from "../grid";
import { Link } from "../link";

type CollectionResponse = {
  collections: {
    nodes: Collection[];
  };
};

export function CartPopularCollections({ layout }: { layout?: string }) {
  const { t } = useTranslation();
  let { load, data, state } = useFetcher<CollectionResponse>();
  let productsApiPath = usePrefixPathWithLocale(`/api/collections`);
  const loadedPath = useRef<string | null>(null);
  useEffect(() => {
    if (loadedPath.current === productsApiPath) {
      return;
    }
    loadedPath.current = productsApiPath;
    load(productsApiPath);
  }, [load, productsApiPath]);
  const itemCount = layout === "aside" ? 4 : 6;
  const nodes = data?.collections.nodes.slice(0, itemCount);
  const isLoading =
    !data && (state !== "idle" || loadedPath.current !== productsApiPath);

  if (!(data || isLoading)) {
    return null;
  }

  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        layout === "aside" ? "mt-8 overflow-auto" : "mt-16",
      )}
    >
      <h5>{t("cart.popularCollections")}</h5>
      <Grid
        items={layout === "aside" ? 2 : 3}
        data-test="collection-grid"
        className="w-full"
        aria-busy={isLoading}
      >
        {nodes
          ? nodes.map((collection, index) => (
              <PopularCard
                key={collection.id}
                collection={collection}
                imageAspectRatio="1/1"
                loading={getImageLoadingPriority(index, 2)}
              />
            ))
          : Array.from({ length: itemCount }, (_, index) => (
              <div
                key={`popular-collection-placeholder-${index}`}
                className="aspect-square rounded-md bg-background-subtle-1"
                aria-hidden="true"
              />
            ))}
      </Grid>
    </div>
  );
}

function PopularCard({
  collection,
  imageAspectRatio,
  loading,
}: {
  collection: Collection;
  imageAspectRatio: string;
  loading?: HTMLImageElement["loading"];
}) {
  return (
    <Link
      to={`/collections/${collection.handle}`}
      className="group relative grid gap-4 rounded-md"
      data-motion="slide-in"
    >
      <div className="flex h-full w-full items-center justify-center rounded-md">
        <div className="card-image h-full w-full rounded-md bg-background-subtle-1">
          {collection?.image && (
            <Image
              data={collection.image}
              width={collection.image.width || 600}
              height={collection.image.height || 400}
              aspectRatio={imageAspectRatio}
              sizes="(max-width: 32em) 100vw, 45vw"
              loading={loading}
              className="h-full w-full rounded-md object-cover"
            />
          )}
        </div>
      </div>
      <div className="absolute inset-0 z-10 flex items-center justify-center rounded-md">
        <h3 className="text-center font-heading text-[26px] leading-[110%] font-normal text-text-inverse group-hover:underline">
          {collection.title}
        </h3>
      </div>
      <div className="absolute inset-0 rounded-md bg-[#453830]/30 transition-colors duration-500 group-hover:bg-[#453830]/50" />
    </Link>
  );
}
