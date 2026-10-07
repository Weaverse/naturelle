import { Disclosure, Menu } from "@headlessui/react";
import type {
  Filter,
  ProductFilter,
} from "@shopify/hydrogen/storefront-api-types";
import { useTranslation } from "@weaverse/hydrogen";
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
import { intlLocale } from "~/utils/locale";
import { parsePriceFilterParam } from "~/utils/product-filters";
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
  const { t } = useTranslation();
  const { openDrawer, isOpen, closeDrawer } = useDrawer();
  return (
    <div className="mx-auto flex w-full max-w-[var(--page-width,1440px)] flex-col items-start gap-6 self-stretch px-6 lg:px-0">
      <div className="w-full border-t border-border-subtle" />
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            onClick={openDrawer}
            shape="default"
            variant="outline"
            className="rounded-lg px-5 py-3.5"
            classNameContainer="flex items-center justify-center gap-2"
          >
            <IconFilters className="size-5" viewBox="0 0 16 16" />
            <span className="font-heading text-xl font-normal">
              {t("collection.filter")}
            </span>
          </Button>
          <span className="hidden font-body text-base font-normal leading-none tracking-[-0.16px] lg:inline">
            {productNumber} {t("collection.products")}
          </span>
        </div>

        <div className="block min-w-0">
          <SortMenu showSearchSort={showSearchSort} />
          <Drawer
            open={isOpen}
            onClose={closeDrawer}
            openFrom="left"
            heading={t("collection.filter")}
            isForm="filter"
          >
            <div className="w-full">
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
  checkboxShape = "square",
}: {
  option: Filter["values"][0];
  appliedFilters: AppliedFilter[];
  displayAsButton?: boolean;
  displayAsSwatch?: boolean;
  showFiltersCount?: boolean;
  checkboxShape?: CheckboxShape;
}) {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const location = useLocation();
  const rootData = useRouteLoaderData<typeof rootLoader>("root");
  let appliedFilter = appliedFilters.find(
    (f) => JSON.stringify(f.filter) === option.input,
  );
  const checked = Boolean(appliedFilter);

  let handleCheckedChange = (isChecked: boolean) => {
    if (isChecked) {
      const nextParams = new URLSearchParams(params);
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
          "flex items-center justify-center rounded-xl border-2 px-3 py-2 font-body text-base leading-[160%] font-normal tracking-[-0.16px] transition-colors",
          option.count === 0 &&
            "diagonal cursor-not-allowed text-foreground-subtle opacity-60",
          checked
            ? "border-text-primary"
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
    <div className="flex gap-2 font-body text-base leading-[160%] font-normal tracking-[-0.16px] text-text">
      <Checkbox
        checked={checked}
        onCheckedChange={handleCheckedChange}
        disabled={option.count === 0}
        shape={checkboxShape}
        controlClassName={checkboxShape === "square" ? "rounded-md" : undefined}
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
  const { t } = useTranslation();
  const [params] = useSearchParams();
  const filterMarkup = (filter: Filter, option: Filter["values"][0]) => {
    switch (filter.type) {
      case "PRICE_RANGE": {
        const priceFilter = params.get(`${FILTER_URL_PREFIX}price`);
        const availablePrice = JSON.parse(
          option.input as string,
        ) as ProductFilter;
        const price = parsePriceFilterParam(priceFilter);
        return (
          <PriceRangeFilter
            min={price?.min ?? undefined}
            max={price?.max ?? undefined}
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
      aria-label={t("collection.filterProducts")}
      className={cn("min-w-0 overflow-x-hidden", desktop && "w-full")}
    >
      <div className="flex flex-col gap-5">
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
              className="w-full border-b border-border-subtle pb-6"
            >
              {({ open }) => (
                <>
                  <Disclosure.Button className="flex w-full items-center justify-between text-left">
                    <span className="font-heading text-xl font-normal leading-[1.6] tracking-[-0.2px]">
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
  const { t } = useTranslation();
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
              ? t("collection.showLess")
              : t("collection.showMore", {
                  count: options.length - visibleOptions.length,
                })}
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
  const { t } = useTranslation();
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
        {t("collection.clearAll")}
      </Link>
    </div>
  );
}

function getCurrencySymbol(currencyCode: string, locale: string) {
  try {
    return (
      new Intl.NumberFormat(locale, {
        style: "currency",
        currency: currencyCode,
        currencyDisplay: "narrowSymbol",
      })
        .formatToParts(0)
        .find((part) => part.type === "currency")?.value || currencyCode
    );
  } catch {
    return currencyCode;
  }
}

function getCurrencyFractionDigits(currencyCode: string, locale: string) {
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currencyCode,
    }).resolvedOptions().maximumFractionDigits;
  } catch {
    return 2;
  }
}

function parsePriceInput(value: string) {
  if (!value) {
    return undefined;
  }
  const parsedValue = Number(value);
  return Number.isFinite(parsedValue) ? parsedValue : undefined;
}

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
  const { t } = useTranslation();
  const location = useLocation();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const rootData = useRouteLoaderData<typeof rootLoader>("root");
  const selectedLocale = rootData?.selectedLocale;
  const currencyCode = selectedLocale?.currency ?? "USD";
  const locale = selectedLocale ? intlLocale(selectedLocale) : "en-US";
  const currencySymbol = getCurrencySymbol(currencyCode, locale);
  const currencyFractionDigits = getCurrencyFractionDigits(
    currencyCode,
    locale,
  );
  const priceStep = 10 ** -currencyFractionDigits;
  const roundPrice = (value: number) =>
    Number(value.toFixed(currencyFractionDigits));

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
            Math.min(nextMin, (nextMax ?? maximumPrice) - priceStep),
          );
    const normalizedMax =
      nextMax === undefined
        ? undefined
        : Math.min(
            maximumPrice,
            Math.max(nextMax, (normalizedMin ?? lowestPrice) + priceStep),
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
      roundPrice(
        Math.min(
          (minPrice ?? lowestPrice) + priceStep,
          (maxPrice ?? maximumPrice) - priceStep,
        ),
      ),
    );
  const decrementMin = () =>
    setAndCommitMin(
      roundPrice(Math.max((minPrice ?? lowestPrice) - priceStep, lowestPrice)),
    );
  const incrementMax = () =>
    setAndCommitMax(
      roundPrice(
        Math.min((maxPrice ?? highestPrice ?? 0) + priceStep, maximumPrice),
      ),
    );
  const decrementMax = () =>
    setAndCommitMax(
      roundPrice(
        Math.max(
          (maxPrice ?? highestPrice ?? lowestPrice) - priceStep,
          (minPrice ?? lowestPrice) + priceStep,
        ),
      ),
    );

  const onChangeMax = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMaxPrice(parsePriceInput(event.target.value));
  };

  const onChangeMin = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMinPrice(parsePriceInput(event.target.value));
  };

  return (
    <div className="space-y-4">
      {highestPrice !== undefined && (
        <p className="font-body text-base leading-[1.6] tracking-[-0.16px] text-text-primary">
          {t("collection.highestPrice", {
            price: `${currencySymbol}${highestPrice}`,
          })}
        </p>
      )}
      <div className="flex w-full min-w-0 items-center gap-6 overflow-hidden">
        <div className="flex min-w-0 flex-1 items-center gap-1">
          <span aria-hidden="true">{currencySymbol}</span>
          <div className="flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-border-subtle bg-background-basic p-3">
            <input
              aria-label={t("collection.minimumPrice")}
              name="minPrice"
              type="number"
              inputMode="decimal"
              min={lowestPrice}
              max={maxPrice !== undefined ? maxPrice - priceStep : highestPrice}
              step={priceStep}
              value={minPrice ?? ""}
              placeholder={t("collection.from")}
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
        </div>
        <div className="flex min-w-0 flex-1 items-center gap-1">
          <span aria-hidden="true">{currencySymbol}</span>
          <div className="flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-border-subtle bg-background-basic p-3">
            <input
              aria-label={t("collection.maximumPrice")}
              name="maxPrice"
              type="number"
              inputMode="decimal"
              min={minPrice !== undefined ? minPrice + priceStep : lowestPrice}
              max={highestPrice}
              step={priceStep}
              value={maxPrice ?? ""}
              placeholder={t("collection.to")}
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
        </div>
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
  const { t } = useTranslation();
  const incrementLabel =
    label === "min"
      ? t("collection.increaseMinimumPrice")
      : t("collection.increaseMaximumPrice");
  const decrementLabel =
    label === "min"
      ? t("collection.decreaseMinimumPrice")
      : t("collection.decreaseMaximumPrice");

  return (
    <span className="flex shrink-0 flex-col gap-1">
      <button type="button" onClick={onIncrement} aria-label={incrementLabel}>
        <IconCaret direction="up" className="size-3" />
      </button>
      <button type="button" onClick={onDecrement} aria-label={decrementLabel}>
        <IconCaret direction="down" className="size-3" />
      </button>
    </span>
  );
}

