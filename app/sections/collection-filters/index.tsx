import {useLoaderData} from '@remix-run/react';
import {Pagination} from '@shopify/hydrogen';
import type {Filter} from '@shopify/hydrogen/storefront-api-types';
import type {
  HydrogenComponentProps,
  HydrogenComponentSchema,
} from '@weaverse/hydrogen';
import {Button} from '~/components/Button';
import {DrawerFilter} from '~/components/DrawerFilter';
import {Section} from '~/components/Text';
import type {AppliedFilter} from '~/lib/filter';
import {forwardRef} from 'react';
import {useInView} from 'react-intersection-observer';
import type {CollectionDetailsQuery} from 'storefrontapi.generated';
import {ProductsLoadedOnScroll} from './products-loaded-on-scroll';

interface CollectionFiltersProps extends HydrogenComponentProps {
  showCollectionDescription: boolean;
  loadPrevText: string;
  loadMoreText: string;
}

let CollectionFilters = forwardRef<HTMLElement, CollectionFiltersProps>(
  (props, sectionRef) => {
    let {showCollectionDescription, loadPrevText, loadMoreText, ...rest} =
      props;

    let {ref, inView} = useInView();
    let {collection, collections, appliedFilters} = useLoaderData<
      CollectionDetailsQuery & {
        collections: Array<{handle: string; title: string}>;
        appliedFilters: AppliedFilter[];
      }
    >();

    let productNumber = collection?.products.nodes.length;

    if (collection?.products && collections) {
      return (
        <section ref={sectionRef} {...rest}>
          <DrawerFilter
            productNumber={productNumber}
            filters={collection.products.filters as Filter[]}
            appliedFilters={appliedFilters}
            collections={collections}
          />
          <div className="px-4 md:px-6 container">
            <Pagination connection={collection.products}>
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
                  <div className="my-6 flex w-full items-center justify-center">
                    <Button as={PreviousLink} variant="secondary">
                      {isLoading ? 'Loading...' : 'Previous'}
                    </Button>
                  </div>
                  <ProductsLoadedOnScroll
                    nodes={nodes}
                    inView={inView}
                    nextPageUrl={nextPageUrl}
                    hasNextPage={hasNextPage}
                    state={state}
                  />
                  <div className="my-6 flex w-full items-center justify-center">
                    <Button as={NextLink} variant="secondary">
                      {isLoading ? 'Loading...' : loadMoreText}
                    </Button>
                  </div>
                </>
              )}
            </Pagination>
          </div>
        </section>
      );
    }
    return <section ref={sectionRef} {...rest} />;
  },
);

export default CollectionFilters;

export let schema: HydrogenComponentSchema = {
  type: 'collection-filters',
  title: 'Collection filters',
  limit: 1,
  enabledOn: {
    pages: ['COLLECTION'],
  },
  toolbar: ['general-settings'],
  inspector: [
    {
      group: 'Collection filters',
      inputs: [
        {
          type: 'switch',
          name: 'showCollectionDescription',
          label: 'Show collection description',
          defaultValue: true,
        },
        {
          type: 'text',
          name: 'loadPrevText',
          label: 'Load previous text',
          defaultValue: 'Load previous',
          placeholder: 'Load previous',
        },
        {
          type: 'text',
          name: 'loadMoreText',
          label: 'Load more text',
          defaultValue: 'Load more products',
          placeholder: 'Load more products',
        },
      ],
    },
  ],
};
