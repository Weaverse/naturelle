import { Await } from "@remix-run/react";
import { Suspense } from "react";
import { useRootLoaderData } from "~/root";
import { Link } from "../Link";
import { IconAccount, IconLogin } from "../Icon";

export function AccountLink({ className }: { className?: string }) {
    const rootData = useRootLoaderData();
    const isLoggedIn = rootData?.isLoggedIn;
  
    return (
      <Suspense fallback="Sign in">
        <Await resolve={isLoggedIn} errorElement="Sign in">
          {(isLoggedIn) => {
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