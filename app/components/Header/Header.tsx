import { useRouteError } from "@remix-run/react";
import { useThemeSettings } from "@weaverse/hydrogen";
import { cva } from "class-variance-authority";
import { useEffect, useState } from "react";
import useWindowScroll from "react-use/lib/useWindowScroll";
import { useShopMenu } from "~/hooks/use-menu-shop";
import { cn, useIsHomePath } from "~/lib/utils";
import { Logo } from "../Logo";
import { AccountLink } from "../account/AccountLink";
import { CartDrawer } from "../cart/CartDrawer";
import { AnnouncementBar } from "./AnnouncementBar";
import { SearchToggle } from "./SearchToggle";
import { HeaderMenuDrawer } from "./menu/DrawerMenu";
import { MegaMenu } from "./menu/MegaMenu";

let variants = cva("", {
  variants: {
    width: {
      full: "w-full h-full",
      stretch: "w-full h-full",
      fixed: "w-full h-full container mx-auto",
    },
    padding: {
      full: "",
      stretch: "px-3 md:px-10 lg:px-16",
      fixed: "px-6 md:px-8 lg:px-6 mx-auto",
    },
  },
});

export function Header() {
  let { headerMenu } = useShopMenu();
  const settings = useThemeSettings();
  const {
    typeMenuHeader,
    enableTrialShipping,
    stickyAnnouncementBar,
    announcementBarHeight,
    headerWidth,
    enableTransparentHeader,
  } = settings;
  const isHome = useIsHomePath();
  const { y } = useWindowScroll();
  const [top, setCalculatedTop] = useState(0);
  let routeError = useRouteError();

  let scrolled = y < 50;

  let enableTransparent = enableTransparentHeader && isHome && !routeError;
  let isTransparent = enableTransparent && scrolled;
  useEffect(() => {
    let calculatedTop = stickyAnnouncementBar
      ? announcementBarHeight
      : Math.max(announcementBarHeight - y, 0);
    setCalculatedTop(calculatedTop);
  }, [y, stickyAnnouncementBar, announcementBarHeight]);

  return (
    <>
      {enableTrialShipping && <AnnouncementBar />}
      <header
        role="banner"
        className={cn(
          "top-0 z-40 border-b transition duration-300 ease-in-out",
          "bg-[var(--color-header-bg)] text-[var(--color-header-text)] border-[var(--color-header-text)]",
          "hover:bg-[var(--color-header-bg)]",
          "hover:text-[var(--color-header-text)]",
          "hover:border-[var(--color-header-text)]",
          enableTransparent ? "fixed w-full group/header" : "sticky",
          scrolled ? "shadow-header" : "shadow-none",
          isTransparent
            ? [
                "border-[var(--color-transparent-header)] bg-transparent text-[var(--color-transparent-header)]",
                "[&_.main-logo]:opacity-0",
                "[&_.transparent-logo]:opacity-100",
              ]
            : ["[&_.main-logo]:opacity-100", "[&_.transparent-logo]:opacity-0"],
          variants({ padding: headerWidth }),
        )}
        style={{ ["--announcement-bar-height" as string]: `${top}px` }}
      >
        <div
          className={cn(
            "z-40 flex h-nav py-1.5 items-center justify-between gap-3",
            variants({ width: headerWidth }),
          )}
        >
          {typeMenuHeader === "drawer" ? (
            <HeaderMenuDrawer menu={headerMenu} />
          ) : (
            <HeaderMenuDrawer menu={headerMenu} className="xl:hidden block" />
          )}
          <Logo className="z-30 flex justify-start" />
          {typeMenuHeader === "mega" && <MegaMenu menu={headerMenu} />}
          <div className="z-30 flex items-center justify-end gap-2">
            {typeMenuHeader === "mega" && (
              <SearchToggle isOpenDrawerHearder className="xl:block hidden" />
            )}
            <AccountLink />
            <CartDrawer />
          </div>
        </div>
      </header>
    </>
  );
}
