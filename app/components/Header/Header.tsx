import { useThemeSettings } from "@weaverse/hydrogen";
import { UseMenuDrawerHeader } from "./MenuDrawerHeader";
import { UseMenuMegaHeader } from "./MenuMegaHeader";
import type { LayoutProps } from "../Layout";
import { AnnouncementBar } from "./AnnouncementBar";
import { Drawer, useDrawer } from "../Drawer";
import { Suspense } from "react";
import { CartLoading } from "../CartLoading";
import { Await, useRouteLoaderData } from "@remix-run/react";
import { CartMain } from "../Cart";
import { useCartFetchers } from "~/hooks/useCartFetchers";
import { CartForm, CartReturn } from "@shopify/hydrogen";
import { RootLoader } from "~/root";

type HeaderProps = Pick<LayoutProps, "headerMenu" | "cart">;

export function Header({ headerMenu, cart }: HeaderProps) {
  let settings = useThemeSettings();
  let typeMenu = settings?.typeMenuHeader;
  let enableTrialShipping = settings?.enableTrialShipping;
  const {
    isOpen: isCartOpen,
    openDrawer: openCart,
    closeDrawer: closeCart,
  } = useDrawer();
  useCartFetchers(CartForm.ACTIONS.LinesAdd, openCart);
  return (
    <>
    <CartDrawer isOpen={isCartOpen} onClose={closeCart} />
      {enableTrialShipping && <AnnouncementBar />}
      {typeMenu === "mega" && (
        <UseMenuMegaHeader
          header={headerMenu}
          className="hidden xl:flex"
          openCart={openCart}
        />
      )}
      {typeMenu === "drawer" ? (
        <UseMenuDrawerHeader header={headerMenu} openCart={openCart} />
      ) : (
        <UseMenuDrawerHeader
          header={headerMenu}
          className="block xl:hidden"
          openCart={openCart}
        />
      )}
    </>
  );
}

function CartDrawer({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  let rootData = useRouteLoaderData<RootLoader>("root");
  return (
    <Drawer
      open={isOpen}
      onClose={onClose}
      openFrom="right"
      heading="CART"
      isForm="cart"
    >
      <div>
        <Suspense fallback={<CartLoading />}>
          <Await resolve={rootData?.cart}>
            {(cart) => (
              <CartMain
                layout="aside"
                // onClose={onClose}
                cart={cart as CartReturn}
              />
            )}
          </Await>
        </Suspense>
      </div>
    </Drawer>
  );
}