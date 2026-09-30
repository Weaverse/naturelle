import { data, type LoaderFunction } from "react-router";
import { getProductData } from "~/utils/product";

function getRequestQueries<T = Record<string, string>>(request: Request) {
  const url = new URL(request.url);
  return Array.from(url.searchParams.entries()).reduce(
    (queries, [key, value]) => {
      queries[key] = value;
      return queries;
    },
    {} as T,
  );
}

export const loader: LoaderFunction = async ({ request, params, context }) => {
  try {
    const queries = getRequestQueries(request);
    switch (params.param) {
      case "products": {
        const handle = queries.handle;
        if (!handle) {
          return data({ error: "Product handle is required" }, { status: 400 });
        }
        const metafield =
          context.env.PRODUCT_CUSTOM_DATA_METAFIELD || "custom.details";
        const productData = await getProductData(
          context.storefront,
          String(handle),
          String(metafield),
        );
        if (!(productData.product && productData.variants?.product)) {
          return data({ error: "Product not found" }, { status: 404 });
        }
        return data(productData);
      }
      default:
        return data({ error: "Not found" }, { status: 404 });
    }
  } catch {
    console.error("Unable to load quick view product");
    return data({ error: "An error occurred" }, { status: 500 });
  }
};
