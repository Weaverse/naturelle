import type {
  Storefront as HydrogenStorefront,
  I18nBase,
} from "@shopify/hydrogen";
import type { CurrencyCode } from "@shopify/hydrogen/storefront-api-types";

export type NonNullableFields<T> = {
  [P in keyof T]: NonNullable<T[P]>;
};

export type I18nLocale = I18nBase & {
  currency: CurrencyCode;
  label: string;
  pathPrefix: string;
  countryName?: string;
  languageName?: string;
};

export type Locale = I18nLocale;

export type StoreLocalization = {
  availableLocales: I18nLocale[];
  defaultLocale: I18nLocale;
  selectedLocale: I18nLocale;
};

export type Storefront = HydrogenStorefront<I18nLocale>;
