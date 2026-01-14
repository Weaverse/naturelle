import { redirect } from "react-router";
import type { ProductQuery } from "storefront-api.generated";
import { isCombinedListing } from "~/utils/combined-listings";

export function redirectIfHandleIsLocalized(
  request: Request,
  ...localizedResources: Array<{
    handle: string;
    data: { handle: string } & unknown;
  }>
) {
  const url = new URL(request.url);
  let shouldRedirect = false;

  for (const { handle, data } of localizedResources) {
    if (handle !== data.handle) {
      url.pathname = url.pathname.replace(handle, data.handle);
      shouldRedirect = true;
    }
  }

  if (shouldRedirect) {
    throw redirect(url.toString());
  }
}

export function redirectIfCombinedListing(
  request: Request,
  product: ProductQuery["product"],
) {
  const url = new URL(request.url);
  let shouldRedirect = false;

  if (isCombinedListing(product)) {
    // Get the first available variant's product handle
    const firstVariant = product.variants?.nodes?.[0];
    const targetHandle = firstVariant?.product?.handle;

    if (targetHandle && product.handle !== targetHandle) {
      url.pathname = url.pathname.replace(product.handle, targetHandle);
      shouldRedirect = true;
    }
  }

  if (shouldRedirect) {
    throw redirect(url.toString());
  }
}
