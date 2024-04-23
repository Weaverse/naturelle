import { Image } from '@shopify/hydrogen';
import type { Collection } from '@shopify/hydrogen/storefront-api-types';
import { Heading } from '~/components/Text';
import { Link } from '~/components/Link';

export function CollectionCard({
  collection,
  imageAspectRatio,
  loading,
}: {
  collection: Collection;
  imageAspectRatio: string;
  loading?: HTMLImageElement['loading'];
}) {
  return (
    <Link to={`/collections/${collection.handle}`} className="grid gap-4 group relative">
      <div className='w-full h-full flex justify-center items-center'>
        <div className="card-image bg-primary/5 w-full h-full">
          {collection?.image && (
            <Image
              data={collection.image}
              width={collection.image.width || 600}
              height={collection.image.height || 400}
              aspectRatio={imageAspectRatio}
              sizes="(max-width: 32em) 100vw, 45vw"
              loading={loading}
              className='w-full h-full object-cover'
            />
          )}
        </div>
      </div>
      <div className='absolute inset-0 group-hover:bg-foreground group-hover:opacity-30 opacity-0 transition-colors duration-300'/>
    </Link>
  );
}
