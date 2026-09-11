import { useEffect } from "react";
import { useNavigate } from "react-router";
import { Grid } from "~/components/grid";
import { ProductCard } from "~/components/product/product-card";
import { getImageLoadingPriority } from "~/utils/image";

type ProductsLoadedOnScrollProps = {
  nodes: any;
  collection?: { title: string; handle: string };
  inView: boolean;
  nextPageUrl: string;
  hasNextPage: boolean;
  state: any;
  onDisplayedCountChange?: (count: number) => void;
};

export function ProductsLoadedOnScroll(props: ProductsLoadedOnScrollProps) {
  let {
    nodes,
    collection,
    inView,
    nextPageUrl,
    hasNextPage,
    state,
    onDisplayedCountChange,
  } = props;
  let navigate = useNavigate();

  useEffect(() => {
    onDisplayedCountChange?.(nodes.length);
  }, [nodes.length, onDisplayedCountChange]);

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
    <Grid layout="products" className="gap-y-10! w-full!">
      {nodes.map((product: any, i: number) => (
        <ProductCard
          enableQuickView
          key={product.id}
          product={product}
          collection={collection}
          loading={getImageLoadingPriority(i)}
        />
      ))}
    </Grid>
  );
}
