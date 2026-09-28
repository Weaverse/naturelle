import { type LoaderFunctionArgs, redirect } from "react-router";
import { prefixPathWithLocale } from "~/utils/locale";
import { safeRedirectPath } from "~/utils/misc";

/**
 * Automatically applies a discount found on the url
 * If a cart exists it's updated with the discount, otherwise a cart is created with the discount already applied
 *
 * @example
 * Example path applying a discount and optional redirecting (defaults to the home page)
 * ```js
 * /discount/FREESHIPPING?redirect=/products
 *
 * ```
 */
export async function loader({ request, context, params }: LoaderFunctionArgs) {
  const { cart } = context;
  const { code } = params;

  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const redirectParam =
    searchParams.get("redirect") || searchParams.get("return_to") || "/";

  searchParams.delete("redirect");
  searchParams.delete("return_to");

  const fallback = prefixPathWithLocale(
    "/",
    context.localization.selectedLocale,
  );
  const redirectPath = prefixPathWithLocale(
    safeRedirectPath(redirectParam, fallback),
    context.localization.selectedLocale,
  );
  const redirectTarget = new URL(redirectPath, request.url);
  for (const [key, value] of searchParams) {
    redirectTarget.searchParams.append(key, value);
  }
  const redirectUrl = `${redirectTarget.pathname}${redirectTarget.search}${redirectTarget.hash}`;

  if (!code) {
    return redirect(redirectUrl);
  }

  const result = await cart.updateDiscountCodes([code]);
  const headers = cart.setCartId(result.cart.id);

  // Using set-cookie on a 303 redirect will not work if the domain origin have port number (:3000)
  // If there is no cart id and a new cart id is created in the progress, it will not be set in the cookie
  // on localhost:3000
  return redirect(redirectUrl, {
    status: 303,
    headers,
  });
}
