import type { ProductFilter } from "@shopify/hydrogen/storefront-api-types";
import type { I18nLocale } from "~/types/type-locale";
import { FILTER_URL_PREFIX } from "~/utils/const";
import type { AppliedFilter } from "~/utils/filter";
import { parseAsCurrency } from "~/utils/locale";

type FilterValue = {
  input?: string | null;
  id?: string | null;
  label?: string | null;
};

export function getFiltersFromSearchParams(searchParams: URLSearchParams) {
  return [...searchParams.entries()].reduce((filterList, [key, value]) => {
    if (!key.startsWith(FILTER_URL_PREFIX)) {
      return filterList;
    }

    const filterKey = key.substring(FILTER_URL_PREFIX.length);
    const parsedValue = parseFilterParam(value);
    if (parsedValue !== undefined) {
      filterList.push({
        [filterKey]: parsedValue,
      });
    }

    return filterList;
  }, [] as ProductFilter[]);
}

function parseFilterParam(value: string) {
  try {
    return JSON.parse(value) as unknown;
  } catch {
    return undefined;
  }
}

export function getPriceRangeFilters(filters: ProductFilter[]) {
  return filters.filter((filter) => !filter.price);
}

export function getAppliedFilters({
  filters,
  availableFilterValues,
  locale,
}: {
  filters: ProductFilter[];
  availableFilterValues: FilterValue[];
  locale: I18nLocale;
}): AppliedFilter[] {
  return filters
    .map((filter) => {
      const foundValue = availableFilterValues.find((value) => {
        if (!value.input) {
          return false;
        }

        const valueInput = JSON.parse(value.input) as ProductFilter;
        // special case for price, the user can enter something freeform (still a number, though)
        // that may not make sense for the locale/currency.
        // Basically just check if the price filter is applied at all.
        if (valueInput.price && filter.price) {
          return true;
        }

        // This comparison should be okay as long as we're not manipulating the input we
        // get from the API before using it as a URL param.
        return JSON.stringify(valueInput) === JSON.stringify(filter);
      });

      if (!foundValue) {
        if (filter.variantOption) {
          return {
            filter,
            label: filter.variantOption.value,
          };
        }

        // eslint-disable-next-line no-console
        console.error("Could not find filter value for filter", filter);

        return null;
      }

      if (foundValue.id === "filter.v.price") {
        // Special case for price, we want to show the min and max values as the label.
        const input = foundValue.input
          ? (JSON.parse(foundValue.input) as ProductFilter)
          : {};
        const min = parseAsCurrency(input.price?.min ?? 0, locale);
        const max = input.price?.max
          ? parseAsCurrency(input.price.max, locale)
          : "";
        const label = min && max ? `${min} - ${max}` : "Price";

        return {
          filter,
          label,
        };
      }

      return {
        filter,
        label: foundValue.label || "",
      };
    })
    .filter((filter): filter is NonNullable<typeof filter> => filter !== null);
}
