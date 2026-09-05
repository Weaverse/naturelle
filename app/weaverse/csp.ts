import type { HydrogenRouterContextProvider } from "@shopify/hydrogen";

export function getWeaverseCsp(
  request: Request,
  context: HydrogenRouterContextProvider,
) {
  const url = new URL(request.url);
  // Get weaverse host from query params
  const weaverseHost =
    url.searchParams.get("weaverseHost") || context.env.WEAVERSE_HOST;
  const isDesignMode = url.searchParams.get("weaverseHost");
  const weaverseHosts = ["*.weaverse.io", "*.shopify.com", "*.myshopify.com"];
  if (weaverseHost) {
    weaverseHosts.push(weaverseHost);
  }
  const updatedCsp: {
    [x: string]: string[] | string | boolean;
  } = {
    defaultSrc: [
      "'self'",
      "data:",
      "cdn.shopify.com",
      "*.youtube.com",
      "*.youtu.be",
      "*.vimeo.com",
      "shopify.com",
      "*.cdninstagram.com",
      "*.googletagmanager.com",
      "*.google-analytics.com",
      ...weaverseHosts,
    ],
    styleSrc: weaverseHosts,
    connectSrc: [
      "'self'",
      "*.instagram.com",
      "*.google-analytics.com",
      "*.analytics.google.com",
      "*.googletagmanager.com",
      "*.shopifysvc.com",
      "vimeo.com",
      ...weaverseHosts,
    ],
    scriptSrc: [
      "'self'",
      "https://cdn.shopify.com",
      "https://www.youtube.com",
      ...weaverseHosts,
    ],
    frameSrc: [
      "'self'",
      "https://maps.google.com",
      "https://www.google.com",
      ...weaverseHosts,
    ],
  };

  if (isDesignMode) {
    updatedCsp.frameAncestors = ["*"];
  }
  return updatedCsp;
}
