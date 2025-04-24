import { type LoaderFunction, data } from "@shopify/remix-oxygen";
import { getProductData } from "~/lib/utils/products";

function getRequestQueries<T = Record<string, string>>(request: Request) {
  let url = new URL(request.url);
  return Array.from(url.searchParams.entries()).reduce((q, [k, v]) => {
    q[k] = v;
    return q;
  }, {}) as T;
}

export let loader: LoaderFunction = async ({ request, params, context }) => {
  try {
    let queries = getRequestQueries(request);
    switch (params.param) {
      case "products": {
        let handle = queries.handle;
        if (!handle) return data(null, { status: 404 });
        let metafield = context.env.PRODUCT_CUSTOM_DATA_METAFIELD || 'custom.details';
        let productData = await getProductData(
          context.storefront,
          String(handle),
          String(metafield),
        );
        return data(productData);
      }
      default:
        return data(null, { status: 404 });
    }
  } catch (error) {
    console.error(error);
    return data({ error: "An error occurred" }, { status: 500 });
  }
};
