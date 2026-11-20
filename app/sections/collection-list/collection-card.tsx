import type { Collection } from "@shopify/hydrogen/storefront-api-types";
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
  return (
    <Link
      to={`/collections/${collection.handle}`}
      className="group relative grid gap-4 overflow-hidden rounded-2xl bg-background-subtle-1"
      data-motion="slide-in"
    >
      <div className="flex h-full w-full items-center justify-center">
        <div className="card-image h-full w-full bg-background-subtle-1">
          {collection?.image && (
            <Image
              data={collection.image}
              width={collection.image.width || 600}
              height={collection.image.height || 400}
              aspectRatio={imageAspectRatio}
              sizes="(max-width: 32em) 100vw, 45vw"
              loading={loading}
              className="h-full w-full object-cover"
            />
          )}
        </div>
      </div>
      <div className="absolute inset-0 z-10 flex items-center justify-center">
        <h6 className="text-center font-heading text-[26px] leading-[110%] font-normal text-text-inverse group-hover:underline">
          {collection.title}
        </h6>
      </div>
      <div className="absolute inset-0 bg-(--collection-card-overlay) transition-colors duration-500 group-hover:bg-(--collection-card-overlay-hover)" />
    </Link>
  );
}
