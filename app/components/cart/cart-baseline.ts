import { CartForm } from "@shopify/hydrogen";
import type { Fetcher } from "react-router";
import type { CartApiQueryFragment } from "storefront-api.generated";
import type { CartMutationResponse } from "./cart-types";

let freshestFetcherCart: CartApiQueryFragment | null = null;
let cartMutationEpoch = 0;
let recordedMutationCarts = new WeakSet<object>();
let cartBootstrapRequestSequence = 0;
let currentCartBootstrapLocationKey = "";
let currentCartBootstrapPath = "";
let currentCartBootstrapRequestToken: string | null = null;
let currentCartBootstrapMutationEpoch = 0;

export function getTimestampMs(dateString: string | undefined): number {
  return dateString ? new Date(dateString).getTime() : 0;
}

export function hasCartResponseErrors(value: unknown) {
  const response = value as CartMutationResponse | undefined;
  return Boolean(response?.errors?.length || response?.userErrors?.length);
}

export function getCartFormInput(fetcher: Fetcher<unknown>) {
  if (!fetcher.formData) {
    return null;
  }
  try {
    return CartForm.getFormInput(fetcher.formData);
  } catch {
    return null;
  }
}

export function recordCartMutation(cart: CartApiQueryFragment) {
  if (recordedMutationCarts.has(cart)) {
    return;
  }
  recordedMutationCarts.add(cart);
  cartMutationEpoch += 1;
  if (
    !freshestFetcherCart ||
    getTimestampMs(cart.updatedAt) >=
      getTimestampMs(freshestFetcherCart.updatedAt)
  ) {
    freshestFetcherCart = cart;
  }
}

export function clearFreshestFetcherCart() {
  freshestFetcherCart = null;
}

export function ensureCartBootstrapRequestToken(
  locationKey: string,
  path: string,
) {
  if (typeof document === "undefined") {
    return null;
  }
  if (
    currentCartBootstrapLocationKey !== locationKey ||
    currentCartBootstrapPath !== path
  ) {
    cartBootstrapRequestSequence += 1;
    currentCartBootstrapLocationKey = locationKey;
    currentCartBootstrapPath = path;
    currentCartBootstrapRequestToken = `${locationKey}:${cartBootstrapRequestSequence}`;
  }
  return currentCartBootstrapRequestToken;
}

export function getCurrentCartBootstrapRequestToken() {
  return currentCartBootstrapRequestToken;
}

export function getCurrentCartBootstrapPath() {
  return currentCartBootstrapPath;
}

export function markCartBootstrapStarted() {
  currentCartBootstrapMutationEpoch = cartMutationEpoch;
}

export function canApplyNullCartBootstrap() {
  return cartMutationEpoch === currentCartBootstrapMutationEpoch;
}

/**
 * Pick one authoritative baseline. A loading fetcher already contains its
 * completed action result while route loaders revalidate, so it is safe to
 * adopt before React Router can discard an unmounted fetcher.
 */
export function resolveBaselineCart(
  serverCart: CartApiQueryFragment | null,
  fetchers: Fetcher<unknown>[] = [],
) {
  let cart = serverCart;
  let updatedAt = getTimestampMs(serverCart?.updatedAt);

  const freshestFetcherTime = getTimestampMs(freshestFetcherCart?.updatedAt);
  if (freshestFetcherCart && freshestFetcherTime > updatedAt) {
    cart = freshestFetcherCart;
    updatedAt = freshestFetcherTime;
  }

  for (const fetcher of fetchers) {
    if (fetcher.state === "submitting" || hasCartResponseErrors(fetcher.data)) {
      continue;
    }
    const fetcherCart = (fetcher.data as CartMutationResponse | undefined)
      ?.cart;
    if (!fetcherCart?.id || !fetcherCart.lines) {
      continue;
    }
    const fetcherTime = getTimestampMs(fetcherCart.updatedAt);
    if (fetcherTime > updatedAt) {
      cart = fetcherCart;
      updatedAt = fetcherTime;
      recordCartMutation(fetcherCart);
    }
  }

  return { cart, updatedAt };
}
