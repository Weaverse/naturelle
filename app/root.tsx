import {
  Analytics,
  getSeoMeta,
  getShopAnalytics,
  Image,
  type SeoConfig,
  useNonce,
} from "@shopify/hydrogen";
import { withWeaverse } from "@weaverse/hydrogen";
import {
  type AppLoadContext,
  isRouteErrorResponse,
  Links,
  type LoaderFunctionArgs,
  Meta,
  type MetaArgs,
  Outlet,
  Scripts,
  ScrollRestoration,
  type ShouldRevalidateFunction,
  useLocation,
  useMatches,
  useRouteError,
  useRouteLoaderData,
} from "react-router";
import tailwind from "./styles/app.css?url";
import { GlobalStyle } from "./weaverse/style";
import "@fontsource-variable/montserrat";
import "@fontsource/belleza";
import invariant from "tiny-invariant";
import { seoPayload } from "~/.server/seo";
import { Button } from "~/components/button";
import { Footer } from "~/components/layout/footer";
import { Header } from "~/components/layout/header";
import { CustomAnalytics } from "~/components/root/analytics";
import { GlobalLoading } from "~/components/root/global-loading";
import { Preloader } from "~/components/root/preloader";
import { POLICIES_QUERY } from "~/routes/($locale).policies._index";
import { getErrorMessage } from "~/utils/define-message-error";
import { DEFAULT_LOCALE } from "./utils/const";
import { parseMenu } from "./utils/menu";

export type RootLoader = typeof loader;

export const shouldRevalidate: ShouldRevalidateFunction = ({
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
    {
      rel: "preconnect",
      href: "https://cdn.shopify.com",
    },
    {
      rel: "preconnect",
      href: "https://shop.app",
    },
    { rel: "icon", type: "image/svg+xml", href: "/favicon.ico" },
  ];
}

/**
 * Access the result of the root loader from a React component.
 */
export const useRootLoaderData = () => {
  const [root] = useMatches();
  return root?.data as Awaited<ReturnType<typeof loader>>;
};

export async function loader(args: LoaderFunctionArgs) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  return {
    ...deferredData,
    ...criticalData,
  };
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({ request, context }: LoaderFunctionArgs) {
  const [layout, swatchesConfigs, weaverseTheme] = await Promise.all([
    getLayoutData(context),
    getSwatchesConfigs(context),
    context.weaverse.loadThemeSettings(),
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
      withPrivacyBanner: false,
      // localize the privacy banner
      country: storefront.i18n.country,
      language: storefront.i18n.language,
    },
    selectedLocale: storefront.i18n,
    weaverseTheme,
    googleGtmID: context.env.PUBLIC_GOOGLE_GTM_ID,
    swatchesConfigs,
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

export const Layout = withWeaverse(function RootLayout({
  children,
}: {
  children?: React.ReactNode;
}) {
  const location = useLocation();
  const nonce = useNonce();
  const data = useRouteLoaderData<RootLoader>("root");
  const locale = data?.selectedLocale ?? DEFAULT_LOCALE;

  // Bypass Weaverse theme layout for Hydrogen dev tools
  if (
    location.pathname === "/subrequest-profiler" ||
    location.pathname === "/graphiql"
  ) {
    return children;
  }

  return (
    <html lang={locale.language}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="stylesheet" href={tailwind} />
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
            <Header />
            <main className="grow">{children}</main>
            <Footer />
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
});

function App() {
  return <Outlet />;
}

export default App;

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
        title
        products(first: 5) {
          nodes {
            id
            title
            handle
          }
        }
        image {
          altText
          height
          id
          url
          width
        }
      }
      ... on Product {
        title
        description
        image: featuredImage {
          altText
          height
          id
          url
          width
        }
        collections(first: 1) {
          nodes {
            id
            title
          }
        }
      }
      ... on Blog {
        title
        handle
        articles(first: 6, sortKey: PUBLISHED_AT, reverse: true) {
          nodes {
            id
            title
            handle
            image {
              altText
              height
              id
              url
              width
            }
          }
        }
      }
      ... on Article {
        title
        handle
        image {
          altText
          height
          id
          url
          width
        }
        blog {
          title
          handle
          articles(first: 6, sortKey: PUBLISHED_AT, reverse: true) {
            nodes {
              id
              title
              handle
              image {
                altText
                height
                id
                url
                width
              }
            }
          }
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
  const [layoutData, policiesData] = await Promise.all([
    storefront.query(LAYOUT_QUERY, {
      variables: {
        headerMenuHandle: "main-menu",
        footerMenuHandle: "footer",
        language: storefront.i18n.language,
      },
    }),
    storefront.query(POLICIES_QUERY, {
      variables: {
        language: storefront.i18n.language,
      },
    }),
  ]);

  invariant(layoutData && policiesData, "No data returned from Shopify API");

  /*
      Modify specific links/routes (optional)
      @see: https://shopify.dev/api/storefront/unstable/enums/MenuItemType
      e.g here we map:
        - /blogs/news -> /news
        - /blog/news/blog-post -> /news/blog-post
        - /collections/all -> /products
    */
  let customPrefixes = { CATALOG: "products" };

  const headerMenu = layoutData?.headerMenu
    ? parseMenu(
        layoutData.headerMenu,
        layoutData.shop.primaryDomain.url,
        env,
        customPrefixes,
      )
    : undefined;

  const footerMenu = layoutData?.footerMenu
    ? parseMenu(
        layoutData.footerMenu,
        layoutData.shop.primaryDomain.url,
        env,
        customPrefixes,
      )
    : undefined;

  return {
    shop: {
      ...layoutData.shop,
      ...policiesData.shop,
    },
    headerMenu,
    footerMenu,
  };
}

type Swatch = {
  id: string;
  name: string;
  value: string;
};

async function getSwatchesConfigs(context: AppLoadContext) {
  const { METAOBJECT_COLORS_TYPE: type } = context.env;
  if (!type) {
    return { colors: [], images: [] };
  }
  const { metaobjects } = await context.storefront.query(SWATCHES_QUERY, {
    variables: { type },
  });
  const colors: Swatch[] = [];
  const images: Swatch[] = [];
  for (const { id, fields } of metaobjects.nodes) {
    const { value: color } = fields.find(({ key }) => key === "color") || {};
    const { reference: imageRef } =
      fields.find(({ key }) => key === "image") || {};
    const { value: name } = fields.find(({ key }) => key === "label") || {};
    if (imageRef) {
      const url = imageRef?.image?.url;
      if (url) {
        images.push({ id, name, value: url });
      }
    } else if (color) {
      colors.push({ id, name, value: color });
    }
  }
  return { colors, images };
}

const SWATCHES_QUERY = `#graphql
  query swatches($type: String!) {
    metaobjects(first: 250, type: $type) {
      nodes {
        id
        fields {
          key
          value
          reference {
            ... on MediaImage {
              image {
                id
                altText
                url: url(transform: { maxWidth: 300 })
                width
                height
              }
            }
          }
        }
      }
    }
  }
` as const;
