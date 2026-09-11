import { Disclosure, Menu } from "@headlessui/react";
import type {
  Filter,
  ProductFilter,
} from "@shopify/hydrogen/storefront-api-types";
import { useEffect, useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
  useRouteLoaderData,
  useSearchParams,
} from "react-router";
import { Button } from "~/components/button";
import { Checkbox, type CheckboxShape } from "~/components/checkbox";
import { IconCaret, IconFilters, IconXMark } from "~/components/icon";
import type { loader as rootLoader } from "~/root";
import { cn } from "~/utils/cn";
import { FILTER_URL_PREFIX } from "~/utils/const";
import {
  type AppliedFilter,
  clearPaginationParams,
  filterInputToParams,
  getAppliedFilterLink,
  getFilterLink,
  getSortLink,
  type SortParam,
} from "~/utils/filter";
import { Drawer, useDrawer } from "./drawer";

type DrawerFilterProps = {
  productNumber?: number;
  filters: Filter[];
  appliedFilters?: AppliedFilter[];
  collections?: Array<{ handle: string; title: string }>;
  showSearchSort?: boolean;
  priceRange?: { min?: number; max?: number };
  expandFilters?: boolean;
  showFiltersCount?: boolean;
  enableSwatches?: boolean;
  displayAsButtonFor?: string;
  filterItemsLimit?: number;
  checkboxShape?: CheckboxShape;
};

export function DrawerFilter({
  filters,
  appliedFilters = [],
  productNumber = 0,
  showSearchSort = false,
  priceRange,
  expandFilters = true,
  showFiltersCount = true,
  enableSwatches = true,
  displayAsButtonFor = "Size, More filters",
  filterItemsLimit = 10,
  checkboxShape = "square",
}: DrawerFilterProps) {
  const { openDrawer, isOpen, closeDrawer } = useDrawer();
  return (
    <div className="mx-auto flex w-full max-w-[var(--page-width,1440px)] flex-col items-start gap-6 self-stretch px-6 pt-6 lg:px-0">
      <div className="w-full border-t border-border-subtle" />
      <div className="flex w-full items-center justify-between">
        <div className="flex flex-[1_0_0] items-center gap-10 justify-between md:justify-start">
          <Button
            onClick={openDrawer}
            shape="default"
            variant="outline"
            className="rounded-lg px-5 py-3.5 md:hidden"
            classNameContainer="flex items-center justify-center gap-2"
          >
            <IconFilters className="size-5" viewBox="0 0 16 16" />
            <span className="font-heading text-xl font-normal">Filters</span>
          </Button>
          <div className="hidden items-center gap-2 rounded-lg border border-border px-5 py-3.5 md:flex">
            <IconFilters className="size-5" viewBox="0 0 16 16" />
            <span className="font-heading text-xl font-normal">Filters</span>
          </div>
          <span className="font-heading text-xl font-medium tracking-tight">
            {productNumber} Products
          </span>
        </div>

        <div className="block min-w-0">
            <div className="hidden md:block">
              <SortMenu showSearchSort={showSearchSort} />
            </div>
            <Drawer
              open={isOpen}
              onClose={closeDrawer}
              openFrom="left"
              heading="FILTER"
              isForm="filter"
          >
            <div className="w-full px-6 md:w-96">
              <FiltersDrawer
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
          </Drawer>
        </div>
      </div>
    </div>
  );
}

