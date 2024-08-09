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
import {CartCount} from './CartCount';
import {DrawerMenu} from './menu/DrawerMenu';
import {SearchToggle} from './SearchToggle';

export function UseMenuDrawerHeader({
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
  let {stickyAnnouncementBar, announcementBarHeight} = useThemeSettings();
  const isHome = useIsHomePath();
  const {y} = useWindowScroll();
  let settings = useThemeSettings();
  let [hovered, setHovered] = useState(false);
  let {isOpen} = useDrawer();

  let onHover = () => setHovered(true);
  let onLeave = () => setHovered(false);

  let enableTransparent = settings?.enableTransparentHeader && isHome;
  let isTransparent = enableTransparent && y < 50 && !isOpen && !hovered;
  let top = stickyAnnouncementBar
    ? announcementBarHeight
    : Math.max(announcementBarHeight - y, 0);
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
          ? 'border-secondary bg-transparent text-secondary'
          : 'shadow-header border-foreground bg-background-subtle-1 text-primary',
        'top-0 z-40 w-full border-b border-foreground',
        className,
      )}
      style={{['--announcement-bar-height' as string]: `${top}px`}}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      <div className="z-40 flex h-nav items-center justify-between gap-3 px-6 py-4 transition-all duration-300 container">
        <div
          className={clsx(
            'absolute inset-0 z-20 bg-background-subtle-1',
            'transition-all duration-300 ease-in-out',
            isTransparent ? 'opacity-0' : 'opacity-100',
          )}
        ></div>
        {header && <HeaderMenuDrawer menu={header} />}
        <Logo
          className="z-30 flex w-full justify-center"
          showTransparent={isTransparent}
        />
        {/* <button className="text-center" onClick={() => setShowMenu(true)}> */}
        <div className="z-30 flex items-center justify-end gap-2">
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

function HeaderMenuDrawer({menu}: {menu?: EnhancedMenu | null | undefined}) {
  let {isOpen: showMenu, openDrawer, closeDrawer} = useDrawer();
  return (
    <nav
      className="z-30 flex items-center justify-start gap-3"
      role="navigation"
    >
      <button className="text-left" onClick={openDrawer}>
        <span>☰</span>
      </button>
      <SearchToggle isOpenDrawerHearder={true} />
      <Drawer
        open={showMenu}
        onClose={closeDrawer}
        openFrom="left"
        // className="fixed top-0 flex h-fit w-full flex-col bg-white"
        heading="MENU"
      >
        {/* <HeaderMenu
              menu={menu}
              viewport="desktop"
              primaryDomainUrl={header.shop.primaryDomain.url}
              showMenu={showMenu}
              onCloseMenu={closeDrawer}
            /> */}
        <DrawerMenu menu={menu} />
      </Drawer>
    </nav>
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
