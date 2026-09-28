import {
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
  redirect,
} from "react-router";
import { prefixPathWithLocale } from "~/utils/locale";

// if we dont implement this, /account/logout will get caught by account.$.tsx to do login
export async function loader({ context }: LoaderFunctionArgs) {
  return redirect(
    prefixPathWithLocale("/", context.localization.selectedLocale),
  );
}

export async function action({ context }: ActionFunctionArgs) {
  return context.customerAccount.logout();
}
