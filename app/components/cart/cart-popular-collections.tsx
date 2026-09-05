import type { Collection } from "@shopify/hydrogen/storefront-api-types";
import { useThemeSettings } from "@weaverse/hydrogen";
import { type CSSProperties, useEffect } from "react";
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
  let { load, data } = useFetcher<CollectionResponse>();
  let productsApiPath = usePrefixPathWithLocale(`/api/collections`);
  useEffect(() => {
    load(productsApiPath);
  }, [load, productsApiPath]);
  if (!data) {
    return null;
  }
  let { collections } = data;
  let nodes = collections.nodes.slice(0, layout === "aside" ? 4 : 6);

  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        layout === "aside" ? "mt-8 overflow-auto" : "mt-16",
      )}
    >
      <h5>Popular collections</h5>
      <Grid
        items={layout === "aside" ? 2 : 3}
        data-test="collection-grid"
        className=" w-full"
      >
        {nodes.map((collection: any, i: any) => (
          <PopularCard
            key={collection.id}
            collection={collection as Collection}
            imageAspectRatio={"1/1"}
            loading={getImageLoadingPriority(i, 2)}
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
  let settings = useThemeSettings();
  let { colorBackground } = settings;
  const calculateColor = (hex: string) =>
    `#${[...new Array(3)]
      .map((_, i) =>
        Math.max(
          0,
          Number.parseInt(hex.slice(1 + i * 2, 3 + i * 2), 16) -
            [177, 166, 223][i],
        )
          .toString(16)
          .padStart(2, "0"),
      )
      .join("")}`;

  let style: CSSProperties = {
    "--calculate-color": calculateColor(colorBackground),
  } as CSSProperties;
  return (
    <Link
      to={`/collections/${collection.handle}`}
      className="group relative grid gap-4 rounded-md"
      style={style}
      data-motion="slide-in"
    >
      <div className="flex h-full w-full items-center justify-center rounded-md">
        <div className="card-image h-full w-full rounded-md bg-primary/5">
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
        <h3
          className="text-white font-medium text-animation"
          style={
            {
              "--underline-color": "#ffffff",
              "--underline-size": "3px",
            } as React.CSSProperties
          }
        >
          {collection.title}
        </h3>
      </div>
      <div className="absolute inset-0 rounded-md bg-(--calculate-color) opacity-30 transition-opacity duration-500 group-hover:opacity-50" />
    </Link>
  );
}
