import type { Collection } from '@shopify/hydrogen/storefront-api-types';
import {useNavigate} from '@remix-run/react';
import {useEffect} from 'react';
import {Grid} from '~/components/Grid';
import {CollectionCard} from './collection-card';
import {getImageLoadingPriority} from '~/lib/const';

type CollectionsLoadedOnScrollProps = {
  nodes: any;
  collectionsPerRow: number;
  lazyLoadImage: boolean;
  inView: boolean;
  nextPageUrl: string;
  hasNextPage: boolean;
  state: any;
};

export function CollectionsLoadedOnScroll(props: CollectionsLoadedOnScrollProps) {
  let {nodes, collectionsPerRow, lazyLoadImage, inView, nextPageUrl, hasNextPage, state} = props;
  let navigate = useNavigate();

  useEffect(() => {
    if (inView && hasNextPage) {
      navigate(nextPageUrl, {
        replace: true,
        preventScrollReset: true,
        state,
      });
    }
  }, [inView, navigate, state, nextPageUrl, hasNextPage]);

  return (
    <Grid
      items={collectionsPerRow}
      data-test="collection-grid"
      className=" w-full"
    >
      {nodes.map((collection: any, i: any) => (
        <CollectionCard
          key={collection.id}
          collection={collection as Collection}
          imageAspectRatio={'1/1'}
          loading={lazyLoadImage ? getImageLoadingPriority(i, 2) : undefined}
        />
      ))}
    </Grid>
  );
}
