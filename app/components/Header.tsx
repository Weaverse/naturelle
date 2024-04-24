import {Await, Form, NavLink} from '@remix-run/react';
import {Suspense, useEffect, useMemo, useState} from 'react';
import type {HeaderQuery} from 'storefrontapi.generated';
import {useRootLoaderData} from '~/root';
import type {LayoutProps} from './Layout';
import {Logo} from './Logo';
import {Link} from './Link';
import {IconAccount, IconBag, IconClose, IconLogin, IconSearch} from './Icon';
import {CartForm, Image} from '@shopify/hydrogen';
import {Drawer} from './Drawer';
import {CartDrawer, useCartDrawer} from './CartDrawer';
import {CartLoading} from './CartLoading';
import Cart from '~/routes/($locale).cart';
import {CartMain} from './Cart';
import { useCartFetchers } from "~/hooks/useCartFetchers";
type HeaderProps = Pick<LayoutProps, 'header' | 'cart' | 'isLoggedIn'>;

type Viewport = 'desktop' | 'mobile';

export function Header({header, isLoggedIn, cart}: HeaderProps) {
  const {shop, menu} = header;
  let [showMenu, setShowMenu] = useState(false);
  return (
    <header className="grid grid-cols-3 gap-4 items-center py-4 px-6 bg-background-subtle-1">
      <Logo />
      {/* <button className="text-center" onClick={() => setShowMenu(true)}> */}
      <Drawer
        trigger={<button>MENU</button>}
        open={showMenu}
        onOpenChange={setShowMenu}
        className="bg-white flex flex-col h-fit w-full fixed top-0"
      >
        <HeaderMenu
          menu={menu}
          viewport="desktop"
          primaryDomainUrl={header.shop.primaryDomain.url}
          showMenu={showMenu}
          onCloseMenu={() => setShowMenu(false)}
        />
      </Drawer>

      <HeaderCtas isLoggedIn={isLoggedIn} cart={cart} />
    </header>
  );
}

export function HeaderMenu({
  menu,
  primaryDomainUrl,
  viewport,
  showMenu,
  onCloseMenu,
}: {
  menu: HeaderProps['header']['menu'];
  primaryDomainUrl: HeaderQuery['shop']['primaryDomain']['url'];
  viewport: Viewport;
  showMenu: boolean;
  onCloseMenu: () => void;
}) {
  const {publicStoreDomain} = useRootLoaderData();
  // const className = `header-menu-${viewport}`;

  function closeAside(event: React.MouseEvent<HTMLAnchorElement>) {
    if (viewport === 'mobile') {
      event.preventDefault();
      window.location.href = event.currentTarget.href;
    }
  }

  return (
    <div className="w-full h-full bg-background-subtle-1 flex flex-col">
      <div className="h-8 w-full border-b flex items-center justify-end p-8"></div>
      <div className="h-full grid grid-cols-1 md:grid-cols-2 duration-500  container">
        <nav className="flex flex-col gap-4 p-8" role="navigation">
          {/* {viewport === 'mobile' && (
        <NavLink
          end
          onClick={closeAside}
          prefetch="intent"
          style={activeLinkStyle}
          to="/"
        >
          Home
        </NavLink>
      )} */}
          {(menu || FALLBACK_HEADER_MENU).items.map((item) => {
            if (!item.url) return null;

            // if the url is internal, we strip the domain
            const url =
              item.url.includes('myshopify.com') ||
              item.url.includes(publicStoreDomain) ||
              item.url.includes(primaryDomainUrl)
                ? new URL(item.url).pathname
                : item.url;
            return (
              <NavLink
                className="font-heading text-4xl"
                end
                key={item.id}
                onClick={closeAside}
                prefetch="intent"
                to={url}
              >
                {item.title}
              </NavLink>
            );
          })}
        </nav>
        {/* <div
          style={{
            backgroundImage:
              'url(https://cdn.shopify.com/s/files/1/0838/0052/3057/files/naturelle-menu-bg.jpg?v=1706411874)',
          }}
        ></div> */}
        <div className="h-auto w-full">
          <Image
            data={{
              url: 'https://cdn.shopify.com/s/files/1/0838/0052/3057/files/naturelle-menu-bg.jpg?v=1706411874',
              altText: 'Naturelle Menu',
              // width: 668,
              // height: 1002,
            }}
            loading="eager"
            className="object-cover aspect-auto lg:aspect-[2/1]"
            sizes="auto"
          />
        </div>
      </div>
    </div>
  );
}