function ListItemFilter({
  option,
  appliedFilters,
  displayAsButton = false,
  displayAsSwatch = false,
  showFiltersCount = true,
  singleSelect = false,
  checkboxShape = "square",
}: {
  option: Filter["values"][0];
  appliedFilters: AppliedFilter[];
  displayAsButton?: boolean;
  displayAsSwatch?: boolean;
  showFiltersCount?: boolean;
  singleSelect?: boolean;
  checkboxShape?: CheckboxShape;
}) {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const location = useLocation();
  const rootData = useRouteLoaderData<typeof rootLoader>("root");
  let appliedFilter = appliedFilters.find(
    (f) => JSON.stringify(f.filter) === option.input,
  );
  const optionInput = JSON.parse(option.input as string) as ProductFilter;
  const checked = singleSelect
    ? Object.entries(optionInput).every(([key, value]) => {
        const values = params.getAll(`${FILTER_URL_PREFIX}${key}`);
        return values.at(-1) === JSON.stringify(value);
      })
    : Boolean(appliedFilter);

  let handleCheckedChange = (isChecked: boolean) => {
    if (isChecked) {
      const nextParams = new URLSearchParams(params);
      if (singleSelect) {
        for (const key of Object.keys(optionInput)) {
          nextParams.delete(`${FILTER_URL_PREFIX}${key}`);
        }
      }
      const link = getFilterLink(option.input as string, nextParams, location);
      navigate(link, { preventScrollReset: true });
    } else if (appliedFilter) {
      let link = getAppliedFilterLink(appliedFilter, params, location);
      navigate(link, { preventScrollReset: true });
    }
  };
  if (displayAsSwatch) {
    const swatchImage = rootData?.swatchesConfigs.images.find(
      ({ name }) => name === option.label,
    );
    const swatchColor = rootData?.swatchesConfigs.colors.find(
      ({ name }) => name === option.label,
    );
    return (
      <button
        type="button"
        title={
          showFiltersCount ? `${option.label} (${option.count})` : option.label
        }
        aria-label={
          showFiltersCount ? `${option.label} (${option.count})` : option.label
        }
        disabled={option.count === 0}
        onClick={() => handleCheckedChange(!checked)}
        className={cn(
          "size-10 overflow-hidden rounded-lg border transition-colors disabled:cursor-not-allowed",
          checked
            ? "border-text-primary p-1"
            : "border-border-subtle hover:border-text-primary",
          option.count === 0 && "diagonal opacity-60",
        )}
      >
        <span
          className="block size-full rounded-md bg-cover bg-center"
          style={{
            backgroundImage: swatchImage?.value
              ? `url(${swatchImage.value})`
              : undefined,
            backgroundColor: swatchColor?.value || option.label.toLowerCase(),
          }}
        />
      </button>
    );
  }
  if (displayAsButton) {
    return (
      <button
        type="button"
        disabled={option.count === 0}
        onClick={() => handleCheckedChange(!checked)}
        className={cn(
          "flex min-h-10 items-center justify-center rounded-lg border px-3 py-2 text-sm transition-colors",
          option.count === 0 &&
            "diagonal cursor-not-allowed text-foreground-subtle opacity-60",
          checked
            ? "border-text-primary bg-text-primary text-background-basic"
            : "border-border-subtle hover:border-text-primary",
        )}
      >
        {option.label}
        {showFiltersCount && (
          <span className="ml-1 text-foreground-subtle">({option.count})</span>
        )}
      </button>
    );
  }

  return (
    <div className="flex gap-2">
      <Checkbox
        checked={checked}
        onCheckedChange={handleCheckedChange}
        disabled={option.count === 0}
        shape={checkboxShape}
        className={cn(
          option.count === 0 && "text-foreground-subtle opacity-60",
        )}
        label={
          <span>
            {option.label}{" "}
            {showFiltersCount && (
              <span className="text-foreground-subtle">({option.count})</span>
            )}
          </span>
        }
      />
    </div>
  );
}

