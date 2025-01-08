import { useThemeSettings } from "@weaverse/hydrogen";
import { AnnouncementBar } from "./AnnouncementBar";
import { cva } from "class-variance-authority";
import { cn, useIsHomePath } from "~/lib/utils";
import useWindowScroll from "react-use/lib/useWindowScroll";
import { useEffect, useState } from "react";
import { useDrawer } from "../Drawer";
import clsx from "clsx";
import { Logo } from "../Logo";
import { MegaMenu } from "./menu/MegaMenu";
import { SearchToggle } from "./SearchToggle";
import { AccountLink } from "../account/AccountLink";
import { CartDrawer } from "../cart/CartDrawer";
import { HeaderMenuDrawer } from "./menu/DrawerMenu";
import { useShopMenu } from "~/hooks/use-menu-shop";


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
    <>
      {enableTrialShipping && <AnnouncementBar />}
      <header
        role="banner"
        className={cn(
          enableTransparent ? "fixed w-full" : "sticky",
          isTransparent
            ? "border-[var(--color-transparent-header)] bg-transparent text-[var(--color-transparent-header)]"
            : "shadow-header border-[var(--color-header-text)] bg-[var(--color-header-bg)] text-[var(--color-header-text)]",
          "top-0 z-40 border-b",
          variants({ padding: headerWidth })
        )}
        style={{ ["--announcement-bar-height" as string]: `${top}px` }}
        onMouseEnter={onHover}
        onMouseLeave={onLeave}
      >
        <div
          className={cn(
            "z-40 flex h-nav items-center justify-between gap-3 transition-all duration-300",
            variants({ width: headerWidth })
          )}
        >
          <div
            className={clsx(
              "absolute inset-0 z-20 bg-[var(--color-header-bg)]",
              "transition-all duration-300 ease-in-out",
              isTransparent ? "opacity-0" : "opacity-100"
            )}
          ></div>
          {typeMenuHeader === "drawer" ? (
            <HeaderMenuDrawer menu={headerMenu} />
          ) : (
              <HeaderMenuDrawer menu={headerMenu} className="xl:hidden block" />
          )}
          <Logo
            className="z-30 flex justify-start"
            showTransparent={isTransparent}
          />
          {typeMenuHeader === "mega" && <MegaMenu menu={headerMenu} />}
          <div className="z-30 flex items-center justify-end gap-2">
            {typeMenuHeader === "mega" && <SearchToggle isOpenDrawerHearder className="xl:block hidden" />}
            <AccountLink />
            <CartDrawer />
          </div>
        </div>
      </header>
    </>
  );
}
