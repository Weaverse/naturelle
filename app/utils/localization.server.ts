import { CacheCustom, type Storefront } from "@shopify/hydrogen";
import type {
  CountryCode,
  CurrencyCode,
  LanguageCode,
} from "@shopify/hydrogen/storefront-api-types";
import type { I18nLocale, StoreLocalization } from "~/types/type-locale";
import { DEFAULT_LOCALE } from "~/utils/const";
import {
  getLocaleSegment,
  includeDefaultLocale,
  localeCode,
  localePathPrefix,
  storefrontLanguageCode,
} from "~/utils/locale";

type Language = {
  isoCode: LanguageCode;
  name: string;
  endonymName?: string | null;
};

type LocalizationQueryData = {
  localization: {
    country: {
      isoCode: CountryCode;
      name: string;
      currency: { isoCode: CurrencyCode };
    };
    language: Language;
    availableLanguages: Language[];
    availableCountries: Array<{
      isoCode: CountryCode;
      name: string;
      currency: { isoCode: CurrencyCode };
      availableLanguages: Language[];
    }>;
  };
};

export async function loadStoreLocalization(
  storefront: Storefront,
  request: Request,
): Promise<StoreLocalization> {
  try {
    const { localization } = await storefront.query<LocalizationQueryData>(
      LOCALIZATION_QUERY,
      { cache: CacheCustom({ maxAge: 60, staleWhileRevalidate: 300 }) },
    );

    const liveLocales = localization.availableCountries.flatMap((country) => {
      const languages =
        country.isoCode === localization.country.isoCode
          ? mergeLanguages(
              country.availableLanguages,
              localization.availableLanguages,
            )
          : country.availableLanguages;

      return languages.map<I18nLocale>((language) => ({
        label: `${country.name} · ${country.currency.isoCode}`,
        language: language.isoCode,
        country: country.isoCode,
        currency: country.currency.isoCode,
        pathPrefix: localePathPrefix({
          language: language.isoCode,
          country: country.isoCode,
        }),
        countryName: country.name,
        languageName: language.endonymName || language.name,
      }));
    });

    const defaultLocale =
      liveLocales.find(
        (locale) => localeCode(locale) === localeCode(DEFAULT_LOCALE),
      ) ??
      liveLocales[0] ??
      DEFAULT_LOCALE;
    const availableLocales = includeDefaultLocale(liveLocales, defaultLocale);
    const requestedCode = getLocaleSegment(new URL(request.url).pathname);
    const selectedLocale =
      availableLocales.find((locale) => localeCode(locale) === requestedCode) ??
      defaultLocale;

    return {
      availableLocales,
      defaultLocale,
      selectedLocale,
    };
  } catch (error) {
    console.warn("Unable to load Shopify Markets localization", error);
    return {
      availableLocales: [DEFAULT_LOCALE],
      defaultLocale: DEFAULT_LOCALE,
      selectedLocale: DEFAULT_LOCALE,
    };
  }
}

export function getRequestI18n(request: Request): I18nLocale {
  const segment = getLocaleSegment(new URL(request.url).pathname);
  if (!segment) {
    return DEFAULT_LOCALE;
  }

  const [language, country] = segment.split("-");
  return {
    ...DEFAULT_LOCALE,
    language: storefrontLanguageCode(language, country) as LanguageCode,
    country: country.toUpperCase() as CountryCode,
    pathPrefix: `/${segment}`,
  };
}

function mergeLanguages(...groups: Language[][]) {
  return Array.from(
    new Map(
      groups.flat().map((language) => [language.isoCode, language]),
    ).values(),
  );
}

const LOCALIZATION_QUERY = `#graphql
  query StoreLocalization {
    localization {
      country {
        isoCode
        name
        currency { isoCode }
      }
      language {
        isoCode
        name
        endonymName
      }
      availableLanguages {
        isoCode
        name
        endonymName
      }
      availableCountries {
        isoCode
        name
        currency { isoCode }
        availableLanguages {
          isoCode
          name
          endonymName
        }
      }
    }
  }
` as const;
