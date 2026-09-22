import { useEffect, useRef } from "react";
import { useFetcher } from "react-router";
import { useWeaverseStudioCheck } from "~/hooks/use-weaverse-studio-check";
import type { ProductDetailMetafieldLoaderData } from "./product-metafield";

type MetafieldResponse = ProductDetailMetafieldLoaderData & {
  requestedMetafield: string;
};

export function useProductMetafieldData(
  metafield: string | undefined,
  loaderData: ProductDetailMetafieldLoaderData | undefined,
): ProductDetailMetafieldLoaderData | undefined {
  const isDesignMode = useWeaverseStudioCheck();
  const { data: fetchedData, load } = useFetcher<MetafieldResponse>();
  const currentMetafield = metafield?.trim() || "";
  const initialMetafield = useRef(currentMetafield);
  const previousMetafield = useRef(currentMetafield);

  useEffect(() => {
    if (!isDesignMode || previousMetafield.current === currentMetafield) {
      return;
    }

    previousMetafield.current = currentMetafield;
    const pathname = window.location.pathname.replace(/\.data$/, "");
    const segments = pathname.split("/").filter(Boolean);
    const productsIndex = segments.lastIndexOf("products");
    const handle = segments[productsIndex + 1];
    const params = new URLSearchParams({
      handle: handle ? decodeURIComponent(handle) : "",
      metafield: currentMetafield,
    });
    load(`/api/query/product-detail-metafield?${params}`);
  }, [currentMetafield, isDesignMode, load]);

  if (!isDesignMode) {
    return loaderData;
  }
  if (fetchedData?.requestedMetafield === currentMetafield) {
    return fetchedData;
  }
  if (initialMetafield.current === currentMetafield) {
    return loaderData;
  }
  return {
    entries: [],
    identifier: currentMetafield,
    status: "loading",
  };
}
