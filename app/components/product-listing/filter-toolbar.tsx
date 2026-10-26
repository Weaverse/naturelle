import type { Filter } from "@shopify/hydrogen/storefront-api-types";
import type { ReactNode } from "react";
import {
  AppliedFilters,
  DrawerFilter,
  FiltersDrawer,
} from "~/components/drawer-filter";
import { cn } from "~/utils/cn";
import type { AppliedFilter } from "~/utils/filter";

interface ProductListingFilterToolbarProps {
  filters: Filter[];
  appliedFilters: AppliedFilter[];
  productNumber: number;
  priceRange?: {
    min?: number;
    max?: number;
  };
  expandFilters?: boolean;
  showFiltersCount?: boolean;
  enableSwatches?: boolean;
  displayAsButtonFor?: string;
  filterItemsLimit?: number;
  checkboxShape?: "square" | "circle";
  showSearchSort?: boolean;
  collections?: Array<{ handle: string; title: string }>;
  clearFiltersTo?: string;
  children?: ReactNode;
  sectionClassName?: string;
  contentClassName?: string;
}

export function ProductListingFilterToolbar({
  filters,
  appliedFilters,
  productNumber,
  priceRange,
  expandFilters = true,
  showFiltersCount = true,
  enableSwatches = true,
  displayAsButtonFor = "Size, More filters",
  filterItemsLimit = 10,
  checkboxShape = "square",
  showSearchSort,
  collections,
  clearFiltersTo,
  sectionClassName = "mx-auto flex w-full max-w-page items-start gap-10 px-5 py-8 lg:flex-row md:px-6 lg:px-0",
  contentClassName = "min-w-0 flex-1",
  children,
}: ProductListingFilterToolbarProps) {
  return (
    <>
      <DrawerFilter
        productNumber={productNumber}
        filters={filters}
        appliedFilters={appliedFilters}
        collections={collections}
        priceRange={priceRange}
        showSearchSort={showSearchSort}
        expandFilters={expandFilters}
        showFiltersCount={showFiltersCount}
        enableSwatches={enableSwatches}
        displayAsButtonFor={displayAsButtonFor}
        filterItemsLimit={filterItemsLimit}
        checkboxShape={checkboxShape}
      />
      <div className={cn(sectionClassName)}>
        <div className="hidden w-[320px] shrink-0 self-stretch lg:block">
          <div className="hiddenScroll sticky top-[calc(var(--height-nav)+82px)] flex max-h-[calc(100vh-var(--height-nav)-102px)] flex-col gap-5 overflow-x-hidden overflow-y-auto">
            {appliedFilters.length > 0 && (
              <AppliedFilters
                filters={appliedFilters}
                clearTo={clearFiltersTo}
              />
            )}
            <FiltersDrawer
              desktop
              filters={filters}
              appliedFilters={appliedFilters}
              priceRange={priceRange}
              expandFilters={expandFilters}
              showFiltersCount={showFiltersCount}
              enableSwatches={enableSwatches}
              displayAsButtonFor={displayAsButtonFor}
              filterItemsLimit={filterItemsLimit}
              checkboxShape={checkboxShape}
            />
          </div>
        </div>
        <div className="min-w-0 flex-1">
          {appliedFilters.length > 0 && (
            <div className="mb-10 lg:hidden">
              <AppliedFilters
                filters={appliedFilters}
                clearTo={clearFiltersTo}
              />
            </div>
          )}
          <div className={cn(contentClassName)}>{children}</div>
        </div>
      </div>
    </>
  );
}