export function FiltersDrawer({
  filters = [],
  appliedFilters = [],
  desktop = false,
  priceRange,
  expandFilters = true,
  showFiltersCount = true,
  enableSwatches = true,
  displayAsButtonFor = "Size, More filters",
  filterItemsLimit = 10,
  checkboxShape = "square",
}: Omit<DrawerFilterProps, "children"> & { desktop?: boolean }) {
  const [params] = useSearchParams();
  const filterMarkup = (filter: Filter, option: Filter["values"][0]) => {
    switch (filter.type) {
      case "PRICE_RANGE": {
        const priceFilter = params.get(`${FILTER_URL_PREFIX}price`);
        const availablePrice = JSON.parse(
          option.input as string,
        ) as ProductFilter;
        const price = priceFilter
          ? (JSON.parse(priceFilter) as ProductFilter["price"])
          : undefined;
        const min = Number.isNaN(Number(price?.min))
          ? undefined
          : Number(price?.min);
        const max = Number.isNaN(Number(price?.max))
          ? undefined
          : Number(price?.max);
        return (
          <PriceRangeFilter
            min={min}
            max={max}
            lowestPrice={priceRange?.min ?? availablePrice.price?.min}
            highestPrice={priceRange?.max ?? availablePrice.price?.max}
          />
        );
      }

      default:
        return (
          <ListItemFilter appliedFilters={appliedFilters} option={option} />
        );
    }
  };

  return (
    <nav
      aria-label="Product filters"
      className={cn("min-w-0 overflow-x-hidden", desktop && "w-full")}
    >
      <div className="divide-y divide-border-subtle">
        {filters.map((filter: Filter) => {
          const label = filter.label.toLowerCase();
          const buttonFilterNames = displayAsButtonFor
            .split(",")
            .map((name) => name.trim().toLowerCase())
            .filter(Boolean);
          const displayAsButton = buttonFilterNames.includes(label);
          const displayAsSwatch =
            enableSwatches &&
            ["color", "colors", "colour", "colours"].includes(label);

          return (
            <Disclosure
              as="div"
              key={filter.id}
              defaultOpen={expandFilters}
              className="w-full py-5"
            >
              {({ open }) => (
                <>
                  <Disclosure.Button className="flex w-full items-center justify-between text-left">
                    <span className="font-heading text-base font-normal">
                      {filter.label}
                    </span>
                    <IconCaret direction={open ? "down" : "right"} />
                  </Disclosure.Button>
                  <Disclosure.Panel key={filter.id}>
                    <ul
                      key={filter.id}
                      className={cn(
                        "pt-4",
                        displayAsButton || displayAsSwatch
                          ? "flex flex-wrap gap-3"
                          : "space-y-4",
                      )}
                    >
                      {filter.type === "PRICE_RANGE" ? (
                        filter.values?.map((option) => (
                          <li key={option.id}>
                            {filterMarkup(filter, option)}
                          </li>
                        ))
                      ) : (
                        <FilterValues
                          options={filter.values}
                          appliedFilters={appliedFilters}
                          displayAsButton={displayAsButton}
                          displayAsSwatch={displayAsSwatch}
                          showFiltersCount={showFiltersCount}
                          limit={filterItemsLimit}
                          checkboxShape={checkboxShape}
                        />
                      )}
                    </ul>
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>
          );
        })}
      </div>
    </nav>
  );
}

function FilterValues({
  options,
  appliedFilters,
  displayAsButton,
  displayAsSwatch,
  showFiltersCount,
  limit,
  checkboxShape,
}: {
  options: Filter["values"];
  appliedFilters: AppliedFilter[];
  displayAsButton: boolean;
  displayAsSwatch: boolean;
  showFiltersCount: boolean;
  limit: number;
  checkboxShape: CheckboxShape;
}) {
  const [expanded, setExpanded] = useState(false);
  const safeLimit = Math.max(1, limit || 10);
  const hasMore = options.length > safeLimit;
  const visibleOptions = expanded
    ? options
    : options.filter(
        (option, index) =>
          index < safeLimit ||
          appliedFilters.some(
            (filter) => JSON.stringify(filter.filter) === option.input,
          ),
      );

  return (
    <>
      {visibleOptions.map((option) => (
        <li key={option.id}>
          <ListItemFilter
            appliedFilters={appliedFilters}
            displayAsButton={displayAsButton}
            displayAsSwatch={displayAsSwatch}
            showFiltersCount={showFiltersCount}
            checkboxShape={checkboxShape}
            option={option}
          />
        </li>
      ))}
      {hasMore && (
        <li className="w-full">
          <button
            type="button"
            className="mt-2 text-sm underline underline-offset-4 hover:no-underline"
            onClick={() => setExpanded((current) => !current)}
          >
            {expanded
              ? "Show less"
              : `Show more (+${options.length - visibleOptions.length})`}
          </button>
        </li>
      )}
    </>
  );
}

export function AppliedFilters({
  filters = [],
  clearTo,
}: {
  filters: AppliedFilter[];
  clearTo?: string;
}) {
  const [params] = useSearchParams();
  const location = useLocation();

  if (filters.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex flex-wrap items-center gap-2">
        {filters.map((filter: AppliedFilter) => {
          return (
            <Link
              to={getAppliedFilterLink(filter, params, location)}
              className="flex min-h-10 items-center gap-2 rounded-full border border-border-subtle px-4 py-2 font-heading text-sm hover:border-foreground"
              key={`${filter.label}-${JSON.stringify(filter.filter)}`}
              preventScrollReset
            >
              <span>{filter.label}</span>
              <IconXMark className="size-4" />
            </Link>
          );
        })}
      </div>
      <Link
        to={clearTo ?? location.pathname}
        className="font-heading text-sm underline underline-offset-4"
        preventScrollReset
      >
        Clear all
      </Link>
    </div>
  );
}

const MINIMUM_PRICE_GAP = 1;

function PriceRangeFilter({
  lowestPrice = 0,
  highestPrice,
  max,
  min,
}: {
  lowestPrice?: number;
  highestPrice?: number;
  max?: number;
  min?: number;
}) {
  const location = useLocation();
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const [minPrice, setMinPrice] = useState(min);
  const [maxPrice, setMaxPrice] = useState(max);
  const maximumPrice = highestPrice ?? Number.POSITIVE_INFINITY;

  useEffect(() => {
    setMinPrice(min);
    setMaxPrice(max);
  }, [min, max]);

  const commitPrice = (nextMin = minPrice, nextMax = maxPrice) => {
    const normalizedMin =
      nextMin === undefined
        ? undefined
        : Math.max(
            lowestPrice,
            Math.min(nextMin, (nextMax ?? maximumPrice) - MINIMUM_PRICE_GAP),
          );
    const normalizedMax =
      nextMax === undefined
        ? undefined
        : Math.min(
            maximumPrice,
            Math.max(
              nextMax,
              (normalizedMin ?? lowestPrice) + MINIMUM_PRICE_GAP,
            ),
          );
    setMinPrice(normalizedMin);
    setMaxPrice(normalizedMax);
    let nextParams = new URLSearchParams(params);
    if (normalizedMin === undefined && normalizedMax === undefined) {
      nextParams.delete(`${FILTER_URL_PREFIX}price`);
    } else {
      nextParams = filterInputToParams(
        {
          price: {
            ...(normalizedMin === undefined ? {} : { min: normalizedMin }),
            ...(normalizedMax === undefined ? {} : { max: normalizedMax }),
          },
        },
        nextParams,
      );
    }
    clearPaginationParams(nextParams);
    if (params.toString() !== nextParams.toString()) {
      navigate(`${location.pathname}?${nextParams.toString()}`, {
        preventScrollReset: true,
      });
    }
  };

  const setAndCommitMin = (value: number) => {
    setMinPrice(value);
    commitPrice(value, maxPrice);
  };
  const setAndCommitMax = (value: number) => {
    setMaxPrice(value);
    commitPrice(minPrice, value);
  };

  const incrementMin = () =>
    setAndCommitMin(
      Math.min((minPrice ?? lowestPrice) + 1, (maxPrice ?? maximumPrice) - 1),
    );
  const decrementMin = () =>
    setAndCommitMin(Math.max((minPrice ?? lowestPrice) - 1, lowestPrice));
  const incrementMax = () =>
    setAndCommitMax(
      Math.min((maxPrice ?? highestPrice ?? 0) + 1, maximumPrice),
    );
  const decrementMax = () =>
    setAndCommitMax(
      Math.max(
        (maxPrice ?? highestPrice ?? lowestPrice) - 1,
        (minPrice ?? lowestPrice) + 1,
      ),
    );

  const onChangeMax = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const parsedValue = Number.parseInt(value, 10);
    setMaxPrice(Number.isNaN(parsedValue) ? undefined : parsedValue);
  };

  const onChangeMin = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const parsedValue = Number.parseInt(value, 10);
    setMinPrice(Number.isNaN(parsedValue) ? undefined : parsedValue);
  };

  return (
    <div className="space-y-5">
      {highestPrice !== undefined && (
        <p className="font-heading text-base text-foreground-subtle">
          The highest price is: ${highestPrice}
        </p>
      )}
      <div className="flex w-full min-w-0 items-center gap-3 overflow-hidden">
        <label
          htmlFor="minPrice"
          className="flex min-w-0 flex-1 items-center gap-2"
        >
          <span>$</span>
          <div className="flex h-10 min-w-0 flex-1 items-center rounded-lg border border-border-subtle bg-background-basic px-3">
            <input
              id="minPrice"
              name="minPrice"
              type="number"
              min={lowestPrice}
              max={
                maxPrice !== undefined
                  ? maxPrice - MINIMUM_PRICE_GAP
                  : highestPrice
              }
              step={MINIMUM_PRICE_GAP}
              value={minPrice ?? ""}
              placeholder="From"
              onChange={onChangeMin}
              onBlur={() => commitPrice()}
              className="min-w-0 w-full appearance-none border-none bg-transparent p-0 text-base outline-none ring-0 focus:outline-none focus:ring-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
            <PriceStepper
              onIncrement={incrementMin}
              onDecrement={decrementMin}
              label="min"
            />
          </div>
        </label>
        <label
          htmlFor="maxPrice"
          className="flex min-w-0 flex-1 items-center gap-2"
        >
          <span>$</span>
          <div className="flex h-10 min-w-0 flex-1 items-center rounded-lg border border-border-subtle bg-background-basic px-3">
            <input
              id="maxPrice"
              name="maxPrice"
              type="number"
              min={
                minPrice !== undefined
                  ? minPrice + MINIMUM_PRICE_GAP
                  : lowestPrice
              }
              max={highestPrice}
              step={MINIMUM_PRICE_GAP}
              value={maxPrice ?? ""}
              placeholder="To"
              onChange={onChangeMax}
              onBlur={() => commitPrice()}
              className="min-w-0 w-full appearance-none border-none bg-transparent p-0 text-base outline-none ring-0 focus:outline-none focus:ring-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
            <PriceStepper
              onIncrement={incrementMax}
              onDecrement={decrementMax}
              label="max"
            />
          </div>
        </label>
      </div>
    </div>
  );
}

