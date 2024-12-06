import {Image} from '@shopify/hydrogen';
import type {
  ComponentLoaderArgs,
  HydrogenComponentProps,
  HydrogenComponentSchema,
  WeaverseImage,
  WeaverseProduct,
} from '@weaverse/hydrogen';
import {IconImageBlank} from '~/components/Icon';
import {Link} from '~/components/Link';
import {CSSProperties, forwardRef} from 'react';

interface ProductPlacementItemProps extends HydrogenComponentProps {
  image: WeaverseImage;
  product?: WeaverseProduct;
}

const ProductPlacementItem = forwardRef<
  HTMLDivElement,
  ProductPlacementItemProps
>((props, ref) => {
  let {image, product, ...rest} = props;
  let contentStyle: CSSProperties = {} as CSSProperties;
  return (
    <div data-motion="slide-in" ref={ref} {...rest} style={contentStyle} className="h-full w-full">
      {image ? (
        <div className="relative h-full w-full">
          <Image
            data={image}
            sizes="auto"
            className="!aspect-[var(--item-thumbs-ratio)] !h-full !w-full cursor-pointer object-cover"
            loading='lazy'
          />
          {product && (
            <Link
              to={`/products/${product?.handle}`}
              className="absolute inset-0 h-full w-full"
            ></Link>
          )}
        </div>
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-[#e5e6d4]">
          <IconImageBlank
            className="h-full w-full opacity-80 !aspect-[var(--item-thumbs-ratio)]"
            viewBox="0 0 526 526"
          />
        </div>
      )}
    </div>
  );
});

export default ProductPlacementItem;

export const schema: HydrogenComponentSchema = {
  type: 'product-placement--item',
  title: 'Product',
  inspector: [
    {
      group: 'Product',
      inputs: [
        {
          type: 'image',
          name: 'image',
          label: 'Image',
        },
        {
          type: 'product',
          name: 'product',
          label: 'Product',
        },
      ],
    },
  ],
};
