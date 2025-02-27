import { Image } from "~/components/image";
import type { Collection } from "@shopify/hydrogen/storefront-api-types";
import { useThemeSettings } from "@weaverse/hydrogen";
import { CSSProperties } from "react";
import { Link } from "~/components/Link";

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
    `#${[...Array(3)]
      .map((_, i) =>
        Math.max(
          0,
          parseInt(hex.slice(1 + i * 2, 3 + i * 2), 16) - [177, 166, 223][i]
        )
          .toString(16)
          .padStart(2, "0")
      )
      .join("")}`;

  let style: CSSProperties = {
    "--calculate-color": calculateColor(colorBackground),
  } as CSSProperties;
  return (
    <Link
      to={`/collections/${collection.handle}`}
      className="grid gap-4 group relative rounded"
      style={style}
      data-motion="slide-in"
    >
      <div
        className="w-full h-full flex justify-center items-center rounded"
      >
        <div className="card-image bg-primary/5 w-full h-full rounded">
          {collection?.image && (
            <Image
              data={collection.image}
              width={collection.image.width || 600}
              height={collection.image.height || 400}
              aspectRatio={imageAspectRatio}
              sizes="(max-width: 32em) 100vw, 45vw"
              loading={loading}
              className="w-full h-full object-cover rounded"
            />
          )}
        </div>
      </div>
      <div className="absolute inset-0 justify-center items-center z-10 flex rounded">
        <h3 className="group-hover:underline text-white font-medium">
          {collection.title}
        </h3>
      </div>
      <div className="absolute inset-0 group-hover:opacity-50 opacity-30 bg-[var(--calculate-color)] transition-opacity duration-500 rounded" />
    </Link>
  );
}
