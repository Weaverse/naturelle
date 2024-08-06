import {useLoaderData} from '@remix-run/react';
import {Pagination} from '@shopify/hydrogen';
import type {Filter} from '@shopify/hydrogen/storefront-api-types';
import type {
  HydrogenComponentSchema,
} from '@weaverse/hydrogen';
import {Button} from '~/components/Button';
import {DrawerFilter} from '~/components/DrawerFilter';
import type {AppliedFilter} from '~/lib/filter';
import {forwardRef} from 'react';
import {useInView} from 'react-intersection-observer';
import type {CollectionDetailsQuery} from 'storefrontapi.generated';
import {layoutInputs, Section, SectionProps} from '../atoms/Section';
import {ProductsLoadedOnScroll} from './products-loaded-on-scroll';

type CollectionFiltersProps = SectionProps;

let CollectionFilters = forwardRef<HTMLElement, CollectionFiltersProps>(
  (props, sectionRef) => {
    let {children, ...rest} = props;
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
        <Section ref={sectionRef} {...rest}>
          <DrawerFilter
            productNumber={productNumber}
            filters={collection.products.filters as Filter[]}
            appliedFilters={appliedFilters}
            collections={collections}
          />
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
                    {isLoading ? 'Loading...' : 'Load previous'}
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
                    {isLoading ? 'Loading...' : 'Load more products'}
                  </Button>
                </div>
              </>
            )}
          </Pagination>
        </Section>
      );
    }
    return <section ref={ref} {...rest} />;
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
      inputs: layoutInputs.filter(
        ({name}) => name !== 'divider' && name !== 'borderRadius',
      ),
    },
  ],
};
