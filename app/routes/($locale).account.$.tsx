import { type LoaderFunctionArgs, redirect } from "react-router";
import { prefixPathWithLocale } from "~/utils/locale";

// fallback wild card for all unauthenticated routes in account section
export async function loader({ context }: LoaderFunctionArgs) {
  await context.customerAccount.handleAuthStatus();

  return redirect(
    prefixPathWithLocale("/account", context.localization.selectedLocale),
  );
}
