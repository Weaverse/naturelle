import type { ShouldRevalidateFunctionArgs } from "react-router";

const CART_ACTION_PATH = /(?:^|\/)cart$/;
const LOCALE_SEGMENT = /^[a-z]{2,3}-[a-z]{2}$/i;

function getLocaleSegment(pathname: string) {
  const segment = pathname.split("/").filter(Boolean)[0];
  return segment && LOCALE_SEGMENT.test(segment) ? segment.toLowerCase() : null;
}

/**
 * Cart mutations are synced into the Zustand store from the fetcher response.
 * Revalidating root/page loaders on every add would race that store and can
 * split one variant into a real line plus a $0 optimistic line.
 */
export function skipRevalidationForCartActions({
  currentUrl,
  defaultShouldRevalidate,
  formAction,
  formMethod,
  nextUrl,
}: ShouldRevalidateFunctionArgs) {
  // Locale changes must always rebuild route data in the new market context.
  if (
    getLocaleSegment(currentUrl.pathname) !== getLocaleSegment(nextUrl.pathname)
  ) {
    return true;
  }

  if (formAction && formMethod && formMethod.toUpperCase() !== "GET") {
    const actionPath = new URL(formAction, currentUrl).pathname.replace(
      /\.data$/,
      "",
    );
    if (CART_ACTION_PATH.test(actionPath)) {
      return false;
    }
  }

  return defaultShouldRevalidate;
}
