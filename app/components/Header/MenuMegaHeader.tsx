import {Await} from '@remix-run/react';
import {CartForm} from '@shopify/hydrogen';
import {useThemeSettings} from '@weaverse/hydrogen';
import {useCartFetchers} from '~/hooks/useCartFetchers';
import {EnhancedMenu, useIsHomePath} from '~/lib/utils';
import {useRootLoaderData} from '~/root';
import clsx from 'clsx';
import {Suspense, useState} from 'react';
import useWindowScroll from 'react-use/lib/useWindowScroll';
import {CartApiQueryFragment} from 'storefrontapi.generated';
import {CartMain} from '../Cart';
import {CartLoading} from '../CartLoading';
import {Drawer, useDrawer} from '../Drawer';
import {IconAccount, IconLogin} from '../Icon';
import {Link} from '../Link';
import {Logo} from '../Logo';
import {MegaMenu} from './menu/MegaMenu';
import {CartCount} from './CartCount';
import { SearchToggle } from './SearchToggle';

export function UseMenuMegaHeader({
  header,
  isLoggedIn,
  cart,
  className,
}: {
  header: EnhancedMenu | null | undefined;
  isLoggedIn: Promise<boolean>;
  cart: Promise<CartApiQueryFragment | null>;
  className?: string;
}) {
  const isHome  = useIsHomePath();
  const {y} = useWindowScroll();
  let settings = useThemeSettings();
  let [hovered, setHovered] = useState(false);
  let {isOpen} = useDrawer();

  let onHover = () => setHovered(true);
  let onLeave = () => setHovered(false);

  let enableTransparent = settings?.enableTransparentHeader && isHome;
  let isTransparent = enableTransparent && y < 50 && !isOpen && !hovered;
  const {
    isOpen: isCartOpen,
    openDrawer: openCart,
    closeDrawer: closeCart,
  } = useDrawer();
  useCartFetchers(CartForm.ACTIONS.LinesAdd, openCart);
  return (
    <header
      role="banner"
      className={clsx(
        enableTransparent ? 'fixed' : 'sticky',
        isTransparent
          ? ' text-secondary bg-transparent border-secondary'
          : 'shadow-header text-primary bg-background-subtle-1 border-foreground',
        'top-0 z-40 w-full border-b',
        className,
      )}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      <div className="z-40 flex transition-all duration-300 h-nav items-center justify-between gap-3 container">
        <div
          className={clsx(
            'absolute inset-0 z-20 bg-background-subtle-1',
            'transition-all duration-500 ease-in-out',
            isTransparent
              ? 'opacity-0'
              : 'opacity-100',
          )}
        ></div>
        <Logo className="z-30 flex justify-start" showTransparent={isTransparent}/>
        <MegaMenu menu={header} />
        <div className="z-30 flex items-center justify-end gap-2">
          <SearchToggle />
          <AccountLink />
          <CartCount isHome={false} openCart={openCart} />
          <Drawer
            open={isCartOpen}
            onClose={closeCart}
            openFrom="right"
            heading="Cart"
            isForm="cart"
          >
            <div>
              <Suspense fallback={<CartLoading />}>
                <Await resolve={cart}>
                  {(cart) => (
                    <CartMain
                      layout="aside"
                      // onClose={onClose}
                      cart={cart}
                    />
                  )}
                </Await>
              </Suspense>
            </div>
          </Drawer>
        </div>
      </div>
    </header>
  );
}

function AccountLink({className}: {className?: string}) {
  const rootData = useRootLoaderData();
  const isLoggedIn = rootData?.isLoggedIn;

  return (
    <Suspense fallback="Sign in">
      <Await resolve={isLoggedIn} errorElement="Sign in">
        {(isLoggedIn) => {
          return isLoggedIn ? (
            <Link prefetch="intent" to="/account" className={className}>
              <IconAccount />
            </Link>
          ) : (
            <Link to="/account/login" className={className}>
              <IconLogin className="h-6 w-6" />
            </Link>
          );
        }}
      </Await>
    </Suspense>
  );
}

