import { useLoaderData } from '@remix-run/react';
import { Pagination } from '@shopify/hydrogen';
import type { Collection } from '@shopify/hydrogen/storefront-api-types';
import type {
  HydrogenComponentProps,
  HydrogenComponentSchema,
} from '@weaverse/hydrogen';
import { forwardRef, CSSProperties } from 'react';
import type { CollectionsQuery } from 'storefrontapi.generated';
import { Section } from '~/components/Text';
import { Grid } from '~/components/Grid';
import { getImageLoadingPriority } from '~/lib/const';
import { CollectionCard } from './collection-card';
import { Button } from '@/components/ui/button';

interface CollectionListProps extends HydrogenComponentProps {
  textColor: string;
  heading: string;
  contentAlignment: string;
  imageAspectRatio: string;
  collectionsPerRow: number;
  topPadding: number;
  bottomPadding: number;
  lazyLoadImage: boolean;
}

let CollectionList = forwardRef<HTMLElement, CollectionListProps>(
  (props, ref) => {
    let { collections } = useLoaderData<CollectionsQuery>();
    let { textColor, heading, contentAlignment, collectionsPerRow, topPadding, bottomPadding, lazyLoadImage, imageAspectRatio, ...rest } =
      props;
    let contentStyle: CSSProperties = {
      textAlign: contentAlignment,
      '--top-padding': `${topPadding}px`,
      '--bottom-padding': `${bottomPadding}px`,
      color: textColor,
    } as CSSProperties;
    return (
      <section ref={ref} {...rest} style={contentStyle} className='w-full flex justify-center items-center'>
        <div className='max-w-[1440px] pt-[var(--top-padding)] pb-[var(--bottom-padding)]'>
          {heading && <div className='px-6 md:px-8 lg:px-12'>
            <h2 className='font-medium pt-10'>{heading}</h2>
          </div>}
          <Section as="div">
            <Pagination connection={collections}>
              {({ nodes, isLoading, PreviousLink, NextLink }) => (
                <>
                  <div className="flex items-center justify-center mb-6">
                    <Button as={PreviousLink} variant="outline">
                      {isLoading ? 'Loading...' : 'Previous collections'}
                    </Button>
                  </div>
                  <Grid
                    items={collectionsPerRow}
                    data-test="collection-grid"
                  >
                    {nodes.map((collection, i) => (
                      <CollectionCard
                        key={collection.id}
                        collection={collection as Collection}
                        imageAspectRatio={imageAspectRatio}
                        loading={lazyLoadImage ? getImageLoadingPriority(i, 2) : undefined}
                      />
                    ))}
                  </Grid>
                  <div className="flex items-center justify-center mt-6">
                    <Button as={NextLink} variant="outline">
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
          type: 'text',
          name: 'heading',
          label: 'Heading',
          defaultValue: 'Collections',
          placeholder: 'Collections',
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
    {
      group: 'Collection card',
      inputs: [
        {
          type: 'select',
          label: 'Image aspect ratio',
          name: 'imageAspectRatio',
          configs: {
            options: [
              { value: 'auto', label: 'Adapt to image' },
              { value: '1/1', label: '1/1' },
              { value: '3/4', label: '3/4' },
              { value: '4/3', label: '4/3' },
              { value: '6/4', label: '6/4' },
            ],
          },
          defaultValue: 'auto',
        },
      ],
    },
  ],
};
