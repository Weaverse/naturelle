import {Button} from '@/components/button';
import {useLoaderData} from '@remix-run/react';
import {Pagination} from '@shopify/hydrogen';
import type {
  HydrogenComponentProps,
  HydrogenComponentSchema,
} from '@weaverse/hydrogen';
import { forwardRef} from 'react';
import {useInView} from 'react-intersection-observer';
import type {StoreCollectionsQuery} from 'storefrontapi.generated';
import {CollectionsLoadedOnScroll} from './collection-loader-on-scroll';

interface CollectionListProps extends HydrogenComponentProps {
  collectionsPerRow: number;
  lazyLoadImage: boolean;
}

let CollectionListItem = forwardRef<HTMLDivElement, CollectionListProps>(
  (props, sectionRef) => {
    let {ref, inView} = useInView();
    let {collections} = useLoaderData<StoreCollectionsQuery>();
    let {collectionsPerRow, lazyLoadImage, children, ...rest} = props;
    return (
      <div ref={sectionRef} {...rest}>
        <Pagination connection={collections}>
          {({
            nodes,
            isLoading,
            PreviousLink,
            NextLink,
            nextPageUrl,
            hasNextPage,
            state,
          }) => (
            <>
              <div className="mb-6 flex items-center justify-center">
                <Button as={PreviousLink} variant="outline">
                  {isLoading ? 'Loading...' : 'Previous collections'}
                </Button>
              </div>
              <CollectionsLoadedOnScroll
                nodes={nodes}
                collectionsPerRow={collectionsPerRow}
                lazyLoadImage={lazyLoadImage}
                inView={inView}
                nextPageUrl={nextPageUrl}
                hasNextPage={hasNextPage}
                state={state}
              />
              <div className="mt-6 flex items-center justify-center">
                <Button ref={ref} as={NextLink} variant="outline">
                  {isLoading ? 'Loading...' : 'Next collections'}
                </Button>
              </div>
            </>
          )}
        </Pagination>
      </div>
    );
  },
);

export default CollectionListItem;

export let schema: HydrogenComponentSchema = {
  type: 'collection-list--item',
  title: 'Collection list',
  limit: 1,
  toolbar: ['general-settings'],
  inspector: [
    {
      group: 'Collection list',
      inputs: [
        {
          type: 'range',
          name: 'collectionsPerRow',
          label: 'Collections per row',
          defaultValue: 3,
          configs: {
            min: 1,
            max: 4,
            step: 1,
          },
        },
        {
          type: 'switch',
          name: 'lazyLoadImage',
          label: 'Lazy load image',
          defaultValue: true,
        },
      ],
    },
  ],
};
