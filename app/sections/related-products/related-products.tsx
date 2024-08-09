import {Await, useLoaderData} from '@remix-run/react';
import type {
  HydrogenComponentProps,
  HydrogenComponentSchema,
} from '@weaverse/hydrogen';
import {Suspense, forwardRef} from 'react';
import type {ProductCardFragment} from 'storefrontapi.generated';
import { Skeleton} from '~/components/Skeleton';
import {ProductSwimlane} from '~/components/ProductSwimlane';

interface RelatedProductsProps extends HydrogenComponentProps {
  productsCount: number;
}

let RelatedProduct = forwardRef<HTMLDivElement, RelatedProductsProps>(
  (props, ref) => {
    let {recommended} = useLoaderData<{
      recommended: {nodes: ProductCardFragment[]};
    }>();
    let { productsCount, ...rest} = props;
    if (recommended) {
      return (
        <div ref={ref} {...rest}>
          <Suspense fallback={<Skeleton className="h-32" />}>
            <Await
              errorElement="There was a problem loading related products"
              resolve={recommended}
            >
              {(products) => (
                <ProductSwimlane
                  count={productsCount}
                  featuredProducts={products}
                />
              )}
            </Await>
          </Suspense>
        </div>
      );
    }
    return <section ref={ref} {...rest} />;
  },
);

export default RelatedProduct;

export let schema: HydrogenComponentSchema = {
  type: 'related-products--list',
  title: 'Related products list',
  limit: 1,
  inspector: [
    {
      group: 'Related products',
      inputs: [
        {
          type: 'range',
          name: 'productsCount',
          label: 'Number of products',
          defaultValue: 12,
          configs: {
            min: 1,
            max: 12,
            step: 1,
          },
        },
      ],
    },
  ],
  toolbar: ['general-settings', ['duplicate', 'delete']],
};
