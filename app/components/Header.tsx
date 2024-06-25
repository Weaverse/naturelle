import {Await, Form, NavLink} from '@remix-run/react';
import {CartForm, Image} from '@shopify/hydrogen';
import {useCartFetchers} from '~/hooks/useCartFetchers';
import {useRootLoaderData} from '~/root';
import {Suspense, useMemo} from 'react';
import type {HeaderQuery} from 'storefrontapi.generated';
import {CartMain} from './Cart';
import {CartLoading} from './CartLoading';
import {Drawer, useDrawer} from './Drawer';
import {IconAccount, IconBag, IconListMenu, IconLogin, IconSearch} from './Icon';
import type {LayoutProps} from './Layout';
import {Link} from './Link';
import {Logo} from './Logo';
import {PredictiveSearch} from './predictive-search/PredictiveSearch';
import { DrawerMenu } from './menu/DrawerMenu';

type HeaderProps = Pick<LayoutProps, 'header' | 'cart' | 'isLoggedIn'>;

type Viewport = 'desktop' | 'mobile';

export function Header({header, isLoggedIn, cart}: HeaderProps) {
  const {shop, menu} = header;
  let {isOpen: showMenu, openDrawer, closeDrawer} = useDrawer();
  return (
    <header className="z-10 border-b border-foreground bg-background-subtle-1">
      <div className='grid sm:h-screen-no-nav grid-cols-3 items-center gap-3 px-6 py-4 lg:container'>
        <button className='text-left' onClick={openDrawer}><span><IconListMenu/></span></button>
        <Logo />
        {/* <button className="text-center" onClick={() => setShowMenu(true)}> */}
        <Drawer
          open={showMenu}
          onClose={closeDrawer}
          openFrom="left"
          // className="fixed top-0 flex h-fit w-full flex-col bg-white"
          heading='MENU'
        >
          {/* <HeaderMenu
            menu={menu}
            viewport="desktop"
            primaryDomainUrl={header.shop.primaryDomain.url}
            showMenu={showMenu}
            onCloseMenu={closeDrawer}
          /> */}
          <DrawerMenu />
        </Drawer>

        <HeaderCtas isLoggedIn={isLoggedIn} cart={cart} />
      </div>
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
    if (viewport === 'desktop') {
      event.preventDefault();
      window.location.href = event.currentTarget.href;
    }
    onCloseMenu();
  }
  return (
    <div className="flex h-full w-full flex-col border-t border-bar-subtle bg-background-subtle-1">
      <div className="sm:container grid h-full grid-cols-1 duration-500  md:grid-cols-2">
        <nav className="flex flex-col gap-4 md:gap-5 lg:gap-6 pl-6 pt-8 pb-8 pr-8 md:pl-12 lg:pl-20 lg:pb-16" role="navigation">
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
                className="font-heading text-4xl text-foreground-subtle transition-colors duration-300 hover:text-foreground-basic"
                end
                key={item.id}
                onClick={(event) => {
                  closeAside(event);
                }}
                prefetch="intent"
                to={url}
              >
                <h3 className=" font-medium">{item.title}</h3>
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
        <div className="h-full w-full">
          <Image
            data={{
              url: 'https://cdn.shopify.com/s/files/1/0838/0052/3057/files/naturelle-menu-bg.jpg?v=1706411874',
              altText: 'Naturelle Menu',
              // width: 668,
              // height: 1002,
            }}
            loading="eager"
            className="object-cover h-full aspect-square lg:aspect-[2/1]"
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
  } = useDrawer();
  useCartFetchers(CartForm.ACTIONS.LinesAdd, openCart);

  return (
    <nav
      className="header-ctas flex items-center justify-end gap-2"
      role="navigation"
    >
      {/* <HeaderMenuMobileToggle /> */}
      <SearchToggle />
      <AccountLink />
      <CartCount isHome={false} openCart={openCart} />
      <Drawer
        open={isCartOpen}
        onClose={closeCart}
        openFrom="right"
        heading="Cart"
        isForm='cart'
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

function HeaderMenuMobileToggle() {
  return (
    <a className="header-menu-mobile-toggle" href="#mobile-menu-aside">
      <h3>☰</h3>
    </a>
  );
}

function SearchToggle() {
  const {isOpen, closeDrawer, openDrawer} = useDrawer();
  return (
    <>
      <button
        onClick={openDrawer}
        className="relative flex h-8 w-8 items-center justify-center focus:ring-primary/5"
      >
        <IconSearch className="h-6 w-6 !font-extralight" />
      </button>
      <Drawer open={isOpen} onClose={closeDrawer} openFrom="right" heading="Search" isForm='search'>
        <PredictiveSearch isOpen={isOpen} />
      </Drawer>
    </>
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
        <IconBag className="h-6 w-6" viewBox="0 0 24 24" />
        <div className="absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-primary p-[0.125rem] text-center text-[0.625rem] font-medium leading-none text-primary-foreground subpixel-antialiased">
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
      className="focus:ring-border relative flex h-8 w-8 items-center justify-center"
    >
      {BadgeCounter}
    </button>
  ) : (
    <Link
      to="/cart"
      className="focus:ring-border relative flex h-8 w-8 items-center justify-center"
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
      title: 'Products',
      type: 'HTTP',
      url: '/products',
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
