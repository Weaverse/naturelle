import { CartForm } from "@shopify/hydrogen";
import { useEffect, useLayoutEffect, useRef } from "react";
import {
  type Fetcher,
  useFetcher,
  useFetchers,
  useLocation,
} from "react-router";
import type { CartApiQueryFragment } from "storefront-api.generated";
import { usePrefixPathWithLocale } from "~/utils/locale";
import {
  canApplyNullCartBootstrap,
  clearFreshestFetcherCart,
  ensureCartBootstrapRequestToken,
  getCurrentCartBootstrapPath,
  getCurrentCartBootstrapRequestToken,
  getTimestampMs,
  hasCartResponseErrors,
  markCartBootstrapStarted,
  recordCartMutation,
} from "./cart-baseline";
import type { CartMutationResponse } from "./cart-types";
import { type CartStore, useCartStore } from "./store";

const QUANTITY_FETCHER_PREFIX = "cart-line-quantity:";
const CART_BOOTSTRAP_FETCHER_KEY = "cart-bootstrap";
const useHydrationSafeLayoutEffect =
  typeof document === "undefined" ? useEffect : useLayoutEffect;

type CartBootstrapResponse = {
  cart: CartApiQueryFragment | null;
  cartRequestToken: string;
};

function getFormInput(fetcher: Fetcher<unknown>) {
  if (!fetcher.formData) {
    return null;
  }
  try {
    return CartForm.getFormInput(fetcher.formData);
  } catch {
    return null;
  }
}

function syncFetcherResponse(fetcher: Fetcher<unknown>) {
  const response = fetcher.data as CartMutationResponse | undefined;
  const cart = response?.cart;
  if (!hasCartResponseErrors(response) && cart?.id && cart.lines) {
    recordCartMutation(cart);
    const current = useCartStore.getState().serverCart;
    if (getTimestampMs(cart.updatedAt) >= getTimestampMs(current?.updatedAt)) {
      useCartStore.setState({ serverCart: cart });
    }
  }

  const formInput = getFormInput(fetcher);
  if (!formInput) {
    return;
  }

  if (formInput.action !== CartForm.ACTIONS.LinesUpdate) {
    return;
  }

  for (const line of formInput.inputs.lines ?? []) {
    if (typeof line.id === "string" && typeof line.quantity === "number") {
      useCartStore
        .getState()
        .settleLineUpdate(line.id, line.quantity, response);
    }
  }
}

/**
 * Captures the retained idle result exposed to a mounted fetcher owner. The
 * root coordinator covers owners that unmount while a request is in flight;
 * both paths reconcile into the same Zustand source of truth.
 */
export function useCartFetcherSync(fetcher: Fetcher<unknown>) {
  const lastResponse = useRef<object | null>(null);
  const response = fetcher.data;
  if (
    fetcher.state === "idle" &&
    response &&
    typeof response === "object" &&
    response !== lastResponse.current
  ) {
    lastResponse.current = response;
    queueMicrotask(() => syncFetcherResponse(fetcher));
  }
}

/**
 * Owns cart mutation synchronization and in-flight per-line mutations for the
 * lifetime of the application.
 */
