import type { CartCost } from "@shopify/hydrogen/storefront-api-types";
import { useTranslation } from "@weaverse/hydrogen";
import {
  useCart,
  useCartBootstrapResolved,
  useCartStore,
} from "~/components/cart/store";
import { cn } from "~/utils/cn";
import { Drawer } from "../drawer";
import { IconBag } from "../icon";
import { CartMain } from "./cart";
import { CartLoading } from "./cart-loading";
import { FreeShippingProgressBar } from "./free-shipping-progress-bar";

export function toggleCartDrawer(open: boolean) {
  useCartStore.getState().toggle(open);
}

export function CartDrawerTrigger({ compact = false }: { compact?: boolean }) {
  const { t } = useTranslation();
  const cart = useCart();
  const openCart = useCartStore((state) => state.open);

  return (
    <button
      type="button"
      aria-label={t("accessibility.openCart")}
      onClick={openCart}
      className={cn(
        "focus:ring-border relative flex items-center justify-center",
        compact ? "size-5" : "size-8",
      )}
    >
      <IconBag
        aria-hidden="true"
        className={compact ? "size-5" : "size-6"}
        viewBox="0 0 24 24"
      />
      <div
        className={cn(
          "absolute flex items-center justify-center rounded-full bg-(--color-header-text) text-center text-[0.625rem] font-medium leading-none text-(--color-transparent-header) subpixel-antialiased",
          compact
            ? "-top-1.5 -right-1.5 size-3.5"
            : "top-0 right-0 size-4 p-0.5",
        )}
      >
        <span>{cart?.totalQuantity || 0}</span>
      </div>
    </button>
  );
}

export function CartDrawer() {
  const { t } = useTranslation();
  const cart = useCart();
  const bootstrapResolved = useCartBootstrapResolved();
  const cartReady = bootstrapResolved || Boolean(cart?.isOptimistic);
  const isOpen = useCartStore((state) => state.isOpen);
  const closeCart = useCartStore((state) => state.close);

  return (
    <Drawer
      open={isOpen}
      onClose={closeCart}
      openFrom="right"
      heading={t("cart.title")}
      isForm="cart"
    >
      <div className="flex min-h-0 flex-1 flex-col gap-4">
        {cart && cart.totalQuantity > 0 && (
          <FreeShippingProgressBar cost={cart.cost as CartCost} />
        )}
        <div className="flex min-h-0 flex-1 flex-col">
          {cartReady ? (
            <CartMain layout="aside" onClose={closeCart} />
          ) : (
            <CartLoading />
          )}
        </div>
      </div>
    </Drawer>
  );
}
