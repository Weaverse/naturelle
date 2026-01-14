import { Disclosure, Menu } from "@headlessui/react";
import type {
  Filter,
  ProductFilter,
} from "@shopify/hydrogen/storefront-api-types";
import type { SyntheticEvent } from "react";
import { useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router";
import useDebounce from "react-use/esm/useDebounce";
import { Button } from "~/components/button";
import { Checkbox } from "~/components/checkbox";
import { IconCaret, IconXMark } from "~/components/icon";
import { Input } from "~/components/input";
import { Heading } from "~/components/text";
import { FILTER_URL_PREFIX } from "~/utils/const";
import {
  type AppliedFilter,
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
};

export function DrawerFilter({
  filters,
  appliedFilters = [],
  productNumber = 0,
  showSearchSort = false,
}: DrawerFilterProps) {
  const { openDrawer, isOpen, closeDrawer } = useDrawer();
  return (
    <div className="border-y border-border-subtle py-4 px-3 md:px-4 lg:px-0">
      <div className="container flex w-full items-center justify-between">
        <span className="font-heading text-xl font-medium tracking-tight">
          {productNumber} Products
        </span>
        <div className="flex gap-2">
          <SortMenu showSearchSort={showSearchSort} />
          <Button onClick={openDrawer} shape="default" variant="outline">
            <span className="font-heading text-xl font-normal">Filter</span>
          </Button>
          <Drawer
            open={isOpen}
            onClose={closeDrawer}
            openFrom="left"
            heading="FILTER"
            isForm="filter"
          >
            <div className="w-96 px-6">
              <FiltersDrawer
                filters={filters}
                appliedFilters={appliedFilters}
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
}: {
  option: Filter["values"][0];
  appliedFilters: AppliedFilter[];
}) {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const location = useLocation();
  let appliedFilter = appliedFilters.find(
    (f) => JSON.stringify(f.filter) === option.input,
  );
  let [checked, setChecked] = useState(Boolean(appliedFilter));

  let handleCheckedChange = (isChecked: boolean) => {
    setChecked(isChecked);
    if (isChecked) {
      const link = getFilterLink(option.input as string, params, location);
      navigate(link);
    } else if (appliedFilter) {
      let link = getAppliedFilterLink(appliedFilter, params, location);
      navigate(link);
    }
  };
  return (
    <div className="flex gap-2">
      <Checkbox
        checked={checked}
        onCheckedChange={handleCheckedChange}
        label={option.label}
      />
    </div>
  );
}

export function FiltersDrawer({
  filters = [],
  appliedFilters = [],
}: Omit<DrawerFilterProps, "children">) {
  const [params] = useSearchParams();
  const filterMarkup = (filter: Filter, option: Filter["values"][0]) => {
    switch (filter.type) {
      case "PRICE_RANGE": {
        const priceFilter = params.get(`${FILTER_URL_PREFIX}price`);
        const price = priceFilter
          ? (JSON.parse(priceFilter) as ProductFilter["price"])
          : undefined;
        const min = Number.isNaN(Number(price?.min))
          ? undefined
          : Number(price?.min);
        const max = Number.isNaN(Number(price?.max))
          ? undefined
          : Number(price?.max);
        return <PriceRangeFilter min={min} max={max} />;
      }

      default:
        return (
          <ListItemFilter appliedFilters={appliedFilters} option={option} />
        );
    }
  };

  return (
    <nav className="">
      <div className="divide-y divide-border-subtle">
        {filters.map((filter: Filter) => (
          <Disclosure as="div" key={filter.id} className="w-full pb-6 pt-5">
            {({ open }) => (
              <>
                <Disclosure.Button className="flex w-full items-center justify-between">
                  <span className="font-heading text-xl font-medium">
                    {filter.label}
                  </span>
                  <IconCaret direction={open ? "down" : "right"} />
                </Disclosure.Button>
                <Disclosure.Panel key={filter.id}>
                  <ul key={filter.id} className="space-y-4 pt-4">
                    {filter.values?.map((option) => {
                      return (
                        <li key={option.id}>{filterMarkup(filter, option)}</li>
                      );
                    })}
                  </ul>
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
        ))}
      </div>
    </nav>
  );
}

function AppliedFilters({ filters = [] }: { filters: AppliedFilter[] }) {
  const [params] = useSearchParams();
  const location = useLocation();
  return (
    <>
      <Heading as="h4" size="lead" className="pb-4">
        Applied filters
      </Heading>
      <div className="flex flex-wrap gap-2">
        {filters.map((filter: AppliedFilter) => {
          return (
            <Link
              to={getAppliedFilterLink(filter, params, location)}
              className="gap flex rounded-full border px-2"
              key={`${filter.label}-${JSON.stringify(filter.filter)}`}
            >
              <span className="grow">{filter.label}</span>
              <span>
                <IconXMark />
              </span>
            </Link>
          );
        })}
      </div>
    </>
  );
}

const PRICE_RANGE_FILTER_DEBOUNCE = 500;

function PriceRangeFilter({ max, min }: { max?: number; min?: number }) {
  const location = useLocation();
  const params = useMemo(
    () => new URLSearchParams(location.search),
    [location.search],
  );
  const navigate = useNavigate();

  const [minPrice, setMinPrice] = useState(min);
  const [maxPrice, setMaxPrice] = useState(max);

  useDebounce(
    () => {
      if (minPrice === undefined && maxPrice === undefined) {
        params.delete(`${FILTER_URL_PREFIX}price`);
        navigate(`${location.pathname}?${params.toString()}`);
        return;
      }

      const price = {
        ...(minPrice === undefined ? {} : { min: minPrice }),
        ...(maxPrice === undefined ? {} : { max: maxPrice }),
      };
      const newParams = filterInputToParams({ price }, params);
      navigate(`${location.pathname}?${newParams.toString()}`);
    },
    PRICE_RANGE_FILTER_DEBOUNCE,
    [minPrice, maxPrice],
  );

  const onChangeMax = (event: SyntheticEvent) => {
    const value = (event.target as HTMLInputElement).value;
    const newMaxPrice = Number.isNaN(Number.parseFloat(value))
      ? undefined
      : Number.parseFloat(value);
    setMaxPrice(newMaxPrice);
  };

  const onChangeMin = (event: SyntheticEvent) => {
    const value = (event.target as HTMLInputElement).value;
    const newMinPrice = Number.isNaN(Number.parseFloat(value))
      ? undefined
      : Number.parseFloat(value);
    setMinPrice(newMinPrice);
  };

  return (
    <div className="flex gap-6">
      <label htmlFor="minPrice" className="flex items-center gap-1">
        <span>$</span>
        <Input
          id="minPrice"
          name="minPrice"
          type="number"
          value={minPrice ?? ""}
          placeholder="From"
          onChange={onChangeMin}
        />
      </label>
      <label htmlFor="maxPrice" className="flex items-center gap-1">
        <span>$</span>
        <Input
          id="maxPrice"
          name="maxPrice"
          type="number"
          value={maxPrice ?? ""}
          placeholder="To"
          onChange={onChangeMax}
        />
      </label>
    </div>
  );
}

export default function SortMenu({
  showSearchSort = false,
}: {
  showSearchSort?: boolean;
}) {
  const productShortItems: { label: string; key: SortParam }[] = [
    { label: "Featured", key: "featured" },
    {
      label: "Price: Low - High",
      key: "price-low-high",
    },
    {
      label: "Price: High - Low",
      key: "price-high-low",
    },
    {
      label: "Best Selling",
      key: "best-selling",
    },
    {
      label: "Newest",
      key: "newest",
    },
  ];

  const searchSortItems: { label: string; key: SortParam }[] = [
    {
      label: "Price: Low - High",
      key: "price-low-high",
    },
    {
      label: "Price: High - Low",
      key: "price-high-low",
    },
    {
      label: "Relevance",
      key: "relevance",
    },
  ];
  const items = showSearchSort ? searchSortItems : productShortItems;
  const [params] = useSearchParams();
  const location = useLocation();
  const activeItem =
    items.find((item) => item.key === params.get("sort")) || items[0];

  return (
    <Menu as="div" className="relative z-30">
      <Menu.Button className="flex h-[50px] items-center gap-[10px] rounded border border-border px-4 py-3">
        <span className="font-heading text-xl font-medium">Sort by</span>
        <IconCaret />
      </Menu.Button>
      <Menu.Items
        as="nav"
        className="absolute right-0 top-14 flex h-fit w-56 flex-col gap-2 rounded border bg-background p-5"
      >
        {items.map((item) => (
          <Menu.Item key={item.label}>
            {() => (
              <Link to={getSortLink(item.key, params, location)}>
                <p
                  className={`block text-base ${
                    activeItem?.key === item.key ? "font-bold" : "font-normal"
                  }`}
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
