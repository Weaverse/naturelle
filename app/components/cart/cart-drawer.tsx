import { CartForm, type CartReturn, useOptimisticCart } from "@shopify/hydrogen";
import type { CartCost } from "@shopify/hydrogen/storefront-api-types";
import { Suspense } from "react";
import { Await, useRouteLoaderData } from "react-router";
import type { CartApiQueryFragment } from "storefront-api.generated";
import { useCartFetchers } from "~/hooks/use-cart-fetchers";
import type { RootLoader } from "~/root";
import { cn } from "~/utils/cn";
import { Drawer, useDrawer } from "../drawer";
import { IconBag } from "../icon";
import { Link } from "../link";
import { CartMain } from "./cart";
import { CartLoading } from "./cart-loading";
import { FreeShippingProgressBar } from "./free-shipping-progress-bar";

export function CartDrawer({ compact = false }: { compact?: boolean }) {
  const {
    isOpen: isCartOpen,
    openDrawer: openCart,
    closeDrawer: closeCart,
  } = useDrawer();
  useCartFetchers(CartForm.ACTIONS.LinesAdd, openCart);
  const rootData = useRouteLoaderData<RootLoader>("root");

  return (
    <>
      <Suspense
        fallback={
          <Link
            to="/cart"
            className={cn(
              "focus:ring-border relative flex items-center justify-center",
              compact ? "size-5" : "size-8",
            )}
          >
            <IconBag
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
              <span>0</span>
            </div>
          </Link>
        }
      >
        <Await resolve={rootData?.cart}>
          {(cart) => (
            <CartTrigger
              cart={cart as CartApiQueryFragment | null}
              compact={compact}
              onOpen={openCart}
            />
          )}
        </Await>
      </Suspense>
      <Drawer
        open={isCartOpen}
        onClose={closeCart}
        openFrom="right"
        heading="CART"
        isForm="cart"
      >
        <div className="flex min-h-0 flex-1 flex-col">
          <Suspense fallback={<CartLoading />}>
            <Await resolve={rootData?.cart}>
              {(cart) => (
                <CartDrawerBody cart={cart as CartReturn} onClose={closeCart} />
              )}
            </Await>
          </Suspense>
        </div>
      </Drawer>
    </>
  );
}

function CartTrigger({
  cart: originalCart,
  compact,
  onOpen,
}: {
  cart: CartApiQueryFragment | null;
  compact: boolean;
  onOpen: () => void;
}) {
  const cart = useOptimisticCart<CartApiQueryFragment>(originalCart);

  return (
    <button
      type="button"
      onClick={onOpen}
      className={cn(
        "focus:ring-border relative flex items-center justify-center",
        compact ? "size-5" : "size-8",
      )}
    >
      <IconBag className={compact ? "size-5" : "size-6"} viewBox="0 0 24 24" />
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

function CartDrawerBody({
  cart: originalCart,
  onClose,
}: {
  cart: CartReturn;
  onClose: () => void;
}) {
  const cart = useOptimisticCart<CartApiQueryFragment>(
    originalCart as CartApiQueryFragment,
  );

  return (
    <>
      {cart?.totalQuantity > 0 && (
        <FreeShippingProgressBar
          cost={cart.cost as CartCost}
          className="px-5 pb-4"
        />
      )}
      <div className="flex min-h-0 flex-1 flex-col px-5">
        <CartMain layout="aside" cart={cart} onClose={onClose} />
      </div>
    </>
  );
}
