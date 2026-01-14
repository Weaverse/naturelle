import { useThemeSettings } from "@weaverse/hydrogen";
import { useEffect, useState } from "react";
import { SearchTypeDrawer } from "~/components/layout/predictive-search/PredictiveSearch/SearchDrawer/search-type-drawer";
import { SearchTypeHeader } from "~/components/layout/predictive-search/PredictiveSearch/SearchHeader/search-type-header";
import { Drawer, useDrawer } from "../drawer";
import { IconSearch } from "../icon";

type TypeOpenFrom = "top" | "right" | "left";

export function SearchToggle({
  isOpenDrawerHearder,
  className,
}: {
  isOpenDrawerHearder?: boolean;
  className?: string;
}) {
  const { isOpen, closeDrawer, openDrawer } = useDrawer();
  let settings = useThemeSettings();
  const [searchType, setSearchType] = useState(settings?.searchType);
  const [openFrom, setOpenFrom] = useState<TypeOpenFrom>(
    searchType === "popupSearch" ? "top" : "right",
  );

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
  return (
    <div className={className}>
      <button
        onClick={openDrawer}
        className="relative flex h-6 w-6 items-center justify-center focus:ring-primary/5"
      >
        <IconSearch className="h-6 w-6 font-extralight!" />
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
