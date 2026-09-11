import { useThemeSettings } from "@weaverse/hydrogen";
import { cva } from "class-variance-authority";
import { useEffect, useState } from "react";
import { useRouteError } from "react-router";
import { useWindowScroll } from "react-use";
import { Logo } from "~/components/layout/logo";
import { Link } from "~/components/link";
import { useShopMenu } from "~/hooks/use-menu-shop";
import { cn } from "~/utils/cn";
import { useIsHomePath } from "~/utils/locale";
import { AccountLink } from "../account/account-link";
import { CartDrawer } from "../cart/cart-drawer";
import { HeaderCountrySelector } from "./country-selector/header-country-selector";
import { HeaderMenuDrawer } from "./menu/drawer-menu";
import { MegaMenu } from "./menu/mega-menu";
import { ScrollingAnnouncement } from "./scrolling-announcement";
import { SearchToggle } from "./search-toggle";

let variants = cva("", {
  variants: {
    width: {
      full: "h-full w-full",
      stretch: "h-full w-full",
      fixed: "mx-auto h-full w-full lg:max-w-[1440px]",
    },
    padding: {
      full: "",
      stretch: "px-5 md:px-6 lg:px-10",
      fixed: "mx-auto px-5 md:px-6 lg:px-10",
    },
  },
});

export function Header() {
  let { headerMenu } = useShopMenu();
  const settings = useThemeSettings();
  const {
    typeMenuHeader,
    enableTrialShipping,
    announcementMessage1,
    announcementMessage2,
    announcementMessage3,
    announcementMessage4,
    announcementMessage5,
    announcementMessage6,
    storeLocatorText,
    storeLocatorLink,
    headerHelpFaqText,
    headerHelpFaqLink,
    stickyAnnouncementBar,
    announcementBarHeight,
    headerWidth,
    enableTransparentHeader,
  } = settings;
  const isHome = useIsHomePath();
  const { y } = useWindowScroll();
  const [top, setCalculatedTop] = useState(0);
  const [isUtilitySearchOpen, setIsUtilitySearchOpen] = useState(false);
  let routeError = useRouteError();

  let scrolled = y >= 50;

  let enableTransparent = enableTransparentHeader && isHome && !routeError;
  let isTransparent = enableTransparent && !scrolled;
  let showTransparentHeader = isTransparent && !isUtilitySearchOpen;
  const hasAnnouncement =
    enableTrialShipping &&
    [
      announcementMessage1,
      announcementMessage2,
      announcementMessage3,
      announcementMessage4,
      announcementMessage5,
      announcementMessage6,
    ].some((message) => message?.trim());
  useEffect(() => {
    let calculatedTop = hasAnnouncement
      ? stickyAnnouncementBar
        ? announcementBarHeight
        : Math.max(announcementBarHeight - y, 0)
      : 0;
    setCalculatedTop(calculatedTop);
  }, [y, hasAnnouncement, stickyAnnouncementBar, announcementBarHeight]);

  return (
    <>
      {hasAnnouncement && <ScrollingAnnouncement />}
      <header
        className={cn(
          "top-0 z-40 w-full border-b transition duration-300 ease-in-out",
          "bg-header-bg text-(--color-header-text) border-(--color-header-text)",
          "hover:bg-header-bg",
          "hover:text-(--color-header-text)",
          "hover:border-(--color-header-text)",
          enableTransparent ? "fixed w-full group/header" : "sticky",
          scrolled ? "shadow-header" : "shadow-none",
          showTransparentHeader
            ? [
                "border-transparent bg-transparent text-(--color-transparent-header)",
                "[&_.main-logo]:opacity-0 [&:hover_.main-logo]:opacity-100",
                "[&_.transparent-logo]:opacity-100 [&:hover_.transparent-logo]:opacity-0",
              ]
            : ["[&_.main-logo]:opacity-100", "[&_.transparent-logo]:opacity-0"],
        )}
        style={{ ["--announcement-bar-height" as string]: `${top}px` }}
      >
        <div
          className={cn(
            "hidden w-full items-center justify-center px-6 py-3 md:flex lg:py-4",
            showTransparentHeader
              ? "bg-transparent text-(--color-transparent-header) group-hover/header:bg-background-subtle-1 group-hover/header:text-(--color-header-text)"
              : "bg-background-subtle-1 text-(--color-header-text)",
          )}
        >
          <div className="mx-auto flex w-full max-w-page items-center justify-between px-6">
            <div className="flex w-77.75 shrink-0 items-center gap-5 text-[13px] font-medium leading-normal">
              {storeLocatorText && (
                <Link to={storeLocatorLink}>{storeLocatorText}</Link>
              )}
              {headerHelpFaqText && (
                <Link to={headerHelpFaqLink}>{headerHelpFaqText}</Link>
              )}
            </div>

            <Logo
              width={87}
              className="z-30 flex h-11.5! w-21.75! shrink-0 flex-col items-center justify-center gap-[0.305px] px-0.5 pt-0.75 pb-[1.768px]"
            />

            <div className="flex w-77.75 shrink-0 items-center justify-end gap-4.5 text-[13px] font-semibold leading-normal">
              {!isUtilitySearchOpen && (
                <>
                  <HeaderCountrySelector />
                  <AccountLink variant="label" className="whitespace-nowrap" />
                </>
              )}
              <div className="flex items-center justify-end gap-3">
                <SearchToggle
                  inline
                  compact
                  onInlineOpenChange={setIsUtilitySearchOpen}
                />
                <CartDrawer compact />
              </div>
            </div>
          </div>
        </div>
        <div
          className={cn(
            "z-40 flex h-14.5 items-center justify-center gap-2.5 md:h-16.5",
            showTransparentHeader
              ? "bg-transparent"
              : "bg-header-bg md:bg-transparent",
            variants({ width: headerWidth, padding: headerWidth }),
          )}
        >
          {typeMenuHeader === "drawer" ? (
            <HeaderMenuDrawer menu={headerMenu} />
          ) : (
            <HeaderMenuDrawer menu={headerMenu} className="block md:hidden" />
          )}
          <div className="shrink-0">
            <Logo className="z-30 flex justify-start md:hidden" />
          </div>
          {typeMenuHeader === "mega" && <MegaMenu menu={headerMenu} />}
          <div className="z-30 flex min-w-0 flex-1 items-center justify-end gap-2 md:hidden">
            <SearchToggle inline />
            <AccountLink />
            <CartDrawer />
          </div>
        </div>
      </header>
    </>
  );
}