function PriceStepper({
  onIncrement,
  onDecrement,
  label,
}: {
  onIncrement: () => void;
  onDecrement: () => void;
  label: "min" | "max";
}) {
  return (
    <span className="flex shrink-0 flex-col gap-1">
      <button
        type="button"
        onClick={onIncrement}
        aria-label={`Increase ${label} price`}
      >
        <IconCaret direction="up" className="size-3" />
      </button>
      <button
        type="button"
        onClick={onDecrement}
        aria-label={`Decrease ${label} price`}
      >
        <IconCaret direction="down" className="size-3" />
      </button>
    </span>
  );
}

export default function SortMenu({
  showSearchSort = false,
}: {
  showSearchSort?: boolean;
}) {
  const productSortItems: { label: string; key: SortParam }[] = [
    { label: "Relevance", key: "relevance" },
    { label: "Alphabetically, A-Z", key: "alphabetical-a-z" },
    { label: "Alphabetically, Z-A", key: "alphabetical-z-a" },
    { label: "Oldest to Newest", key: "oldest" },
    { label: "Newest to Oldest", key: "newest" },
    { label: "Best Selling", key: "best-selling" },
  ];

  const searchSortItems: { label: string; key: SortParam }[] = [
    { label: "Relevance", key: "relevance" },
    {
      label: "Price, (low to high)",
      key: "price-low-high",
    },
    {
      label: "Price, (high to low)",
      key: "price-high-low",
    },
  ];
  const items = showSearchSort ? searchSortItems : productSortItems;
  const [params] = useSearchParams();
  const location = useLocation();
  const defaultItem = showSearchSort ? searchSortItems[0] : productSortItems[1];
  const activeItem =
    items.find((item) => item.key === params.get("sort")) || defaultItem;

  return (
    <Menu
      as="div"
      className="relative z-30 flex items-center justify-end gap-3"
    >
      <span className="mr-3 hidden shrink-0 font-heading text-base font-normal md:inline">
        Sort by
      </span>
      <Menu.Button
        aria-label={`Sort products: ${activeItem.label}`}
        className="flex h-12 items-center justify-between gap-2 rounded-sm border border-border px-3 py-2.5 text-left md:h-15 md:min-w-48 md:gap-3 md:px-4 md:py-3.5"
      >
        <span className="font-heading text-base font-normal md:hidden">
          Sort
        </span>
        <span className="hidden font-heading text-base font-normal md:inline">
          {activeItem.label}
        </span>
        <IconCaret className="size-4 shrink-0" />
      </Menu.Button>
      <Menu.Items
        as="nav"
        className="absolute top-full right-0 flex h-fit w-56 flex-col gap-3 border border-border bg-background px-4 py-4 shadow-sm"
      >
        {items.map((item) => (
          <Menu.Item key={item.label}>
            {() => (
              <Link
                to={getSortLink(item.key, params, location)}
                preventScrollReset
                className="underline-offset-[6px] hover:underline"
              >
                <p
                  className={cn(
                    "block font-heading text-base",
                    activeItem.key === item.key ? "font-bold" : "font-normal",
                  )}
                >
                  {item.label}
                </p>
              </Link>
            )}
          </Menu.Item>
        ))}
      </Menu.Items>
    </Menu>
  );
}
