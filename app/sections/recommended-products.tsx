import { Link, useLoaderData } from "@remix-run/react";
import { Image, Money } from "@shopify/hydrogen";
import { forwardRef } from "react";

const RecommendedProducts = forwardRef<
  HTMLDivElement,
  { productsCount: number }
>(({ productsCount }, ref) => {
  const {
    recommendedProducts: { products },
  } = useLoaderData<any>();
  const displayProducts = products.nodes.slice(0, productsCount);
  return (
    <div className="recommended-products" ref={ref}>
      <h2>Recommended Products</h2>
      <div className="recommended-products-grid">
        {displayProducts.map((product: any) => (
          <Link
            key={product.id}
            className="recommended-product"
            to={`/products/${product.handle}`}
          >
            <Image
              data={product.images.nodes[0]}
              aspectRatio="1/1"
              sizes="(min-width: 45em) 20vw, 50vw"
            />
            <h4>{product.title}</h4>
            <small>
              <Money data={product.priceRange.minVariantPrice} />
            </small>
          </Link>
        ))}
      </div>
      <br />
    </div>
  );
});

export default RecommendedProducts;

export const schema = {
  type: "recommended-products",
  title: "Recommended products",
  inspector: [
    {
      group: "Settings",
      inputs: [
        {
          type: "range",
          name: "productsCount",
          label: "Number of products",
          defaultValue: 4,
          configs: {
            min: 1,
            max: 12,
            step: 1,
          },
        },
      ],
    },
  ],
};
