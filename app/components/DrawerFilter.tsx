import {Disclosure, Menu} from '@headlessui/react';

import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from '@remix-run/react';
import type {
  Filter,
  ProductFilter,
} from '@shopify/hydrogen/storefront-api-types';
import type {SyntheticEvent} from 'react';
import {useMemo, useState} from 'react';
import {useDebounce} from 'react-use';

import {Button} from '@/components/button';
import {Checkbox} from '@/components/checkbox';
import {Input} from '@/components/input';
import {IconCaret, IconXMark} from '~/components/Icon';
import {Heading, Text} from '~/components/Text';
import {FILTER_URL_PREFIX} from '~/lib/const';
import {
  SortParam,
  filterInputToParams,
  getAppliedFilterLink,
  getFilterLink,
  getSortLink,
  type AppliedFilter,
} from '~/lib/filter';
import {Drawer} from './Drawer';

type DrawerFilterProps = {
  productNumber?: number;
  filters: Filter[];
  appliedFilters?: AppliedFilter[];
  children: React.ReactNode;
  collections?: Array<{handle: string; title: string}>;
};

export function DrawerFilter({
  filters,
  appliedFilters = [],
  children,
  productNumber = 0,
}: DrawerFilterProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="flex items-center justify-between w-full">
        <span>{productNumber} products</span>
        <div className="flex gap-2">
          <SortMenu />
          <Drawer
            direction="left"
            trigger={
              <Button shape="default" variant="secondary" size="md">
                <span>Filter</span>
              </Button>
            }
            open={isOpen}
            onOpenChange={setIsOpen}
            className="bg-white h-full w-fit fixed top-0"
          >
            <div className="w-96 p-6">
              <FiltersDrawer
                filters={filters}
                appliedFilters={appliedFilters}
              />
            </div>
          </Drawer>
        </div>
      </div>
      <div className="flex flex-col flex-wrap md:flex-row">{children}</div>
    </>
  );
}

function ListItemFilter({
  option,
  appliedFilters,
}: {
  option: Filter['values'][0];
  appliedFilters: AppliedFilter[];
}) {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const location = useLocation();
  let filter = appliedFilters.find(
    (filter) => JSON.stringify(filter.filter) === option.input,
  );
  let [checked, setChecked] = useState(!!filter);

  let handleCheckedChange = (checked: boolean) => {
    setChecked(checked);
    if (checked) {
      const link = getFilterLink(option.input as string, params, location);
      navigate(link);
    } else if (filter) {
      let link = getAppliedFilterLink(filter, params, location);
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
}: Omit<DrawerFilterProps, 'children'>) {
  const [params] = useSearchParams();

  const filterMarkup = (filter: Filter, option: Filter['values'][0]) => {
    switch (filter.type) {
      case 'PRICE_RANGE':
        const priceFilter = params.get(`${FILTER_URL_PREFIX}price`);
        const price = priceFilter
          ? (JSON.parse(priceFilter) as ProductFilter['price'])
          : undefined;
        const min = isNaN(Number(price?.min)) ? undefined : Number(price?.min);
        const max = isNaN(Number(price?.max)) ? undefined : Number(price?.max);
        return <PriceRangeFilter min={min} max={max} />;

      default:
        return (
          <ListItemFilter appliedFilters={appliedFilters} option={option} />
        );
    }
  };

  return (
    <nav className="">
      <Heading as="h4" size="heading" className="pb-3">
        Filter
      </Heading>
      <div className="divide-y">
        {filters.map((filter: Filter) => (
          <Disclosure as="div" key={filter.id} className="w-full pt-5 pb-6">
            {({open}) => (
              <>
                <Disclosure.Button className="flex justify-between w-full">
                  <Text size="lead">{filter.label}</Text>
                  <IconCaret direction={open ? 'down' : 'left'} />
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

function AppliedFilters({filters = []}: {filters: AppliedFilter[]}) {
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
              className="flex px-2 border rounded-full gap"
              key={`${filter.label}-${JSON.stringify(filter.filter)}`}
            >
              <span className="flex-grow">{filter.label}</span>
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

function PriceRangeFilter({max, min}: {max?: number; min?: number}) {
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
        ...(minPrice === undefined ? {} : {min: minPrice}),
        ...(maxPrice === undefined ? {} : {max: maxPrice}),
      };
      const newParams = filterInputToParams({price}, params);
      navigate(`${location.pathname}?${newParams.toString()}`);
    },
    PRICE_RANGE_FILTER_DEBOUNCE,
    [minPrice, maxPrice],
  );

  const onChangeMax = (event: SyntheticEvent) => {
    const value = (event.target as HTMLInputElement).value;
    const newMaxPrice = Number.isNaN(parseFloat(value))
      ? undefined
      : parseFloat(value);
    setMaxPrice(newMaxPrice);
  };

  const onChangeMin = (event: SyntheticEvent) => {
    const value = (event.target as HTMLInputElement).value;
    const newMinPrice = Number.isNaN(parseFloat(value))
      ? undefined
      : parseFloat(value);
    setMinPrice(newMinPrice);
  };

  return (
    <div className="flex gap-6">
      <label className="flex gap-1 items-center">
        <span>$</span>
        <Input
          name="minPrice"
          type="number"
          value={minPrice ?? ''}
          placeholder="From"
          onChange={onChangeMin}
        />
      </label>
      <label className="flex gap-1 items-center">
        <span>$</span>
        <Input
          name="maxPrice"
          type="number"
          value={maxPrice ?? ''}
          placeholder="To"
          onChange={onChangeMax}
        />
      </label>
    </div>
  );
}

export default function SortMenu() {
  const items: {label: string; key: SortParam}[] = [
    {label: 'Featured', key: 'featured'},
    {
      label: 'Price: Low - High',
      key: 'price-low-high',
    },
    {
      label: 'Price: High - Low',
      key: 'price-high-low',
    },
    {
      label: 'Best Selling',
      key: 'best-selling',
    },
    {
      label: 'Newest',
      key: 'newest',
    },
  ];
  const [params] = useSearchParams();
  const location = useLocation();
  const activeItem =
    items.find((item) => item.key === params.get('sort')) || items[0];

  return (
    <Menu as="div" className="relative z-40">
      <Menu.Button className="flex items-center border p-3">
        <span className="px-2 font-medium">Sort by</span>
        <IconCaret />
      </Menu.Button>
      <Menu.Items
        as="nav"
        className="absolute top-14 right-0 flex flex-col p-4 rounded bg-background border w-48"
      >
        {items.map((item) => (
          <Menu.Item key={item.label}>
            {() => (
              <Link
                className={`block text-sm mb-2 ${
                  activeItem?.key === item.key ? 'font-bold' : ''
                }`}
                to={getSortLink(item.key, params, location)}
              >
                {item.label}
              </Link>
            )}
          </Menu.Item>
        ))}
      </Menu.Items>
    </Menu>
  );
}
