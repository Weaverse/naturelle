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
  sectionClassName = "mx-auto flex w-full max-w-page items-start gap-5 px-5 py-8 lg:flex-row md:px-6 lg:px-0",
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
        <div className="hidden w-[320px] shrink-0 lg:block">
          <div className="sticky top-(--height-nav) flex max-h-[calc(100vh-var(--height-nav)-20px)] flex-col overflow-x-hidden overflow-y-auto pr-5">
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
        <div className={cn(contentClassName)}>
          <AppliedFilters filters={appliedFilters} clearTo={clearFiltersTo} />
          {children}
        </div>
      </div>
    </>
  );
}
