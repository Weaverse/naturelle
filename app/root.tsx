import { TooltipProvider } from "@radix-ui/react-tooltip";
import {
  Analytics,
  getSeoMeta,
  Image,
  type SeoConfig,
  useNonce,
} from "@shopify/hydrogen";
import { withWeaverse } from "@weaverse/hydrogen";
import {
  isRouteErrorResponse,
  Links,
  type LoaderFunctionArgs,
  Meta,
  type MetaArgs,
  Outlet,
  Scripts,
  ScrollRestoration,
  type ShouldRevalidateFunction,
  useMatches,
  useRouteError,
  useRouteLoaderData,
} from "react-router";
import appStyles from "./styles/app.css?url";
import { GlobalStyle } from "./weaverse/style";
import "@fontsource-variable/cormorant";
import "@fontsource-variable/nunito-sans";
import { CustomAnalytics } from "~/components/Analytics";
import { Button } from "~/components/button";
import { Footer } from "~/components/footer/Footer";
import { Header } from "~/components/Header/Header";
import { loadCriticalData, loadDeferredData } from "./.server/root";
import { GlobalLoading } from "./components/global-loading";
import { Preloader } from "./components/Preloader";
import { DEFAULT_LOCALE } from "./lib/utils";
import { getErrorMessage } from "./lib/utils/defineMessageError";

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
        <link rel="stylesheet" href={appStyles} />
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
            <TooltipProvider disableHoverableContent>
              <div className="flex min-h-screen flex-col">
                <Header />
                <main className="grow">{children}</main>
                <Footer />
              </div>
            </TooltipProvider>
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
