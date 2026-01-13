import { useThemeSettings } from "@weaverse/hydrogen";
import { cva } from "class-variance-authority";
import { useEffect, useState } from "react";
import { useRouteError } from "react-router";
import useWindowScroll from "react-use/lib/useWindowScroll";
import { Logo } from "~/components/layout/logo";
import { useShopMenu } from "~/hooks/use-menu-shop";
import { cn } from "~/utils/cn";
import { useIsHomePath } from "~/utils/locale";
import { AccountLink } from "../account/account-link";
import { CartDrawer } from "../cart/cart-drawer";
import { HeaderMenuDrawer } from "./menu/drawer-menu";
import { MegaMenu } from "./menu/mega-menu";
import { ScrollingAnnouncement } from "./scrolling-announcement";
import { SearchToggle } from "./search-toggle";

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
      {enableTrialShipping && <ScrollingAnnouncement />}
      <header
        role="banner"
        className={cn(
          "top-0 z-40 w-full border-b transition duration-300 ease-in-out",
          "bg-header-bg text-(--color-header-text) border-(--color-header-text)",
          "hover:bg-header-bg",
          "hover:text-(--color-header-text)",
          "hover:border-(--color-header-text)",
          enableTransparent ? "fixed w-full group/header" : "sticky",
          scrolled ? "shadow-header" : "shadow-none",
          isTransparent
            ? [
                "border-(--color-transparent-header) bg-transparent text-(--color-transparent-header)",
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
