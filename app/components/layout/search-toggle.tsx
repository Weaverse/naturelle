import { useThemeSettings } from "@weaverse/hydrogen";
import { useEffect, useState } from "react";
import { SearchTypeDrawer } from "~/components/layout/predictive-search/PredictiveSearch/SearchDrawer/search-type-drawer";
import { SearchTypeHeader } from "~/components/layout/predictive-search/PredictiveSearch/SearchHeader/search-type-header";
import { cn } from "~/utils/cn";
import { Drawer, useDrawer } from "../drawer";
import { IconSearch } from "../icon";

type TypeOpenFrom = "top" | "right" | "left";

export function SearchToggle({
  isOpenDrawerHearder,
  className,
  inline = false,
  compact = false,
  onInlineOpenChange,
}: {
  isOpenDrawerHearder?: boolean;
  className?: string;
  inline?: boolean;
  compact?: boolean;
  onInlineOpenChange?: (isOpen: boolean) => void;
}) {
  const { isOpen, closeDrawer, openDrawer } = useDrawer();
  let settings = useThemeSettings();
  const [searchType, setSearchType] = useState(settings?.searchType);
  const [openFrom, setOpenFrom] = useState<TypeOpenFrom>(
    searchType === "popupSearch" ? "top" : "right",
  );
  const [isInlineOpen, setIsInlineOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 1280) {
        setSearchType("drawerSearch");
        setOpenFrom("left");
      } else {
        setSearchType(settings?.searchType);
        if (settings?.searchType === "drawerSearch" && isOpenDrawerHearder) {
          setOpenFrom("left");
        } else {
          setOpenFrom(settings?.searchType === "popupSearch" ? "top" : "right");
        }
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, [settings?.searchType, isOpenDrawerHearder]);

  if (inline) {
    return (
      <div className={cn("hidden md:block", className)}>
        {isInlineOpen ? (
          <SearchTypeHeader
            inline
            onClose={() => {
              setIsInlineOpen(false);
              onInlineOpenChange?.(false);
            }}
          />
        ) : (
          <button
            type="button"
            onClick={() => {
              setIsInlineOpen(true);
              onInlineOpenChange?.(true);
            }}
            aria-label="Open search"
            className={cn(
              "relative flex items-center justify-center focus:ring-primary/5",
              compact ? "size-5" : "size-6",
            )}
          >
            <IconSearch className={compact ? "size-5" : "size-6"} />
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={className}>
      <button
        type="button"
        aria-label="Open search"
        onClick={openDrawer}
        className="relative flex size-6 shrink-0 items-center justify-center focus:ring-primary/5"
      >
        <IconSearch className="size-6 font-extralight!" />
      </button>
      <Drawer
        open={isOpen}
        onClose={closeDrawer}
        openFrom={openFrom}
        heading={searchType === "drawerSearch" ? "Search" : ""}
        isForm="search"
      >
        {searchType === "popupSearch" && <SearchTypeHeader isOpen={isOpen} />}
        {searchType === "drawerSearch" && <SearchTypeDrawer isOpen={isOpen} />}
      </Drawer>
    </div>
  );
}
