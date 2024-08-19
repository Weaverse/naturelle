import {Button} from '@/components/button';
import {Input} from '@/components/input';
import {Disclosure} from '@headlessui/react';
import {NavLink, useFetcher} from '@remix-run/react';
import {useThemeSettings} from '@weaverse/hydrogen';
import {getMaxDepth} from '~/lib/menu';
import {SingleMenuItem} from '~/lib/type';
import {EnhancedMenu} from '~/lib/utils';
import React from 'react';
import {CountrySelector} from './CountrySelector';
import {IconPlusLinkFooter} from './Icon';
import {LayoutProps} from './Layout';

type FooterProps = Pick<LayoutProps, 'footerMenu'>;
export function Footer({footerMenu}: FooterProps) {
  let fetcher = useFetcher<any>();
  let isError = fetcher.state === 'idle' && fetcher.data?.errors;
  const settings = useThemeSettings();
  let {
    footerTextCopyright,
    newsletterTitle,
    newsletterDescription,
    newsletterPlaceholder,
    newsletterButtonText,
  } = settings;
  return (
    <footer className="footer w-full bg-[var(--footer-menu-background-color)]">
      <div className="container flex h-fit flex-col gap-6 px-4 pb-10 pt-6 md:gap-10 md:px-6 md:py-10 lg:gap-8 lg:px-0 lg:py-16">
        <div className="flex flex-col justify-center gap-4 md:flex-row md:gap-4 lg:gap-10">
          <div className="flex w-full flex-col items-start gap-6 border-b border-foreground pb-6 md:h-fit md:border-none md:pb-0">
            {newsletterTitle && <h3>{newsletterTitle}</h3>}
            <div className="flex w-fit flex-col gap-4 md:h-fit">
              {newsletterDescription && <p>{newsletterDescription}</p>}
              {newsletterButtonText && (
                <fetcher.Form
                  method="POST"
                  action="/api/customer"
                  className="flex gap-2"
                >
                  <Input
                    className="bg-transparent"
                    type="email"
                    name="email"
                    placeholder={newsletterPlaceholder}
                    required
                  />
                  <Button
                    loading={fetcher.state === 'submitting'}
                    type="submit"
                  >
                    {newsletterButtonText}
                  </Button>
                </fetcher.Form>
              )}
              {isError && (
                <p className="!mt-1 text-xs text-red-700">
                  {fetcher.data.errors[0].message}
                </p>
              )}
            </div>
          </div>
          {footerMenu && <FooterMenu menu={footerMenu} />}
        </div>
        <div className="flex w-full flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <CountrySelector />
          <p className="text-xs">{footerTextCopyright}</p>
        </div>
      </div>
    </footer>
  );
}

function FooterMenu({menu}: {menu: EnhancedMenu | undefined | null}) {
  let items = menu?.items as unknown as SingleMenuItem[];
  if (!items) return null;
  return (
    <div className="w-full">
      <nav
        className="flex flex-col justify-between gap-4 md:flex-row md:gap-0"
        role="navigation"
      >
        {items.map((item, id) => {
          let {title, ...rest} = item;
          let level = getMaxDepth(item);
          let Comp: React.FC<SingleMenuItem>;
          if (level === 2) {
            Comp = MenuLink;
          } else if (level === 1) {
            Comp = HeaderText;
          } else {
            return null;
          }
          return <Comp key={id} {...rest} title={title} />;
        })}
      </nav>
    </div>
  );
}

function MenuLink(props: SingleMenuItem) {
  let {title, items, to} = props;
  return (
    <>
      <div className="hidden flex-col gap-6 md:flex">
        <h4 className="font-medium uppercase">
          <span className="font-heading">{title}</span>
        </h4>
        <ul className="space-y-1.5">
          {items.map((subItem, ind) => (
            <li key={ind} className="leading-6">
              <NavLink to={subItem.to} prefetch="intent">
                <span className="text-animation font-body font-normal">
                  {subItem.title}
                </span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
      <div className="block border-b border-foreground pb-4 md:hidden">
        <Disclosure>
          {({open}) => (
            <>
              <Disclosure.Button className="w-full text-left">
                <h4 className="flex justify-between font-medium uppercase">
                  {title}
                  <span>
                    <IconPlusLinkFooter
                      open={open}
                      className={`trasition-transform h-5 w-5 duration-300 ${open ? 'rotate-90' : 'rotate-0'}`}
                    />
                  </span>
                </h4>
              </Disclosure.Button>
              <div
                className={`${
                  open ? `h-fit max-h-48` : `max-h-0`
                } overflow-hidden transition-all duration-300`}
              >
                <Disclosure.Panel static>
                  <ul className="space-y-3 pb-3 pt-2">
                    {items.map((subItem, ind) => (
                      <li key={ind} className="leading-6">
                        <NavLink key={ind} to={subItem.to} prefetch="intent">
                          <span className="font-body font-normal">
                            {subItem.title}
                          </span>
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </Disclosure.Panel>
              </div>
            </>
          )}
        </Disclosure>
      </div>
    </>
  );
}

function HeaderText({title, to}: {title: string; to: string}) {
  return <h4 className="font-heading font-medium uppercase">{title}</h4>;
}

// function FooterMenu({
//   menu,
//   primaryDomainUrl,
// }: {
//   menu: FooterQuery['menu'];
//   primaryDomainUrl: FooterQuery['shop']['primaryDomain']['url'];
// }) {
//   const {publicStoreDomain} = useRootLoaderData();

//   return (
//     <nav className="flex flex-col gap-4" role="navigation">
//       {(menu || FALLBACK_FOOTER_MENU).items.map((item) => {
//         if (!item.url) return null;
//         // if the url is internal, we strip the domain
//         const url =
//           item.url.includes('myshopify.com') ||
//           item.url.includes(publicStoreDomain) ||
//           item.url.includes(primaryDomainUrl)
//             ? new URL(item.url).pathname
//             : item.url;
//         const isExternal = !url.startsWith('/');
//         return isExternal ? (
//           <a href={url} key={item.id} rel="noopener noreferrer" target="_blank">
//             {item.title}
//           </a>
//         ) : (
//           <NavLink
//             end
//             key={item.id}
//             prefetch="intent"
//             // style={activeLinkStyle}
//             to={url}
//           >
//             {item.title}
//           </NavLink>
//         );
//       })}
//     </nav>
//   );
// }

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
