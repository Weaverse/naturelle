import { Await } from "@remix-run/react";
import { useThemeSettings } from "@weaverse/hydrogen";
import { EnhancedMenu, useIsHomePath } from "~/lib/utils";
import { useRootLoaderData } from "~/root";
import clsx from "clsx";
import { Suspense, useEffect, useState } from "react";
import useWindowScroll from "react-use/lib/useWindowScroll";
import { Drawer, useDrawer } from "../Drawer";
import { IconAccount, IconListMenu, IconLogin } from "../Icon";
import { Link } from "../Link";
import { Logo } from "../Logo";
import { CartCount } from "./CartCount";
import { DrawerMenu } from "./menu/DrawerMenu";
import { SearchToggle } from "./SearchToggle";

export function UseMenuDrawerHeader({
  header,
  className,
  openCart,
}: {
  header: EnhancedMenu | null | undefined;
  className?: string;
  openCart: () => void;
}) {
  let { stickyAnnouncementBar, announcementBarHeight } = useThemeSettings();
  const isHome = useIsHomePath();
  const { y } = useWindowScroll();
  let settings = useThemeSettings();
  let [hovered, setHovered] = useState(false);
  const [top, setCalculatedTop] = useState(0);
  let { isOpen } = useDrawer();

  let onHover = () => setHovered(true);
  let onLeave = () => setHovered(false);

  let enableTransparent = settings?.enableTransparentHeader && isHome;
  let isTransparent = enableTransparent && y < 50 && !isOpen && !hovered;
  useEffect(() => {
    let calculatedTop = stickyAnnouncementBar
      ? announcementBarHeight
      : Math.max(announcementBarHeight - y, 0);
    setCalculatedTop(calculatedTop);
  }, [y, stickyAnnouncementBar, announcementBarHeight]);
  return (
    <header
      role="banner"
      className={clsx(
        enableTransparent ? "fixed w-screen" : "sticky",
        isTransparent
          ? "border-secondary bg-transparent text-secondary"
          : "shadow-header border-foreground bg-background-subtle-1 text-primary",
        "top-0 z-40 border-b border-foreground",
        className
      )}
      style={{ ["--announcement-bar-height" as string]: `${top}px` }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      <div className="z-40 flex h-nav items-center justify-between gap-3 px-6 md:px-8 lg:px-6 py-4 transition-all duration-300 container">
        <div
          className={clsx(
            "absolute inset-0 z-20 bg-background-subtle-1",
            "transition-all duration-300 ease-in-out",
            isTransparent ? "opacity-0" : "opacity-100"
          )}
        ></div>
        {header && <HeaderMenuDrawer menu={header} />}
        <Logo
          className="z-30 flex w-full justify-center"
          showTransparent={isTransparent}
        />
        {/* <button className="text-center" onClick={() => setShowMenu(true)}> */}
        <div className="z-30 flex items-center justify-end gap-2">
          <AccountLink />
          <CartCount isHome={false} openCart={openCart} />
        </div>
      </div>
    </header>
  );
}

function HeaderMenuDrawer({
  menu,
}: {
  menu?: EnhancedMenu | null | undefined;
}) {
  let { isOpen: showMenu, openDrawer, closeDrawer } = useDrawer();
  return (
    <nav
      className="z-30 flex items-center justify-start gap-3"
      role="navigation"
    >
      <button className="text-left" onClick={openDrawer}>
        <IconListMenu />
      </button>
      <SearchToggle isOpenDrawerHearder={true} />
      <Drawer
        open={showMenu}
        onClose={closeDrawer}
        openFrom="left"
        heading="MENU"
        isForm="menu"
      >
        <DrawerMenu menu={menu} />
      </Drawer>
    </nav>
  );
}

function AccountLink({ className }: { className?: string }) {
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
