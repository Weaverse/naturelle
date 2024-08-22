import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useMatches,
  useRouteError,
  type ShouldRevalidateFunction,
} from '@remix-run/react';
import {
  Analytics,
  getSeoMeta,
  getShopAnalytics,
  useNonce,
  type SeoConfig,
} from '@shopify/hydrogen';
import {
  defer,
  type LoaderFunctionArgs,
  type MetaArgs,
  type SerializeFrom,
} from '@shopify/remix-oxygen';
import {withWeaverse} from '@weaverse/hydrogen';
import {Layout} from '~/components/Layout';
import tailwind from './styles/tailwind.css?url';
import {GlobalStyle} from './weaverse/style';
import '@fontsource-variable/cormorant/wght.css?url';
import '@fontsource-variable/open-sans/wght.css?url';
import {Button} from '@/components/button';
import {Image} from '@shopify/hydrogen';
import {CustomAnalytics} from '~/components/Analytics';
import {seoPayload} from '~/lib/seo.server';
import {getErrorMessage} from './lib/defineMessageError';
import {parseMenu} from './lib/utils';

/**
 * This is important to avoid re-fetching root queries on sub-navigations
 */
export const shouldRevalidate: ShouldRevalidateFunction = ({
  formMethod,
  currentUrl,
  nextUrl,
}) => {
  // revalidate when a mutation is performed e.g add to cart, login...
  if (formMethod && formMethod !== 'GET') {
    return true;
  }

  // revalidate when manually revalidating via useRevalidator
  if (currentUrl.toString() === nextUrl.toString()) {
    return true;
  }

  return false;
};

export function links() {
  return [
    {rel: 'stylesheet', href: tailwind},
    {
      rel: 'preconnect',
      href: 'https://cdn.shopify.com',
    },
    {
      rel: 'preconnect',
      href: 'https://shop.app',
    },
    {rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg'},
  ];
}

/**
 * Access the result of the root loader from a React component.
 */
export const useRootLoaderData = () => {
  const [root] = useMatches();
  return root?.data as SerializeFrom<typeof loader>;
};

export async function loader({context, request}: LoaderFunctionArgs) {
  const {storefront, customerAccount, cart, env} = context;
  const publicStoreDomain = context.env.PUBLIC_STORE_DOMAIN;

  const isLoggedInPromise = customerAccount.isLoggedIn();

  // defer the footer query (below the fold)
  const footer = await storefront.query(FOOTER_QUERY, {
    cache: storefront.CacheLong(),
    variables: {
      footerMenuHandle: 'footer', // Adjust to your footer menu handle
    },
  });

  // await the header query (above the fold)
  const header = await storefront.query(HEADER_QUERY, {
    cache: storefront.CacheLong(),
    variables: {
      headerMenuHandle: 'main-menu', // Adjust to your header menu handle
    },
  });

  const headerMenu = header?.menu
    ? parseMenu(header.menu, header.shop.primaryDomain.url, env)
    : undefined;
  const footerMenu = footer?.menu
    ? parseMenu(footer.menu, footer.shop.primaryDomain.url, env)
    : undefined;

  const seo = seoPayload.root({shop: header.shop, url: request.url});
  return defer(
    {
      cart: cart.get(),
      shop: getShopAnalytics({
        storefront: context.storefront,
        publicStorefrontId: env.PUBLIC_STOREFRONT_ID,
      }),
      consent: {
        checkoutDomain: env.PUBLIC_CHECKOUT_DOMAIN || env.PUBLIC_STORE_DOMAIN,
        storefrontAccessToken: env.PUBLIC_STOREFRONT_API_TOKEN,
      },
      footerMenu,
      headerMenu,
      seo,
      selectedLocale: storefront.i18n,
      isLoggedIn: isLoggedInPromise,
      publicStoreDomain,
      weaverseTheme: await context.weaverse.loadThemeSettings(),
    },
    {
      headers: {
        'Set-Cookie': await context.session.commit(),
      },
    },
  );
}

export const meta = ({data}: MetaArgs<typeof loader>) => {
  return getSeoMeta(data!.seo as SeoConfig);
};

function IndexLayout({children}: {children?: React.ReactNode}) {
  const nonce = useNonce();
  const data = useRootLoaderData();
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
        <GlobalStyle />
      </head>
      <body>
        {data ? (
          <Analytics.Provider
            cart={data.cart}
            shop={data.shop}
            consent={data.consent}
          >
            <Layout
              {...data}
              footerMenu={data.footerMenu}
              headerMenu={data.headerMenu}
            >
              {children}
            </Layout>
            <CustomAnalytics />
          </Analytics.Provider>
        ) : (
          children
        )}
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
      </body>
    </html>
  );
}

