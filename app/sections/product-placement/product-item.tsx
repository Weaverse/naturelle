import { Image } from "@shopify/hydrogen";
import type {
  HydrogenComponentProps,
  WeaverseImage,
  WeaverseProduct,
} from "@weaverse/hydrogen";
import { createSchema, IMAGES_PLACEHOLDERS } from "@weaverse/hydrogen";
import type { CSSProperties, RefObject } from "react";
import { Link } from "~/components/link";
import { sectionImage } from "~/utils/section-placeholder";

interface ProductPlacementItemProps extends HydrogenComponentProps {
  image: WeaverseImage;
  product?: WeaverseProduct;
}

const ProductPlacementItem = ({
  ref,
  ...props
}: ProductPlacementItemProps & { ref?: RefObject<HTMLDivElement | null> }) => {
  let { image, product, ...rest } = props;
  let contentStyle: CSSProperties = {} as CSSProperties;
  return (
    <div
      data-motion="slide-in"
      ref={ref}
      {...rest}
      style={contentStyle}
      className="h-full w-full"
    >
      <div className="relative h-full w-full">
        <Image
          data={sectionImage(
            image,
            IMAGES_PLACEHOLDERS.product_1,
            "Product image placeholder",
          )}
          sizes="auto"
          className="!aspect-[var(--item-thumbs-ratio)] !h-full !w-full cursor-pointer object-cover"
          loading="lazy"
        />
        {product?.handle && (
          <Link
            to={`/products/${product.handle}`}
            className="absolute inset-0 h-full w-full"
          />
        )}
      </div>
    </div>
  );
};

export default ProductPlacementItem;

export const schema = createSchema({
  type: "product-placement--item",
  title: "Product",
  settings: [
    {
      group: "Product",
      inputs: [
        {
          type: "image",
          name: "image",
          label: "Image",
        },
        {
          type: "product",
          name: "product",
          label: "Product",
        },
      ],
    },
  ],
  presets: {
    image: IMAGES_PLACEHOLDERS.product_1,
  },
});
