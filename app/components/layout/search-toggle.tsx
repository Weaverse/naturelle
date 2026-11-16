import { useThemeSettings, useTranslation } from "@weaverse/hydrogen";
import { useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { SearchTypeDrawer } from "~/components/layout/predictive-search/PredictiveSearch/SearchDrawer/search-type-drawer";
import { SearchTypeHeader } from "~/components/layout/predictive-search/PredictiveSearch/SearchHeader/search-type-header";
import { cn } from "~/utils/cn";
import { Drawer, useDrawer } from "../drawer";
import { IconSearch } from "../icon";

type TypeOpenFrom = "top" | "right" | "left";
const INLINE_SEARCH_ANIMATION_DURATION = 200;

export function SearchToggle({
  isOpenDrawerHeader,
  className,
  inline = false,
  compact = false,
  onInlineOpenChange,
}: {
  isOpenDrawerHeader?: boolean;
  className?: string;
  inline?: boolean;
  compact?: boolean;
  onInlineOpenChange?: (isOpen: boolean) => void;
}) {
  const { t } = useTranslation();
  const { isOpen, closeDrawer, openDrawer } = useDrawer();
  const location = useLocation();
  const shouldReduceMotion = useReducedMotion();
  let settings = useThemeSettings();
  const [searchType, setSearchType] = useState(settings?.searchType);
  const [openFrom, setOpenFrom] = useState<TypeOpenFrom>(
    searchType === "popupSearch" ? "top" : "right",
  );
  const [isInlineOpen, setIsInlineOpen] = useState(false);
  const [isInlineClosing, setIsInlineClosing] = useState(false);

  useEffect(() => {
    if (!isInlineClosing) {
      return;
    }

    const timeout = window.setTimeout(
      () => {
        setIsInlineOpen(false);
        setIsInlineClosing(false);
        onInlineOpenChange?.(false);
      },
      shouldReduceMotion ? 0 : INLINE_SEARCH_ANIMATION_DURATION,
    );

    return () => window.clearTimeout(timeout);
  }, [isInlineClosing, onInlineOpenChange, shouldReduceMotion]);

  useEffect(() => {
    setIsInlineOpen(false);
    setIsInlineClosing(false);
    onInlineOpenChange?.(false);
    closeDrawer();
    // oxlint-disable-next-line react/exhaustive-deps -- close search only when the route changes
  }, [location.pathname, location.search, location.hash]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 1280) {
        setSearchType("drawerSearch");
        setOpenFrom("left");
      } else {
        setSearchType(settings?.searchType);
        if (settings?.searchType === "drawerSearch" && isOpenDrawerHeader) {
          setOpenFrom("left");
        } else {
          setOpenFrom(settings?.searchType === "popupSearch" ? "top" : "right");
        }
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, [settings?.searchType, isOpenDrawerHeader]);

  if (inline) {
    return (
      <div
        className={cn(
          "hidden min-w-0 desktop:block",
          isInlineOpen && "flex-1",
          className,
        )}
      >
        {isInlineOpen ? (
          <SearchTypeHeader
            inline
            isClosing={isInlineClosing}
            onClose={() => setIsInlineClosing(true)}
          />
        ) : (
          <button
            type="button"
            onClick={() => {
              setIsInlineOpen(true);
              onInlineOpenChange?.(true);
            }}
            aria-label={t("accessibility.openSearch")}
            className={cn(
              "relative flex items-center justify-center focus:ring-primary/5",
              compact ? "size-5" : "size-6",
            )}
          >
            <IconSearch
              className={compact ? "size-5" : "size-6"}
              strokeWidth={2}
            />
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={className}>
      <button
        type="button"
        aria-label={t("accessibility.openSearch")}
        onClick={openDrawer}
        className="relative flex size-6 shrink-0 items-center justify-center focus:ring-primary/5"
      >
        <IconSearch className="size-6" strokeWidth={1} />
      </button>
      <Drawer
        open={isOpen}
        onClose={closeDrawer}
        openFrom={openFrom}
        heading={searchType === "drawerSearch" ? t("search.title") : ""}
        isForm="search"
      >
        {searchType === "popupSearch" && <SearchTypeHeader isOpen={isOpen} />}
        {searchType === "drawerSearch" && <SearchTypeDrawer isOpen={isOpen} />}
      </Drawer>
    </div>
  );
}
