import type { Collection } from "@shopify/hydrogen/storefront-api-types";
import { useThemeSettings } from "@weaverse/hydrogen";
import type { CSSProperties } from "react";
import { Image } from "~/components/image";
import { Link } from "~/components/link";

export function CollectionCard({
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
        <h3 className="group-hover:underline text-white font-medium">
          {collection.title}
        </h3>
      </div>
      <div className="absolute inset-0 rounded-md bg-[var(--calculate-color)] opacity-30 transition-opacity duration-500 group-hover:opacity-50" />
    </Link>
  );
}
