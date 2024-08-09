import {Await} from '@remix-run/react';
import {Suspense} from 'react';
import type {
  CartApiQueryFragment,
} from 'storefrontapi.generated';
import {Footer} from '~/components/Footer';
import {Header} from '~/components/Header/Header';
import { EnhancedMenu } from '~/lib/utils';

export type LayoutProps = {
  cart: Promise<CartApiQueryFragment | null>;
  children?: React.ReactNode;
  footerMenu: EnhancedMenu | undefined | null;
  headerMenu: EnhancedMenu | undefined | null;
  isLoggedIn: Promise<boolean>;
};

export function Layout({
  cart,
  children = null,
  footerMenu,
  headerMenu,
  isLoggedIn,
}: LayoutProps) {

  return (
    <>
      {/* <CartAside cart={cart} /> */}
      {/* <SearchAside /> */}
      {/* <MobileMenuAside menu={header?.menu} shop={header?.shop} /> */}
      {headerMenu && <Header headerMenu={headerMenu} cart={cart} isLoggedIn={isLoggedIn} />}
      <main>{children}</main>
      <Suspense>
        <Await resolve={footerMenu}>
          {(footerMenu) => <Footer footerMenu={footerMenu} />}
        </Await>
      </Suspense>
    </>
  );
}
