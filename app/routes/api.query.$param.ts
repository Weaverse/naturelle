import { data, type LoaderFunction } from "react-router";
import { queryProductDetailMetafield } from "~/sections/product-details/product-metafield";
import { getProductData } from "~/utils/product";

function getRequestQueries<T = Record<string, string>>(request: Request) {
  let url = new URL(request.url);
  return Array.from(url.searchParams.entries()).reduce((q, [k, v]) => {
    q[k] = v;
    return q;
  }, {}) as T;
}

export const loader: LoaderFunction = async ({ request, params, context }) => {
  try {
    let queries = getRequestQueries(request);
    switch (params.param) {
      case "product-detail-metafield": {
        const handle = String(queries.handle || "");
        const metafield = String(queries.metafield || "");
        const result = await queryProductDetailMetafield({
          storefront: context.storefront,
          handle: handle || null,
          metafield,
        });
        return data({ ...result, requestedMetafield: metafield });
      }
      case "products": {
        let handle = queries.handle;
        if (!handle) {
          return data(null, { status: 404 });
        }
        let metafield =
          context.env.PRODUCT_CUSTOM_DATA_METAFIELD || "custom.details";
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