function HeaderCtas({
  isLoggedIn,
  cart,
}: Pick<HeaderProps, 'isLoggedIn' | 'cart'>) {
  const {
    isOpen: isCartOpen,
    openDrawer: openCart,
    closeDrawer: closeCart,
  } = useCartDrawer();
  useCartFetchers(CartForm.ACTIONS.LinesAdd, openCart);

  return (
    <nav
      className="header-ctas justify-end items-center flex gap-2"
      role="navigation"
    >
      {/* <HeaderMenuMobileToggle /> */}
      <SearchToggle />
      <AccountLink />
      <CartCount isHome={false} openCart={openCart} />
      <CartDrawer
        open={isCartOpen}
        onClose={closeCart}
        openFrom="right"
        heading="Cart"
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
      </CartDrawer>
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
              <IconLogin className="w-6 h-6" />
            </Link>
          );
        }}
      </Await>
    </Suspense>
  );
}

function HeaderMenuMobileToggle() {
  return (
    <a className="header-menu-mobile-toggle" href="#mobile-menu-aside">
      <h3>☰</h3>
    </a>
  );
}

function SearchToggle() {
  return (
    <Form method="get" action="/search" className="flex items-center gap-2">
      <button
        type="submit"
        className="relative flex items-center justify-center w-8 h-8 focus:ring-primary/5"
      >
        <IconSearch className="w-6 h-6" />
      </button>
    </Form>
  );
}

function CartCount({
  isHome,
  openCart,
}: {
  isHome: boolean;
  openCart: () => void;
}) {
  const rootData = useRootLoaderData();
  return (
    <Suspense fallback={<Badge count={0} dark={isHome} openCart={openCart} />}>
      <Await resolve={rootData?.cart}>
        {(cart) => (
          <Badge
            dark={isHome}
            openCart={openCart}
            count={cart?.totalQuantity || 0}
          />
        )}
      </Await>
    </Suspense>
  );
}

function Badge({
  openCart,
  dark,
  count,
}: {
  count: number;
  dark: boolean;
  openCart: () => void;
}) {
  const isHydrated = true; // useIsHydrated();

  const BadgeCounter = useMemo(
    () => (
      <>
        <IconBag className="w-6 h-6" viewBox="0 0 24 24" />
        <div className="bg-primary text-primary-foreground absolute top-0 right-0 text-[0.625rem] font-medium subpixel-antialiased h-4 w-4 flex items-center justify-center leading-none text-center rounded-full p-[0.125rem]">
          <span>{count || 0}</span>
        </div>
      </>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [count, dark],
  );

  return isHydrated ? (
    <button
      onClick={openCart}
      className="relative flex items-center justify-center w-8 h-8 focus:ring-border"
    >
      {BadgeCounter}
    </button>
  ) : (
    <Link
      to="/cart"
      className="relative flex items-center justify-center w-8 h-8 focus:ring-border"
    >
      {BadgeCounter}
    </Link>
  );
}

// function CartBadge({count}: {count: number}) {
//   return <a href="#cart-aside">Cart {count}</a>;
// }

// function CartToggle({cart}: Pick<HeaderProps, 'cart'>) {
//   return (
//     <Suspense fallback={<CartBadge count={0} />}>
//       <Await resolve={cart}>
//         {(cart) => {
//           if (!cart) return <CartBadge count={0} />;
//           return <CartBadge count={cart.totalQuantity || 0} />;
//         }}
//       </Await>
//     </Suspense>
//   );
// }

const FALLBACK_HEADER_MENU = {
  id: 'gid://shopify/Menu/199655587896',
  items: [
    {
      id: 'gid://shopify/MenuItem/461609500728',
      resourceId: null,
      tags: [],
      title: 'Collections',
      type: 'HTTP',
      url: '/collections',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609533496',
      resourceId: null,
      tags: [],
      title: 'Blog',
      type: 'HTTP',
      url: '/blogs/journal',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609566264',
      resourceId: null,
      tags: [],
      title: 'Policies',
      type: 'HTTP',
      url: '/policies',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609599032',
      resourceId: 'gid://shopify/Page/92591030328',
      tags: [],
      title: 'About',
      type: 'PAGE',
      url: '/pages/about',
      items: [],
    },
  ],
};

function activeLinkStyle({
  isActive,
  isPending,
}: {
  isActive: boolean;
  isPending: boolean;
}) {
  return {
    fontWeight: isActive ? 'bold' : undefined,
    color: isPending ? 'grey' : 'black',
  };
}
