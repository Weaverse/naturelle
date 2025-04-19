import { useNavigate } from "@remix-run/react";
import { useEffect } from "react";
import { Grid } from "~/components/Grid";
import { ProductCard } from "~/components/ProductCard";
import { getImageLoadingPriority } from "~/lib/utils/const";

type ProductsLoadedOnScrollProps = {
  nodes: any;
  inView: boolean;
  nextPageUrl: string;
  hasNextPage: boolean;
  state: any;
};

export function ProductsLoadedOnScroll(props: ProductsLoadedOnScrollProps) {
  let { nodes, inView, nextPageUrl, hasNextPage, state } = props;
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
    <Grid layout="products" className="!gap-y-10">
      {nodes.map((product: any, i: number) => (
        <ProductCard
          quickAdd
          key={product.id}
          product={product}
          loading={getImageLoadingPriority(i)}
        />
      ))}
    </Grid>
  );
}
