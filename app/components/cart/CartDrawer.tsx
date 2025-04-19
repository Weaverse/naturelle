import { Await, useRouteLoaderData } from "@remix-run/react";
import { CartForm, type CartReturn } from "@shopify/hydrogen";
import { Suspense } from "react";
import { useCartFetchers } from "~/hooks/useCartFetchers";
import type { RootLoader } from "~/root";
import { Drawer, useDrawer } from "../Drawer";
import { IconBag } from "../Icon";
import { Link } from "../Link";
import { CartMain } from "./Cart";
import { CartLoading } from "./CartLoading";

export function CartDrawer() {
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
            className="focus:ring-border relative flex h-8 w-8 items-center justify-center"
          >
            <IconBag className="h-6 w-6" viewBox="0 0 24 24" />
            <div className="absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--color-header-text)] p-[0.125rem] text-center text-[0.625rem] font-medium leading-none text-[var(--color-transparent-header)] subpixel-antialiased">
              <span>0</span>
            </div>
          </Link>
        }
      >
        <Await resolve={rootData?.cart}>
          {(cart) => (
            <button
              onClick={openCart}
              className="focus:ring-border relative flex h-8 w-8 items-center justify-center"
            >
              <IconBag className="h-6 w-6" viewBox="0 0 24 24" />
              <div className="absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--color-header-text)] p-[0.125rem] text-center text-[0.625rem] font-medium leading-none text-[var(--color-transparent-header)] subpixel-antialiased">
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
        <div>
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
