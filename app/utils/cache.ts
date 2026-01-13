export function routeHeaders({ loaderHeaders }: { loaderHeaders: Headers }) {
  // Keep the same cache-control headers when loading the page directly
  // versus when transitioning to the page from other areas in the app
  return {
    "Cache-Control": loaderHeaders.get("Cache-Control"),
  };
}

export const CACHE_SHORT = "public, max-age=1, s-maxage=9";
export const CACHE_LONG = "public, max-age=3600, s-maxage=86400";
