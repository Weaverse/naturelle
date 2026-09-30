import { useTranslation } from "@weaverse/hydrogen";
import { Suspense } from "react";
import { Await } from "react-router";
import { useRootLoaderData } from "~/root";
import { IconAccount, IconLogin } from "../icon";
import { Link } from "../link";

export function AccountLink({
  className,
  variant = "icon",
}: {
  className?: string;
  variant?: "icon" | "label";
}) {
  const { t } = useTranslation();
  const rootData = useRootLoaderData();
  const isLoggedIn = rootData?.isLoggedIn;
  const fallback =
    variant === "label" ? t("account.signInRegister") : t("account.signIn");

  return (
    <Suspense fallback={fallback}>
      <Await resolve={isLoggedIn} errorElement={fallback}>
        {(loggedIn) => {
          if (variant === "label") {
            return (
              <Link
                prefetch="intent"
                to={loggedIn ? "/account" : "/account/login"}
                className={className}
              >
                {loggedIn ? t("account.title") : t("account.signInRegister")}
              </Link>
            );
          }

          return loggedIn ? (
            <Link prefetch="intent" to="/account" className={className}>
              <IconAccount />
            </Link>
          ) : (
            <Link to="/account/login" className={className}>
              <IconLogin className="h-6 w-6" />
            </Link>
          );
        }}
      </Await>
    </Suspense>
  );
}
