import { CartForm, type OptimisticCartLineInput } from "@shopify/hydrogen";
import type { Fetcher } from "react-router";
import type { CartApiQueryFragment } from "storefront-api.generated";
import type {
  CartLine,
  CartMutationResponse,
  CartWithOptimistic,
} from "./cart-types";

export type PendingAdd = {
  lines: OptimisticCartLineInput[];
  stagedFromUpdatedAt: string;
};

function hasCartResponseErrors(value: unknown) {
  const response = value as
    | {
        errors?: unknown[];
        userErrors?: unknown[];
      }
    | undefined;
  return Boolean(response?.errors?.length || response?.userErrors?.length);
}

function applyAddLines(nodes: CartLine[], lines: OptimisticCartLineInput[]) {
  const handled = new Set<string>();
  let mutated = false;

  for (const line of lines) {
    const selectedVariant = line.selectedVariant as CartLine["merchandise"];
    if (!selectedVariant?.id) {
      continue;
    }
    handled.add(selectedVariant.id);
    mutated = true;
    const existingIndex = nodes.findIndex(
      (node) => node.merchandise?.id === selectedVariant.id,
    );
    if (existingIndex >= 0) {
      nodes[existingIndex] = {
        ...nodes[existingIndex],
        quantity: (nodes[existingIndex].quantity || 0) + (line.quantity || 1),
        isOptimistic: true,
      };
      continue;
    }

    const currencyCode =
      (selectedVariant as { price?: { currencyCode?: string } }).price
        ?.currencyCode ?? "USD";
    const zeroMoney = { amount: "0.0", currencyCode };
    nodes.unshift({
      id: `optimistic-${selectedVariant.id}`,
      merchandise: selectedVariant,
      quantity: line.quantity || 1,
      isOptimistic: true,
      cost: {
        totalAmount: zeroMoney,
        amountPerQuantity: zeroMoney,
        compareAtAmountPerQuantity: null,
      },
    } as CartLine);
  }

  return { handled, mutated };
}

function getTimestampMs(dateString: string | undefined) {
  return dateString ? new Date(dateString).getTime() : 0;
}

function cartLineQuantity(cart: CartApiQueryFragment, merchandiseId: string) {
  return (
    cart.lines.nodes.find((line) => line.merchandise?.id === merchandiseId)
      ?.quantity ?? 0
  );
}

function baselineIncludesFetcherAdd(
  baseline: CartApiQueryFragment,
  fetcherCart: CartApiQueryFragment | undefined,
  lines: OptimisticCartLineInput[],
) {
  if (!fetcherCart?.id || fetcherCart.id !== baseline.id) {
    return false;
  }
  const baselineTime = getTimestampMs(baseline.updatedAt);
  const fetcherTime = getTimestampMs(fetcherCart.updatedAt);
  if (baselineTime > fetcherTime) {
    return true;
  }
  if (baselineTime < fetcherTime) {
    return false;
  }
  return lines.every((line) => {
    const merchandiseId =
      (line.selectedVariant as { id?: string } | undefined)?.id ??
      line.merchandiseId;
    return (
      cartLineQuantity(baseline, merchandiseId) >=
      cartLineQuantity(fetcherCart, merchandiseId)
    );
  });
}

export function getActiveStagedLines(
  pendingAdds: Map<string, PendingAdd>,
  baselineTime: number,
) {
  const lines: OptimisticCartLineInput[] = [];
  for (const pending of pendingAdds.values()) {
    const stagedAt = pending.stagedFromUpdatedAt
      ? new Date(pending.stagedFromUpdatedAt).getTime()
      : 0;
    if (stagedAt >= baselineTime) {
      lines.push(...pending.lines);
    }
  }
  return lines;
}

export function buildOptimisticAddCart(
  lines: OptimisticCartLineInput[],
): CartWithOptimistic | null {
  const nodes: CartLine[] = [];
  if (!applyAddLines(nodes, lines).mutated) {
    return null;
  }
  const currencyCode =
    (
      lines[0]?.selectedVariant as {
        price?: { currencyCode?: string };
      }
    )?.price?.currencyCode ?? "USD";
  const zeroMoney = { amount: "0.0", currencyCode };
  return {
    id: "optimistic-cart",
    updatedAt: "",
    checkoutUrl: "",
    note: null,
    appliedGiftCards: [],
    discountCodes: [],
    discountAllocations: [],
    attributes: [],
    buyerIdentity: null,
    lines: { nodes, pageInfo: { hasNextPage: false } },
    totalQuantity: nodes.reduce((sum, line) => sum + line.quantity, 0),
    cost: {
      subtotalAmount: zeroMoney,
      totalAmount: zeroMoney,
      totalDutyAmount: null,
      totalTaxAmount: null,
    },
    isOptimistic: true,
  } as CartWithOptimistic;
}

