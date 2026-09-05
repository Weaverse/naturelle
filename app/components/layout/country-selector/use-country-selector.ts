import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { useFetcher, useLocation } from "react-router";
import { useRootLoaderData } from "~/root";
import type { Locale, Localizations } from "~/types/type-locale";
import { DEFAULT_LOCALE } from "~/utils/const";

export const LANGUAGE_LABELS: Record<string, string> = {
  EN: "English",
  DE: "Deutsch",
  FR: "Français",
  ES: "Español",
  IT: "Italiano",
  JA: "日本語",
  ZH: "中文",
};

export function useCountrySelector() {
  const fetcher = useFetcher();
  const rootData = useRootLoaderData();
  const selectedLocale = rootData?.selectedLocale ?? DEFAULT_LOCALE;
  const { pathname, search } = useLocation();
  const pathWithoutLocale = `${pathname.replace(selectedLocale.pathPrefix, "")}${search}`;
  const countries = (fetcher.data ?? {}) as Localizations;
  const defaultLocale = countries.default;
  const defaultLocalePrefix = defaultLocale
    ? `${defaultLocale.language}-${defaultLocale.country}`
    : "";
  const { ref: observerRef, inView } = useInView({
    threshold: 0,
    triggerOnce: true,
  });

  useEffect(() => {
    if (!inView || fetcher.data || fetcher.state === "loading") {
      return;
    }
    fetcher.load("/api/countries");
  }, [inView, fetcher]);

  const locales = Object.values(countries);
  const countryGroups = Array.from(
    locales.reduce((groups, locale) => {
      const group = groups.get(locale.country) ?? [];
      group.push(locale);
      groups.set(locale.country, group);
      return groups;
    }, new Map<string, Locale[]>()),
  );
  const languages = locales.filter(
    (locale) => locale.country === selectedLocale.country,
  );

  function getRedirectUrl(locale: Locale) {
    const prefix = `${locale.language}-${locale.country}`;
    const localePath =
      prefix === defaultLocalePrefix ? "" : `/${prefix.toLowerCase()}`;
    return `${localePath}${pathWithoutLocale}`;
  }

  return {
    countryGroups,
    getRedirectUrl,
    languages,
    observerRef,
    selectedLocale,
  };
}
