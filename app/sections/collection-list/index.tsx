import { useLoaderData } from '@remix-run/react';
import { Pagination } from '@shopify/hydrogen';
import type {
  HydrogenComponentProps,
  HydrogenComponentSchema,
} from '@weaverse/hydrogen';
import { forwardRef, CSSProperties, Children } from 'react';
import type { StoreCollectionsQuery } from 'storefrontapi.generated';
import { Section } from '~/components/Text';
import { Button } from '@/components/button';
import { CollectionsLoadedOnScroll } from './collection-loader-on-scroll';
import { useInView } from 'react-intersection-observer';
import clsx from 'clsx';

type Alignment = 'left' | 'center' | 'right';
interface CollectionListProps extends HydrogenComponentProps {
  textColor: string;
  contentAlignment: Alignment;
  collectionsPerRow: number;
  topPadding: number;
  bottomPadding: number;
  lazyLoadImage: boolean;
}

let alignmentClasses: Record<Alignment, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
};

let CollectionList = forwardRef<HTMLElement, CollectionListProps>(
  (props, sectionRef) => {
    let {ref, inView} = useInView();
    let { collections } = useLoaderData<StoreCollectionsQuery>();
    let { textColor, contentAlignment, collectionsPerRow, topPadding, bottomPadding, lazyLoadImage, children, ...rest } =
      props;
    let contentStyle: CSSProperties = {
      '--top-padding': `${topPadding}px`,
      '--bottom-padding': `${bottomPadding}px`,
      color: textColor,
    } as CSSProperties;
    return (
      <section ref={sectionRef} {...rest} style={contentStyle} 
        className={clsx('w-full flex justify-center items-center',
          alignmentClasses[contentAlignment!],
        )}>
        <div className='max-w-[1440px] pt-[var(--top-padding)] pb-[var(--bottom-padding)]'>
        {!!Children.count(children) && (
            <div className='p-6 md:p-8 lg:p-12'>
              {children}
            </div>
          )}
          <Section as="div">
            <Pagination connection={collections}>
              {({ nodes, isLoading, PreviousLink, NextLink, nextPageUrl, hasNextPage, state, }) => (
                <>
                  <div className="flex items-center justify-center mb-6">
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
                  <div className="flex items-center justify-center mt-6">
                    <Button ref={ref} as={NextLink} variant="outline">
                      {isLoading ? 'Loading...' : 'Next collections'}
                    </Button>
                  </div>
                </>
              )}
            </Pagination>
          </Section>
        </div>
      </section>
    );
  },
);

export default CollectionList;

export let schema: HydrogenComponentSchema = {
  type: 'collection-list',
  title: 'Collection list',
  limit: 1,
  enabledOn: {
    pages: ['COLLECTION_LIST'],
  },
  toolbar: ['general-settings'],
  inspector: [
    {
      group: 'Collection list',
      inputs: [
        {
          type: 'color',
          name: 'textColor',
          label: 'Text color',
        },
        {
          type: 'toggle-group',
          label: 'Content alignment',
          name: 'contentAlignment',
          configs: {
            options: [
              { label: 'Left', value: 'left' },
              { label: 'Center', value: 'center' },
              { label: 'Right', value: 'right' },
            ],
          },
          defaultValue: 'left',
        },
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
          type: 'range',
          name: 'topPadding',
          label: 'Top padding',
          defaultValue: 0,
          configs: {
            min: 0,
            max: 100,
            step: 1,
          },
        },
        {
          type: 'range',
          name: 'bottomPadding',
          label: 'Bottom padding',
          defaultValue: 0,
          configs: {
            min: 0,
            max: 100,
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
  childTypes: ['heading'],
  presets: {
      children: [
           {
              type: 'heading',
              content: "Collections",
          },
      ],
  },
};
