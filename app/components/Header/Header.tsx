import {useThemeSettings} from '@weaverse/hydrogen';
import {UseMenuDrawerHeader} from './MenuDrawerHeader';
import {UseMenuMegaHeader} from './MenuMegaHeader';
import type {LayoutProps} from '../Layout';
import { AnnouncementBar } from './AnnouncementBar';

type HeaderProps = Pick<LayoutProps, 'headerMenu' | 'cart' | 'isLoggedIn'>;

export function Header({headerMenu, isLoggedIn, cart}: HeaderProps) {
  let settings = useThemeSettings();
  let typeMenu = settings?.typeMenuHeader;
  let enableTrialShipping = settings?.enableTrialShipping;
  return (
    <>
      {enableTrialShipping && <AnnouncementBar/>}
      {typeMenu === 'mega' && (
        <UseMenuMegaHeader
          header={headerMenu}
          isLoggedIn={isLoggedIn}
          cart={cart}
          className="hidden xl:flex"
        />
      )}
      {typeMenu === 'drawer' ? (
        <UseMenuDrawerHeader
          header={headerMenu}
          isLoggedIn={isLoggedIn}
          cart={cart}
        />
      ) : (
        <UseMenuDrawerHeader
          header={headerMenu}
          isLoggedIn={isLoggedIn}
          cart={cart}
          className="block xl:hidden"
        />
      )}
    </>
  );
}

// export function HeaderMenu({
//   menu,
//   primaryDomainUrl,
//   viewport,
//   showMenu,
//   onCloseMenu,
// }: {
//   menu: HeaderProps['header']['menu'];
//   primaryDomainUrl: HeaderQuery['shop']['primaryDomain']['url'];
//   viewport: Viewport;
//   showMenu: boolean;
//   onCloseMenu: () => void;
// }) {
//   const {publicStoreDomain} = useRootLoaderData();
//   // const className = `header-menu-${viewport}`;

//   function closeAside(event: React.MouseEvent<HTMLAnchorElement>) {
//     if (viewport === 'desktop') {
//       event.preventDefault();
//       window.location.href = event.currentTarget.href;
//     }
//     onCloseMenu();
//   }
//   return (
//     <div className="flex h-full w-full flex-col border-t border-bar-subtle bg-background-subtle-1">
//       <div className="grid h-full grid-cols-1 duration-500 sm:container  md:grid-cols-2">
//         <nav
//           className="flex flex-col gap-4 pb-8 pl-6 pr-8 pt-8 md:gap-5 md:pl-12 lg:gap-6 lg:pb-16 lg:pl-20"
//           role="navigation"
//         >
//           {/* {viewport === 'mobile' && (
//         <NavLink
//           end
//           onClick={closeAside}
//           prefetch="intent"
//           style={activeLinkStyle}
//           to="/"
//         >
//           Home
//         </NavLink>
//       )} */}
//           {(menu || FALLBACK_HEADER_MENU).items.map((item) => {
//             if (!item.url) return null;

//             // if the url is internal, we strip the domain
//             const url =
//               item.url.includes('myshopify.com') ||
//               item.url.includes(publicStoreDomain) ||
//               item.url.includes(primaryDomainUrl)
//                 ? new URL(item.url).pathname
//                 : item.url;
//             return (
//               <NavLink
//                 className="font-heading text-4xl text-foreground-subtle transition-colors duration-300 hover:text-foreground-basic"
//                 end
//                 key={item.id}
//                 onClick={(event) => {
//                   closeAside(event);
//                 }}
//                 prefetch="intent"
//                 to={url}
//               >
//                 <h3 className=" font-medium">{item.title}</h3>
//               </NavLink>
//             );
//           })}
//         </nav>
//         {/* <div
//           style={{
//             backgroundImage:
//               'url(https://cdn.shopify.com/s/files/1/0838/0052/3057/files/naturelle-menu-bg.jpg?v=1706411874)',
//           }}
//         ></div> */}
//         <div className="h-full w-full">
//           <Image
//             data={{
//               url: 'https://cdn.shopify.com/s/files/1/0838/0052/3057/files/naturelle-menu-bg.jpg?v=1706411874',
//               altText: 'Naturelle Menu',
//               // width: 668,
//               // height: 1002,
//             }}
//             loading="eager"
//             className="aspect-square h-full object-cover lg:aspect-[2/1]"
//             sizes="auto"
//           />
//         </div>
//       </div>
//     </div>
//   );
// }

function HeaderMenuMobileToggle() {
  return (
    <a className="header-menu-mobile-toggle" href="#mobile-menu-aside">
      <h3>☰</h3>
    </a>
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
