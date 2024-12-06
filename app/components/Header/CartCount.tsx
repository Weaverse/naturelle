import { Await } from "@remix-run/react";
import { Suspense, useMemo } from "react";
import { useRootLoaderData } from "~/root";
import { IconBag } from "../Icon";
import { Link } from "../Link";

export function CartCount({
    isHome,
    openCart,
  }: {
    isHome: boolean;
    openCart: () => void;
  }) {
    const rootData = useRootLoaderData();
    return (
      <Suspense fallback={<Badge count={0} dark={isHome} openCart={openCart} />}>
        <Await resolve={rootData?.cart}>
          {(cart) => (
            <Badge
              dark={isHome}
              openCart={openCart}
              count={cart?.totalQuantity || 0}
            />
          )}
        </Await>
      </Suspense>
    );
  }
  
  function Badge({
    openCart,
    dark,
    count,
  }: {
    count: number;
    dark: boolean;
    openCart: () => void;
  }) {
    const isHydrated = true; // useIsHydrated();
  
    const BadgeCounter = useMemo(
      () => (
        <>
          <IconBag className="h-6 w-6" viewBox="0 0 24 24" />
          <div className="absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--color-header-text)] p-[0.125rem] text-center text-[0.625rem] font-medium leading-none text-[var(--color-transparent-header)] subpixel-antialiased">
            <span>{count || 0}</span>
          </div>
        </>
      ),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [count, dark],
    );
  
    return isHydrated ? (
      <button
        onClick={openCart}
        className="focus:ring-border relative flex h-8 w-8 items-center justify-center"
      >
        {BadgeCounter}
      </button>
    ) : (
      <Link
        to="/cart"
        className="focus:ring-border relative flex h-8 w-8 items-center justify-center"
      >
        {BadgeCounter}
      </Link>
    );
  }