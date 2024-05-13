import {Input} from '@/components/input';
import { Button } from "@/components/button";
import {NavLink, useFetcher} from '@remix-run/react';
import type {FooterQuery, HeaderQuery} from 'storefrontapi.generated';
import {useRootLoaderData} from '~/root';
import { IconSpinner } from "./Icon";

export function Footer({
  menu,
  shop,
}: FooterQuery & {shop: HeaderQuery['shop']}) {
  let fetcher = useFetcher<any>()
  let isError = fetcher.state ==='idle' && fetcher.data?.errors 
  return (
    <footer className="footer bg-background-subtle-2">
      <div className="grid lg:container grid-cols-1 px-4 pt-6 pb-10 md:px-6 md:pt-0 md:pb-0 gap-y-6 md:grid-cols-2 md:divide-x">
        <div className="space-y-4 md:pt-10 md:pb-16 md:pr-6 lg:px-10 lg:pt-16 lg:pb-24">
          <h3>Newsletter</h3>
          <p>Sign up for 15% off and updates straight to your inbox.</p>
          <fetcher.Form method="POST" action="/api/customer" className="flex gap-2">
            <Input
              className="bg-transparent"
              type="email"
              name="email"
              placeholder="Enter your email"
              required
            />
            <Button loading={fetcher.state === 'submitting'} type="submit">Subscribe</Button>
          </fetcher.Form>
          {isError && <p className="!mt-1 text-xs text-red-700">{fetcher.data.errors[0].message}</p>}
        </div>
        <div className="space-y-6 md:p-16 md:pb-24">
          <h3>Quick links</h3>
          {menu && shop?.primaryDomain?.url && (
            <FooterMenu menu={menu} primaryDomainUrl={shop.primaryDomain.url} />
          )}
        </div>
      </div>
    </footer>
  );
}

function FooterMenu({
  menu,
  primaryDomainUrl,
}: {
  menu: FooterQuery['menu'];
  primaryDomainUrl: HeaderQuery['shop']['primaryDomain']['url'];
}) {
  const {publicStoreDomain} = useRootLoaderData();

  return (
    <nav className="flex flex-col gap-4" role="navigation">
      {(menu || FALLBACK_FOOTER_MENU).items.map((item) => {
        if (!item.url) return null;
        // if the url is internal, we strip the domain
        const url =
          item.url.includes('myshopify.com') ||
          item.url.includes(publicStoreDomain) ||
          item.url.includes(primaryDomainUrl)
            ? new URL(item.url).pathname
            : item.url;
        const isExternal = !url.startsWith('/');
        return isExternal ? (
          <a href={url} key={item.id} rel="noopener noreferrer" target="_blank">
            {item.title}
          </a>
        ) : (
          <NavLink
            end
            key={item.id}
            prefetch="intent"
            // style={activeLinkStyle}
            to={url}
          >
            {item.title}
          </NavLink>
        );
      })}
    </nav>
  );
}

const FALLBACK_FOOTER_MENU = {
  id: 'gid://shopify/Menu/199655620664',
  items: [
    {
      id: 'gid://shopify/MenuItem/461633060920',
      resourceId: 'gid://shopify/ShopPolicy/23358046264',
      tags: [],
      title: 'Privacy Policy',
      type: 'SHOP_POLICY',
      url: '/policies/privacy-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633093688',
      resourceId: 'gid://shopify/ShopPolicy/23358013496',
      tags: [],
      title: 'Refund Policy',
      type: 'SHOP_POLICY',
      url: '/policies/refund-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633126456',
      resourceId: 'gid://shopify/ShopPolicy/23358111800',
      tags: [],
      title: 'Shipping Policy',
      type: 'SHOP_POLICY',
      url: '/policies/shipping-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633159224',
      resourceId: 'gid://shopify/ShopPolicy/23358079032',
      tags: [],
      title: 'Terms of Service',
      type: 'SHOP_POLICY',
      url: '/policies/terms-of-service',
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
    color: isPending ? 'grey' : 'white',
  };
}