export function CartStoreSync() {
  const bootstrapFetcher = useFetcher<CartBootstrapResponse>({
    key: CART_BOOTSTRAP_FETCHER_KEY,
  });
  const loadBootstrap = bootstrapFetcher.load;
  const fetchers = useFetchers();
  const cartRoute = usePrefixPathWithLocale("/cart");
  const apiCartPath = usePrefixPathWithLocale("/api/cart");
  const location = useLocation();
  const pendingLineUpdates = useCartStore((state) => state.pendingLineUpdates);
  const lineUpdatesInFlight = useCartStore(
    (state) => state.lineUpdatesInFlight,
  );
  const pendingLineRemovals = useCartStore(
    (state) => state.pendingLineRemovals,
  );
  const processedResponses = useRef(new WeakSet<object>());

  for (const fetcher of fetchers) {
    const response = fetcher.data;
    if (
      (response &&
        typeof response === "object" &&
        "cartRequestToken" in response) ||
      fetcher.state !== "idle" ||
      !response ||
      typeof response !== "object" ||
      processedResponses.current.has(response)
    ) {
      continue;
    }
    processedResponses.current.add(response);
    queueMicrotask(() => syncFetcherResponse(fetcher));
  }

  const cartRequestToken = ensureCartBootstrapRequestToken(
    location.key,
    apiCartPath,
  );

  useHydrationSafeLayoutEffect(() => {
    if (!cartRequestToken) {
      return;
    }
    markCartBootstrapStarted();
    const url = new URL(apiCartPath, window.location.origin);
    url.searchParams.set("cartRequestToken", cartRequestToken);
    loadBootstrap(url.pathname + url.search);
  }, [apiCartPath, cartRequestToken, loadBootstrap]);

  const bootstrapPayload = bootstrapFetcher.data;
  useEffect(() => {
    if (!bootstrapPayload) {
      return;
    }
    const responseToken = bootstrapPayload.cartRequestToken || null;
    if (
      !responseToken ||
      responseToken !== getCurrentCartBootstrapRequestToken()
    ) {
      return;
    }

    const updates: Partial<CartStore> = {
      cartBootstrapResponseToken: responseToken,
      cartBootstrapResolvedPath: getCurrentCartBootstrapPath(),
    };
    const resolved = bootstrapPayload.cart;
    if (resolved) {
      const current = useCartStore.getState().serverCart;
      if (
        getTimestampMs(resolved.updatedAt) >= getTimestampMs(current?.updatedAt)
      ) {
        updates.serverCart = resolved;
      }
    } else if (canApplyNullCartBootstrap()) {
      clearFreshestFetcherCart();
      updates.serverCart = null;
    }
    useCartStore.setState(updates);
  }, [bootstrapPayload]);

  const activeLineIds = new Set([
    ...pendingLineUpdates.keys(),
    ...lineUpdatesInFlight.keys(),
  ]);
  return (
    <>
      {[...activeLineIds].map((lineId) => (
        <CartLineQuantityMutation
          key={lineId}
          lineId={lineId}
          cartRoute={cartRoute}
        />
      ))}
      {[...pendingLineRemovals].map((lineId) => (
        <CartLineRemovalMutation
          key={lineId}
          lineId={lineId}
          cartRoute={cartRoute}
        />
      ))}
    </>
  );
}

function CartLineQuantityMutation({
  lineId,
  cartRoute,
}: {
  lineId: string;
  cartRoute: string;
}) {
  const fetcher = useFetcher<CartMutationResponse>({
    key: `${QUANTITY_FETCHER_PREFIX}${lineId}`,
  });
  const submit = fetcher.submit;
  const pendingQuantity = useCartStore((state) =>
    state.pendingLineUpdates.get(lineId),
  );
  const submittedQuantity = useCartStore((state) =>
    state.lineUpdatesInFlight.get(lineId),
  );
  useCartFetcherSync(fetcher);

  useEffect(() => {
    if (
      fetcher.state === "idle" &&
      fetcher.data &&
      submittedQuantity !== undefined
    ) {
      useCartStore
        .getState()
        .settleLineUpdate(lineId, submittedQuantity, fetcher.data);
    }
  }, [fetcher.data, fetcher.state, lineId, submittedQuantity]);

  useEffect(() => {
    if (
      pendingQuantity === undefined ||
      submittedQuantity !== undefined ||
      fetcher.state !== "idle"
    ) {
      return;
    }
    const quantity = useCartStore.getState().claimLineUpdate(lineId);
    if (quantity === null) {
      return;
    }
    const formData = new FormData();
    formData.set(
      CartForm.INPUT_NAME,
      JSON.stringify({
        action: CartForm.ACTIONS.LinesUpdate,
        inputs: { lines: [{ id: lineId, quantity }] },
      }),
    );

    submit(formData, { action: cartRoute, method: "post" }).catch(() => {
      useCartStore.getState().settleLineUpdate(lineId, quantity, {
        errors: [{ message: "Unable to update cart quantity" }],
      });
    });
  }, [
    cartRoute,
    fetcher.state,
    lineId,
    pendingQuantity,
    submit,
    submittedQuantity,
  ]);

  return null;
}

function CartLineRemovalMutation({
  lineId,
  cartRoute,
}: {
  lineId: string;
  cartRoute: string;
}) {
  const fetcher = useFetcher<CartMutationResponse>({
    key: `cart-line-remove:${lineId}`,
  });
  const submit = fetcher.submit;
  const submitted = useRef(false);
  useCartFetcherSync(fetcher);

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data && submitted.current) {
      submitted.current = false;
      useCartStore.getState().settleLineRemoval(lineId, fetcher.data);
    }
  }, [fetcher.data, fetcher.state, lineId]);

  useEffect(() => {
    if (fetcher.state !== "idle" || submitted.current) {
      return;
    }
    submitted.current = true;
    const formData = new FormData();
    formData.set(
      CartForm.INPUT_NAME,
      JSON.stringify({
        action: CartForm.ACTIONS.LinesRemove,
        inputs: { lineIds: [lineId] },
      }),
    );
    submit(formData, { action: cartRoute, method: "post" }).catch(() => {
      submitted.current = false;
      useCartStore.getState().settleLineRemoval(lineId, {
        errors: [{ message: "Unable to remove cart item" }],
      });
    });
  }, [cartRoute, fetcher.state, lineId, submit]);

  return null;
}