export function SortMenu({
  showSearchSort = false,
}: {
  showSearchSort?: boolean;
}) {
  const { t } = useTranslation();
  const productSortItems: { label: string; key: SortParam }[] = [
    { label: t("collection.relevance"), key: "relevance" },
    { label: t("collection.featured"), key: "featured" },
    { label: t("collection.alphabeticalAZ"), key: "alphabetical-a-z" },
    { label: t("collection.alphabeticalZA"), key: "alphabetical-z-a" },
    { label: t("collection.oldest"), key: "oldest" },
    { label: t("collection.newest"), key: "newest" },
    { label: t("collection.bestSelling"), key: "best-selling" },
  ];

  const searchSortItems: { label: string; key: SortParam }[] = [
    { label: t("collection.relevance"), key: "relevance" },
    {
      label: t("collection.priceLowHigh"),
      key: "price-low-high",
    },
    {
      label: t("collection.priceHighLow"),
      key: "price-high-low",
    },
  ];
  const items = showSearchSort ? searchSortItems : productSortItems;
  const [params] = useSearchParams();
  const location = useLocation();
  const defaultItem = items[0];
  const activeItem =
    items.find((item) => item.key === params.get("sort")) || defaultItem;

  return (
    <Menu
      as="div"
      className="relative z-30 flex items-center justify-end gap-3"
    >
      <span className="hidden shrink-0 font-heading text-xl font-normal leading-[1.6] tracking-[-0.2px] md:inline">
        {t("collection.sortBy")}
      </span>
      <Menu.Button
        aria-label={t("collection.sortProducts", { sort: activeItem.label })}
        className="flex h-12 items-center justify-between gap-2 rounded-sm border border-border px-3 py-2.5 text-left md:h-15 md:min-w-48 md:gap-3 md:px-4 md:py-3.5"
      >
        <span className="font-heading max-w-[7.5rem] text-ellipsis overflow-hidden whitespace-nowrap text-sm font-normal md:hidden">
          {activeItem.label}
        </span>
        <span className="hidden font-heading text-xl font-normal leading-[1.6] tracking-[-0.2px] md:inline">
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
