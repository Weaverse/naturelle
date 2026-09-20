import type { OptimisticCartLineInput } from "@shopify/hydrogen";
import { useFetchers } from "react-router";
import type { CartApiQueryFragment } from "storefront-api.generated";
import { create } from "zustand";
import { usePrefixPathWithLocale } from "~/utils/locale";
import { resolveBaselineCart } from "./cart-baseline";
import {
  claimPendingLineUpdate,
  settlePendingLineUpdate,
  stagePendingLineUpdate,
} from "./cart-line-queue";
import type { CartMutationResponse, CartWithOptimistic } from "./cart-types";
import {
  applyOptimisticMutations,
  buildOptimisticAddCart,
  filterRemovedCartLines,
  getActiveStagedLines,
  type PendingAdd,
} from "./optimistic-cart";

export type CartStore = {
  isOpen: boolean;
  serverCart: CartApiQueryFragment | null;
  cartBootstrapResponseToken: string | null;
  cartBootstrapResolvedPath: string | null;
  pendingAdds: Map<string, PendingAdd>;
  pendingLineUpdates: Map<string, number>;
  lineUpdatesInFlight: Map<string, number>;
  lineUpdateErrors: Map<string, CartMutationResponse>;
  pendingLineRemovals: Set<string>;
  lineRemovalErrors: Map<string, CartMutationResponse>;
  open: () => void;
  close: () => void;
  toggle: (open?: boolean) => void;
  stagePendingAdd: (lines: OptimisticCartLineInput[]) => string | null;
  clearPendingAdd: (token: string) => void;
  stageLineUpdate: (lineId: string, quantity: number) => void;
  claimLineUpdate: (lineId: string) => number | null;
  settleLineUpdate: (
    lineId: string,
    submittedQuantity: number,
    response?: CartMutationResponse,
  ) => void;
  stageLineRemoval: (lineId: string) => void;
  settleLineRemoval: (lineId: string, response?: CartMutationResponse) => void;
};

let pendingAddSequence = 0;

export const useCartStore = create<CartStore>()((set) => ({
  isOpen: false,
  serverCart: null,
  cartBootstrapResponseToken: null,
  cartBootstrapResolvedPath: null,
  pendingAdds: new Map(),
  pendingLineUpdates: new Map(),
  lineUpdatesInFlight: new Map(),
  lineUpdateErrors: new Map(),
  pendingLineRemovals: new Set(),
  lineRemovalErrors: new Map(),
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  toggle: (open) =>
    set((state) => ({
      isOpen: open === undefined ? !state.isOpen : open,
    })),
  stagePendingAdd: (lines) => {
    const usableLines = lines.filter((line) => line.selectedVariant);
    if (usableLines.length === 0) {
      return null;
    }
    pendingAddSequence += 1;
    const token = `add-${pendingAddSequence}`;
    const { cart } = resolveBaselineCart(useCartStore.getState().serverCart);
    set((state) => {
      const pendingAdds = new Map(state.pendingAdds);
      pendingAdds.set(token, {
        lines: usableLines,
        stagedFromUpdatedAt: cart?.updatedAt ?? "",
      });
      return { pendingAdds };
    });
    return token;
  },
  clearPendingAdd: (token) =>
    set((state) => {
      if (!state.pendingAdds.has(token)) {
        return {};
      }
      const pendingAdds = new Map(state.pendingAdds);
      pendingAdds.delete(token);
      return { pendingAdds };
    }),
  stageLineUpdate: (lineId, quantity) =>
    set((state) => {
      const lineUpdateErrors = new Map(state.lineUpdateErrors);
      lineUpdateErrors.delete(lineId);
      return {
        pendingLineUpdates: stagePendingLineUpdate(
          state.pendingLineUpdates,
          lineId,
          quantity,
        ),
        lineUpdateErrors,
      };
    }),
  claimLineUpdate: (lineId) => {
    let claimedQuantity: number | null = null;
    set((state) => {
      const { inFlight, quantity } = claimPendingLineUpdate(
        state.pendingLineUpdates,
        state.lineUpdatesInFlight,
        lineId,
      );
      claimedQuantity = quantity;
      if (inFlight === state.lineUpdatesInFlight) {
        return {};
      }
      return { lineUpdatesInFlight: inFlight };
    });
    return claimedQuantity;
  },
  settleLineUpdate: (lineId, submittedQuantity, response) =>
    set((state) => {
      const settled = settlePendingLineUpdate(
        state.pendingLineUpdates,
        state.lineUpdatesInFlight,
        lineId,
        submittedQuantity,
      );
      if (settled.inFlight === state.lineUpdatesInFlight) {
        return {};
      }
      const lineUpdateErrors = new Map(state.lineUpdateErrors);
      if (
        response?.errors?.length ||
        response?.userErrors?.length ||
        response?.warnings?.length
      ) {
        lineUpdateErrors.set(lineId, response);
      } else {
        lineUpdateErrors.delete(lineId);
      }
      return {
        pendingLineUpdates: settled.pending,
        lineUpdatesInFlight: settled.inFlight,
        lineUpdateErrors,
      };
    }),
  stageLineRemoval: (lineId) =>
    set((state) => {
      const pendingLineRemovals = new Set(state.pendingLineRemovals);
      pendingLineRemovals.add(lineId);
      const lineRemovalErrors = new Map(state.lineRemovalErrors);
      lineRemovalErrors.delete(lineId);
      return { pendingLineRemovals, lineRemovalErrors };
    }),
  settleLineRemoval: (lineId, response) =>
    set((state) => {
      if (!state.pendingLineRemovals.has(lineId)) {
        return {};
      }
      const pendingLineRemovals = new Set(state.pendingLineRemovals);
      pendingLineRemovals.delete(lineId);
      const lineRemovalErrors = new Map(state.lineRemovalErrors);
      if (
        response?.errors?.length ||
        response?.userErrors?.length ||
        response?.warnings?.length
      ) {
        lineRemovalErrors.set(lineId, response);
      } else {
        lineRemovalErrors.delete(lineId);
      }
      return { pendingLineRemovals, lineRemovalErrors };
    }),
}));

export function useCartBootstrapResolved() {
  const apiCartPath = usePrefixPathWithLocale("/api/cart");
  const resolvedPath = useCartStore((state) => state.cartBootstrapResolvedPath);
  return resolvedPath === apiCartPath;
}

export function useCart(): CartWithOptimistic | null {
  const serverCart = useCartStore((state) => state.serverCart);
  const pendingAdds = useCartStore((state) => state.pendingAdds);
  const pendingLineUpdates = useCartStore((state) => state.pendingLineUpdates);
  const pendingLineRemovals = useCartStore(
    (state) => state.pendingLineRemovals,
  );
  const fetchers = useFetchers();
  const { cart: resolved, updatedAt } = resolveBaselineCart(
    serverCart,
    fetchers,
  );
  const stagedLines = getActiveStagedLines(pendingAdds, updatedAt);

  if (!resolved) {
    return stagedLines.length ? buildOptimisticAddCart(stagedLines) : null;
  }

  const baseline = filterRemovedCartLines(resolved, pendingLineRemovals);
  return (
    applyOptimisticMutations(
      baseline,
      fetchers,
      stagedLines,
      pendingLineUpdates,
    ) ?? baseline
  );
}
