import { CartForm, type CartReturn } from "@shopify/hydrogen";
import { Suspense } from "react";
import { Await, useRouteLoaderData } from "react-router";
import { useCartFetchers } from "~/hooks/use-cart-fetchers";
import type { RootLoader } from "~/root";
import { Drawer, useDrawer } from "../drawer";
import { IconBag } from "../icon";
import { Link } from "../link";
import { CartMain } from "./cart";
import { CartLoading } from "./cart-loading";

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
            <div className="absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-(--color-header-text) p-0.5 text-center text-[0.625rem] font-medium leading-none text-(--color-transparent-header) subpixel-antialiased">
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
              <div className="absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-(--color-header-text) p-0.5 text-center text-[0.625rem] font-medium leading-none text-(--color-transparent-header) subpixel-antialiased">
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
