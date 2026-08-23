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
  const rootData = useRootLoaderData();
  const isLoggedIn = rootData?.isLoggedIn;
  const fallback = variant === "label" ? "Sign In / Register" : "Sign in";

  return (
    <Suspense fallback={fallback}>
      <Await resolve={isLoggedIn} errorElement={fallback}>
        {(isLoggedIn) => {
          if (variant === "label") {
            return (
              <Link
                prefetch="intent"
                to={isLoggedIn ? "/account" : "/account/login"}
                className={className}
              >
                {isLoggedIn ? "Account" : "Sign In / Register"}
              </Link>
            );
          }

          return isLoggedIn ? (
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
