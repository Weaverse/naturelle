import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { useRootLoaderData } from "~/root";
import type { Locale } from "~/types/type-locale";
import { DEFAULT_LOCALE } from "~/utils/const";
import { switchLocalePath } from "~/utils/locale";

export function useCountrySelector() {
  const rootData = useRootLoaderData();
  const selectedLocale = rootData?.selectedLocale ?? DEFAULT_LOCALE;
  const { pathname, search, hash } = useLocation();
  // URL fragments never reach SSR. Defer them until after hydration so the
  // form action is identical on the server and during the first client render.
  const [clientHash, setClientHash] = useState("");
  useEffect(() => setClientHash(hash), [hash]);
  const locales = rootData?.availableLocales ?? [DEFAULT_LOCALE];
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
    return switchLocalePath({ pathname, search, hash: clientHash, locale });
  }

  return {
    countryGroups,
    getRedirectUrl,
    languages,
    selectedLocale,
  };
}
