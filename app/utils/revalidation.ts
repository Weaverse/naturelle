import type { ShouldRevalidateFunctionArgs } from "react-router";

const CART_ACTION_PATH = /(?:^|\/)cart$/;

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
  if (formAction && formMethod && formMethod.toUpperCase() !== "GET") {
    const actionPath = new URL(formAction, currentUrl).pathname.replace(
      /\.data$/,
      "",
    );
    if (CART_ACTION_PATH.test(actionPath) && currentUrl.href === nextUrl.href) {
      return false;
    }
  }

  return defaultShouldRevalidate;
}
