import type { I18nLocale } from "~/types/type-locale";

/**
 * Bootstrap locale used before Shopify Markets metadata is available.
 * Runtime locale options always come from Storefront API localization data.
 */
export const DEFAULT_LOCALE: I18nLocale = Object.freeze({
  label: "United States · USD",
  language: "EN",
  country: "US",
  currency: "USD",
  pathPrefix: "/en-us",
  countryName: "United States",
  languageName: "English",
});

export const PAGINATION_SIZE = 8;

export const FILTER_URL_PREFIX = "filter.";

export const INPUT_STYLE_CLASSES =
  "appearance-none rounded dark:bg-transparent border focus:border-line/50 focus:ring-0 w-full py-2 px-3 text-body/90 placeholder:text-body/50 leading-tight focus:shadow-outline";

export const getInputStyleClasses = (isError?: string | null) => {
  return `${INPUT_STYLE_CLASSES} ${
    isError ? "border-red-500" : "border-line/20"
  }`;
};
