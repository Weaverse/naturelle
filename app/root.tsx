import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  type ShouldRevalidateFunction,
  isRouteErrorResponse,
  useMatches,
  useRouteError,
  useRouteLoaderData,
} from "@remix-run/react";
import {
  Analytics,
  Image,
  type SeoConfig,
  getSeoMeta,
  getShopAnalytics,
  useNonce,
} from "@shopify/hydrogen";
import {
  type AppLoadContext,
  type LoaderFunctionArgs,
  type MetaArgs,
  type SerializeFrom,
  defer,
} from "@shopify/remix-oxygen";
import { withWeaverse } from "@weaverse/hydrogen";
import { Layout as LayoutComponent } from "~/components/Layout";
import tailwind from "./styles/tailwind.css?url";
import { GlobalStyle } from "./weaverse/style";
import "@fontsource-variable/cormorant";
import "@fontsource-variable/nunito-sans";
import { Button } from "~/components/button";
import invariant from "tiny-invariant";
import { CustomAnalytics } from "~/components/Analytics";
import { seoPayload } from "~/lib/seo.server";
import { GlobalLoading } from "./components/global-loading";
import { Preloader } from "./components/Preloader";
import { getErrorMessage } from "./lib/defineMessageError";
import { DEFAULT_LOCALE, parseMenu } from "./lib/utils";

export type RootLoader = typeof loader;

export let shouldRevalidate: ShouldRevalidateFunction = ({
  formMethod,
  currentUrl,
  nextUrl,
}) => {
  // revalidate when a mutation is performed e.g add to cart, login...
  if (formMethod && formMethod !== "GET") {
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
    { rel: "stylesheet", href: tailwind },
    {
      rel: "preconnect",
      href: "https://cdn.shopify.com",
    },
    {
      rel: "preconnect",
      href: "https://shop.app",
    },
    { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
  ];
}

/**
 * Access the result of the root loader from a React component.
 */
export const useRootLoaderData = () => {
  const [root] = useMatches();
  return root?.data as SerializeFrom<typeof loader>;
};

export async function loader(args: LoaderFunctionArgs) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  return defer({
    ...deferredData,
    ...criticalData,
  });
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({ request, context }: LoaderFunctionArgs) {
  const [layout] = await Promise.all([
    getLayoutData(context),
    // Add other queries here, so that they are loaded in parallel
  ]);

  const seo = seoPayload.root({ shop: layout.shop, url: request.url });

  const { storefront, env } = context;

  return {
    layout,
    seo,
    shop: getShopAnalytics({
      storefront,
      publicStorefrontId: env.PUBLIC_STOREFRONT_ID,
    }),
    consent: {
      checkoutDomain: env.PUBLIC_CHECKOUT_DOMAIN,
      storefrontAccessToken: env.PUBLIC_STOREFRONT_API_TOKEN,
    },
    selectedLocale: storefront.i18n,
    weaverseTheme: await context.weaverse.loadThemeSettings(),
    googleGtmID: context.env.PUBLIC_GOOGLE_GTM_ID,
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({ context }: LoaderFunctionArgs) {
  const { cart, customerAccount } = context;

  return {
    isLoggedIn: customerAccount.isLoggedIn(),
    cart: cart.get(),
  };
}

export const meta = ({ data }: MetaArgs<typeof loader>) => {
  return getSeoMeta(data?.seo as SeoConfig);
};

export function Layout({ children }: { children?: React.ReactNode }) {
  const nonce = useNonce();
  const data = useRouteLoaderData<RootLoader>("root");
  const locale = data?.selectedLocale ?? DEFAULT_LOCALE;

  return (
    <html lang={locale.language}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
        <GlobalStyle />
      </head>
      <body
        style={{ opacity: 0 }}
        className="transition-opacity !opacity-100 duration-300"
      >
        {data ? (
          <Analytics.Provider
            cart={data.cart}
            shop={data.shop}
            consent={data.consent}
          >
            <LayoutComponent
              {...data}
              footerMenu={data.layout.footerMenu}
              headerMenu={data.layout.headerMenu}
            >
              {children}
            </LayoutComponent>
            <CustomAnalytics />
          </Analytics.Provider>
        ) : (
          children
        )}
        <GlobalLoading />
        <Preloader />
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
      </body>
    </html>
  );
}

function App() {
  return <Outlet />;
}

export default withWeaverse(App);

export function ErrorBoundary() {
  const routeError = useRouteError();
  let errorMessage = "";
  let errorStatus = 0;

  if (isRouteErrorResponse(routeError)) {
    errorMessage = getErrorMessage(routeError.status);
    errorStatus = routeError.status;
  } else if (routeError instanceof Error) {
    errorMessage = routeError.message;
  }

  return (
    <div className="relative flex w-full items-center justify-center h-screen">
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
        <Button variant={"primary"} to="/">
          <span className="font-heading text-xl font-medium">
            Back to Homepage
          </span>
        </Button>
      </div>
    </div>
  );
}

const LAYOUT_QUERY = `#graphql
  query layout(
    $language: LanguageCode
    $headerMenuHandle: String!
    $footerMenuHandle: String!
  ) @inContext(language: $language) {
    shop {
      ...Shop
    }
    headerMenu: menu(handle: $headerMenuHandle) {
      ...Menu
    }
    footerMenu: menu(handle: $footerMenuHandle) {
      ...Menu
    }
  }
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

async function getLayoutData({ storefront, env }: AppLoadContext) {
  const data = await storefront.query(LAYOUT_QUERY, {
    variables: {
      headerMenuHandle: "main-menu",
      footerMenuHandle: "footer",
      language: storefront.i18n.language,
    },
  });

  invariant(data, "No data returned from Shopify API");

  /*
      Modify specific links/routes (optional)
      @see: https://shopify.dev/api/storefront/unstable/enums/MenuItemType
      e.g here we map:
        - /blogs/news -> /news
        - /blog/news/blog-post -> /news/blog-post
        - /collections/all -> /products
    */
  let customPrefixes = { CATALOG: "products" };

  const headerMenu = data?.headerMenu
    ? parseMenu(
        data.headerMenu,
        data.shop.primaryDomain.url,
        env,
        customPrefixes
      )
    : undefined;

  const footerMenu = data?.footerMenu
    ? parseMenu(
        data.footerMenu,
        data.shop.primaryDomain.url,
        env,
        customPrefixes
      )
    : undefined;

  return { shop: data.shop, headerMenu, footerMenu };
}