export function filterRemovedCartLines(
  baseline: CartApiQueryFragment,
  pendingLineRemovals: Set<string>,
): CartApiQueryFragment {
  if (pendingLineRemovals.size === 0) {
    return baseline;
  }

  const nodes = baseline.lines.nodes.filter(
    (line) => !pendingLineRemovals.has(line.id),
  );
  return {
    ...baseline,
    lines: { ...baseline.lines, nodes },
    totalQuantity: nodes.reduce((sum, line) => sum + line.quantity, 0),
  };
}

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

/** Apply only mutations that have not yet been adopted by the baseline. */
export function applyOptimisticMutations(
  baseline: CartApiQueryFragment,
  fetchers: Fetcher<unknown>[],
  stagedLines: OptimisticCartLineInput[],
  pendingLineUpdates: Map<string, number>,
): CartWithOptimistic | null {
  const pendingFetchers = fetchers.filter(
    (fetcher) =>
      (fetcher.state === "submitting" || fetcher.state === "loading") &&
      fetcher.formData,
  );
  if (
    pendingFetchers.length === 0 &&
    stagedLines.length === 0 &&
    pendingLineUpdates.size === 0
  ) {
    return null;
  }

  const nodes = baseline.lines.nodes.map((line) => ({ ...line })) as CartLine[];
  const cart = {
    ...baseline,
    lines: { ...baseline.lines, nodes },
    isOptimistic: false,
  } as CartWithOptimistic;
  let mutated = false;
  const staged = applyAddLines(nodes, stagedLines);
  mutated = staged.mutated;

  for (const fetcher of pendingFetchers) {
    const formInput = getFormInput(fetcher);
    if (!formInput) {
      continue;
    }
    const { action, inputs } = formInput;

    if (action === CartForm.ACTIONS.LinesAdd) {
      const lines = ((inputs.lines ?? []) as OptimisticCartLineInput[]).filter(
        (line) =>
          !staged.handled.has(
            (line.selectedVariant as { id?: string } | undefined)?.id ?? "",
          ),
      );
      const fetcherCart = (fetcher.data as CartMutationResponse | undefined)
        ?.cart;
      if (
        baselineIncludesFetcherAdd(baseline, fetcherCart ?? undefined, lines)
      ) {
        continue;
      }
      mutated = applyAddLines(nodes, lines).mutated || mutated;
    } else if (action === CartForm.ACTIONS.LinesRemove) {
      for (const lineId of (inputs.lineIds as string[]) ?? []) {
        const index = nodes.findIndex((line) => line.id === lineId);
        if (index >= 0) {
          nodes.splice(index, 1);
          mutated = true;
        }
      }
    } else if (action === CartForm.ACTIONS.LinesUpdate) {
      for (const update of inputs.lines ?? []) {
        const index = nodes.findIndex((line) => line.id === update.id);
        if (index >= 0) {
          nodes[index] = {
            ...nodes[index],
            quantity: update.quantity,
            isOptimistic: true,
          };
          mutated = true;
        }
      }
    }
  }

  for (const [lineId, quantity] of pendingLineUpdates) {
    const index = nodes.findIndex((line) => line.id === lineId);
    if (index >= 0) {
      nodes[index] = { ...nodes[index], quantity, isOptimistic: true };
      mutated = true;
    }
  }

  if (!mutated) {
    return null;
  }
  cart.totalQuantity = nodes.reduce((sum, line) => sum + line.quantity, 0);
  cart.isOptimistic = true;
  return cart;
}

export function getCartLineRenderKeys(lines: CartLine[]) {
  const merchandiseCounts = new Map<string, number>();
  for (const line of lines) {
    const merchandiseId = line.merchandise?.id;
    if (merchandiseId) {
      merchandiseCounts.set(
        merchandiseId,
        (merchandiseCounts.get(merchandiseId) ?? 0) + 1,
      );
    }
  }
  return lines.map((line) => {
    const merchandiseId = line.merchandise?.id;
    return merchandiseId && merchandiseCounts.get(merchandiseId) === 1
      ? `merchandise-${merchandiseId}`
      : line.id;
  });
}

export function resetOptimisticCartForTests() {
  // No module-level optimistic state remains.
}
