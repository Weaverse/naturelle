import {cssBundleHref} from '@remix-run/css-bundle';
import {
  isRouteErrorResponse,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useMatches,
  useRouteError,
  type ShouldRevalidateFunction,
} from '@remix-run/react';
import {useNonce} from '@shopify/hydrogen';
import type {CustomerAccessToken} from '@shopify/hydrogen/storefront-api-types';
import {
  defer,
  type LoaderFunctionArgs,
  type SerializeFrom,
} from '@shopify/remix-oxygen';
import {withWeaverse} from '@weaverse/hydrogen';
import {Layout} from '~/components/Layout';
import favicon from '../public/favicon.svg';
import tailwind from './styles/tailwind.css';
import {GlobalStyle} from './weaverse/style';
import '@fontsource-variable/cormorant/wght.css';
import '@fontsource-variable/open-sans/wght.css';
import {Button} from '@/components/button';
import {Image} from '@shopify/hydrogen';
import {Link} from './components/Link';
import {getErrorMessage} from './lib/defineMessageError';

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
    ...(cssBundleHref ? [{rel: 'stylesheet', href: cssBundleHref}] : []),
    {rel: 'stylesheet', href: tailwind},
    {
      rel: 'preconnect',
      href: 'https://cdn.shopify.com',
    },
    {
      rel: 'preconnect',
      href: 'https://shop.app',
    },
    {rel: 'icon', type: 'image/svg+xml', href: favicon},
  ];
}

/**
 * Access the result of the root loader from a React component.
 */
export const useRootLoaderData = () => {
  const [root] = useMatches();
  return root?.data as SerializeFrom<typeof loader>;
};

export async function loader({context}: LoaderFunctionArgs) {
  const {storefront, customerAccount, cart} = context;
  const publicStoreDomain = context.env.PUBLIC_STORE_DOMAIN;

  const isLoggedInPromise = customerAccount.isLoggedIn();

  // defer the cart query by not awaiting it
  const cartPromise = cart.get();

  // defer the footer query (below the fold)
  const footerPromise = storefront.query(FOOTER_QUERY, {
    cache: storefront.CacheLong(),
    variables: {
      footerMenuHandle: 'footer', // Adjust to your footer menu handle
    },
  });

  // await the header query (above the fold)
  const headerPromise = storefront.query(HEADER_QUERY, {
    cache: storefront.CacheLong(),
    variables: {
      headerMenuHandle: 'main-menu', // Adjust to your header menu handle
    },
  });

  return defer(
    {
      cart: cartPromise,
      footer: footerPromise,
      header: await headerPromise,
      selectedLocale: storefront.i18n,
      isLoggedIn: isLoggedInPromise,
      publicStoreDomain,
      weaverseTheme: await context.weaverse.loadThemeSettings(),
      env: context.env,
    },
    {
      headers: {
        'Set-Cookie': await context.session.commit(),
      },
    },
  );
}

function App() {
  const nonce = useNonce();
  const data = useLoaderData<typeof loader>();

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
        <Layout {...data}>
          <Outlet />
        </Layout>
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
        <LiveReload nonce={nonce} />
      </body>
    </html>
  );
}

export default withWeaverse(App);

export function ErrorBoundary() {
  const routeError = useRouteError();
  const rootData = useRootLoaderData();
  const nonce = useNonce();
  let errorMessage = '';
  let errorStatus = 0;
  if (isRouteErrorResponse(routeError)) {
    errorMessage = getErrorMessage(routeError.status);
    errorStatus = routeError.status;
  } else if (routeError instanceof Error) {
    errorMessage = routeError.message;
  }

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
        <Layout {...rootData}>
          <div className="route-error">
            <div className="relative flex lg:h-[720px] md:h-[500px] h-80 w-full items-center justify-center">
              <div className="absolute inset-0 h-full w-full">
                <Image
                  src="https://cdn.shopify.com/s/files/1/0652/5888/1081/files/d63681d5f3e2ce453bcac09ffead4d62.jpg?v=1720369103"
                  loading="lazy"
                  className="h-full object-cover"
                  sizes="auto"
                />
              </div>
              <div className="z-10 flex flex-col items-center gap-4 px-6 py-12 text-center sm:px-10 sm:py-20">
                <h2 className=" text-7xl font-medium text-white">{errorStatus}</h2>
                {errorMessage && (
                  <span className=" font-body font-normal text-white">{errorMessage}</span>
                )}
                <Button variant={'primary'} to='/'>
                  <span className="font-heading text-xl font-medium">
                    Back to Homepage
                  </span>
                </Button>
              </div>
            </div>
          </div>
        </Layout>
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
        <LiveReload nonce={nonce} />
      </body>
    </html>
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
  query Footer(
    $country: CountryCode
    $footerMenuHandle: String!
    $language: LanguageCode
  ) @inContext(language: $language, country: $country) {
    menu(handle: $footerMenuHandle) {
      ...Menu
    }
  }
  ${MENU_FRAGMENT}
` as const;
