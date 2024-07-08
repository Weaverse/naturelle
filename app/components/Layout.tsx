import {Await} from '@remix-run/react';
import {Suspense} from 'react';
import type {
  CartApiQueryFragment,
  FooterQuery,
  HeaderQuery,
} from 'storefrontapi.generated';
import {Aside} from '~/components/Aside';
import {Footer} from '~/components/Footer';
import {Header, HeaderMenu} from '~/components/Header/Header';
import {CartMain} from '~/components/Cart';
import { AppLoadContext } from '@shopify/remix-oxygen';

export type LayoutProps = {
  cart: Promise<CartApiQueryFragment | null>;
  children?: React.ReactNode;
  footer: Promise<FooterQuery>;
  header: HeaderQuery;
  isLoggedIn: Promise<boolean>;
  env: AppLoadContext['env'];
};

export function Layout({
  cart,
  children = null,
  footer,
  header,
  isLoggedIn,
  env,
}: LayoutProps) {
  return (
    <>
      {/* <CartAside cart={cart} /> */}
      {/* <SearchAside /> */}
      {/* <MobileMenuAside menu={header?.menu} shop={header?.shop} /> */}
      {header && <Header header={header} cart={cart} isLoggedIn={isLoggedIn} env={env} />}
      <main>{children}</main>
      <Suspense>
        <Await resolve={footer}>
          {(footer) => <Footer menu={footer?.menu} shop={header?.shop} />}
        </Await>
      </Suspense>
    </>
  );
}
