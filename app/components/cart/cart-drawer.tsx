import { CartForm, type CartReturn } from "@shopify/hydrogen";
import { Suspense } from "react";
import { Await, useRouteLoaderData } from "react-router";
import { useCartFetchers } from "~/hooks/use-cart-fetchers";
import type { RootLoader } from "~/root";
import { cn } from "~/utils/cn";
import { Drawer, useDrawer } from "../drawer";
import { IconBag } from "../icon";
import { Link } from "../link";
import { CartMain } from "./cart";
import { CartLoading } from "./cart-loading";

export function CartDrawer({ compact = false }: { compact?: boolean }) {
  const {
    isOpen: isCartOpen,
    openDrawer: openCart,
    closeDrawer: closeCart,
  } = useDrawer();
  useCartFetchers(CartForm.ACTIONS.LinesAdd, openCart);
  let rootData = useRouteLoaderData<RootLoader>("root");
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
                  ? "-right-1.5 -top-1.5 size-3.5"
                  : "right-0 top-0 size-4 p-0.5",
              )}
            >
              <span>0</span>
            </div>
          </Link>
        }
      >
        <Await resolve={rootData?.cart}>
          {(cart) => (
            <button
              onClick={openCart}
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
                    ? "-right-1.5 -top-1.5 size-3.5"
                    : "right-0 top-0 size-4 p-0.5",
                )}
              >
                <span>{cart?.totalQuantity || 0}</span>
              </div>
            </button>
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
        <div className="h-full">
          <Suspense fallback={<CartLoading />}>
            <Await resolve={rootData?.cart}>
              {(cart) => <CartMain layout="aside" cart={cart as CartReturn} />}
            </Await>
          </Suspense>
        </div>
      </Drawer>
    </>
  );
}