function App() {
  return (
    <IndexLayout>
      <Outlet />
    </IndexLayout>
  );
}

export default withWeaverse(App);
export function ErrorBoundary() {
  const routeError = useRouteError();
  let errorMessage = '';
  let errorStatus = 0;
  
  if (isRouteErrorResponse(routeError)) {
    errorMessage = getErrorMessage(routeError.status);
    errorStatus = routeError.status;
  } else if (routeError instanceof Error) {
    errorMessage = routeError.message;
  }

  return (
    <IndexLayout>
        <div className="relative flex h-80 w-full items-center justify-center md:h-[500px] lg:h-[720px]">
        <div className="absolute inset-0 h-full w-full">
          <Image
            src="https://cdn.shopify.com/s/files/1/0652/5888/1081/files/d63681d5f3e2ce453bcac09ffead4d62.jpg?v=1720369103"
            loading="lazy"
            className="h-full object-cover"
            sizes="auto"
          />
        </div>
        <div className="z-10 flex flex-col items-center gap-4 px-6 py-12 text-center sm:px-10 sm:py-20">
          <h2 className="text-7xl font-medium text-white">{errorStatus}</h2>
          {errorMessage && (
            <span className="font-body font-normal text-white">
              {errorMessage}
            </span>
          )}
          <Button variant={'primary'} to="/">
            <span className="font-heading text-xl font-medium">
              Back to Homepage
            </span>
          </Button>
        </div>
      </div>
    </IndexLayout>
  );
}


const MENU_FRAGMENT = `#graphql
  fragment MenuItem on MenuItem {
    id
    resourceId
    resource {
      ... on Collection {
        image {
          altText
          height
          id
          url
          width
        }
      }
      ... on Product {
        image: featuredImage {
          altText
          height
          id
          url
          width
        }
      }
    }
    tags
    title
    type
    url
  }
  fragment ChildMenuItem on MenuItem {
    ...MenuItem
  }
  fragment ParentMenuItem2 on MenuItem {
    ...MenuItem
    items {
      ...ChildMenuItem
    }
  }
  fragment ParentMenuItem on MenuItem {
    ...MenuItem
    items {
      ...ParentMenuItem2
    }
  }
  fragment Menu on Menu {
    id
    items {
      ...ParentMenuItem
    }
  }
` as const;

const HEADER_QUERY = `#graphql
  fragment Shop on Shop {
    id
    name
    description
    primaryDomain {
      url
    }
    brand {
      logo {
        image {
          url
        }
      }
    }
  }
  query Header(
    $country: CountryCode
    $headerMenuHandle: String!
    $language: LanguageCode
  ) @inContext(language: $language, country: $country) {
    shop {
      ...Shop
    }
    menu(handle: $headerMenuHandle) {
      ...Menu
    }
  }
  ${MENU_FRAGMENT}
` as const;

const FOOTER_QUERY = `#graphql
fragment Shop on Shop {
    id
    name
    description
    primaryDomain {
      url
    }
    brand {
      logo {
        image {
          url
        }
      }
    }
  }
  query Footer(
    $country: CountryCode
    $footerMenuHandle: String!
    $language: LanguageCode
  ) @inContext(language: $language, country: $country) {
    shop {
      ...Shop
    }
    menu(handle: $footerMenuHandle) {
      ...Menu
    }
  }
  ${MENU_FRAGMENT}
` as const;
