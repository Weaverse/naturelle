import { useLocation, useRouteLoaderData } from "react-router";
import type { RootLoader } from "../root";
import type { I18nLocale, StoreLocalization } from "../types/type-locale";
import { DEFAULT_LOCALE } from "./const.ts";

const LOCALE_SEGMENT = /^[a-z]{2,3}-[a-z]{2}$/i;
const ABSOLUTE_URL = /^[a-z][a-z\d+.-]*:/i;
const STATIC_PATHS = [
  "/__manifest",
  "/assets",
  "/favicon.ico",
  "/robots.txt",
  "/.well-known",
  "/cdn-cgi",
  "/api/query",
  "/api/unstable",
  "/graphiql",
  "/subrequest-profiler",
];

export function isLocaleAgnosticPath(pathname: string) {
  return STATIC_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
}

export function localeCode(locale: Pick<I18nLocale, "language" | "country">) {
  return `${routeLanguageCode(locale.language)}-${locale.country.toLowerCase()}`;
}

export function routeLanguageCode(language: string) {
  return language.split("_", 1)[0].toLowerCase();
}

export function storefrontLanguageCode(language: string, country: string) {
  const normalizedLanguage = language.toUpperCase();
  const normalizedCountry = country.toUpperCase();
  if (
    (normalizedLanguage === "PT" &&
      (normalizedCountry === "BR" || normalizedCountry === "PT")) ||
    (normalizedLanguage === "ZH" &&
      (normalizedCountry === "CN" || normalizedCountry === "TW"))
  ) {
    return `${normalizedLanguage}_${normalizedCountry}`;
  }
  return normalizedLanguage;
}

export function localePathPrefix(
  locale: Pick<I18nLocale, "language" | "country">,
) {
  return `/${localeCode(locale)}`;
}

export function includeDefaultLocale(
  locales: readonly I18nLocale[],
  defaultLocale: I18nLocale,
) {
  const defaultCode = localeCode(defaultLocale);
  const liveDefault = locales.find(
    (locale) => localeCode(locale) === defaultCode,
  );
  return [
    liveDefault ?? defaultLocale,
    ...locales.filter((locale) => localeCode(locale) !== defaultCode),
  ];
}

export function getLocaleSegment(pathname: string) {
  const segment = (pathname.split("/").filter(Boolean)[0] ?? "").replace(
    /\.data$/i,
    "",
  );
  return LOCALE_SEGMENT.test(segment) ? segment.toLowerCase() : null;
}

export function stripLocalePrefix(pathname: string) {
  const segment = getLocaleSegment(pathname);
  if (!segment) {
    return pathname || "/";
  }
  const rawSegment = pathname.split("/").filter(Boolean)[0] ?? segment;
  const withoutLocale = pathname.slice(rawSegment.length + 1);
  return withoutLocale || "/";
}

export function switchLocalePath({
  pathname,
  search = "",
  hash = "",
  locale,
}: {
  pathname: string;
  search?: string;
  hash?: string;
  locale: Pick<I18nLocale, "language" | "country">;
}) {
  const path = stripLocalePrefix(pathname);
  const suffix = path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;
  return `${localePathPrefix(locale)}${suffix}${search}${hash}`;
}

export function prefixPathWithLocale(
  to: string,
  locale: Pick<I18nLocale, "language" | "country">,
) {
  if (
    !to ||
    to.startsWith("#") ||
    to.startsWith("?") ||
    to.startsWith("//") ||
    ABSOLUTE_URL.test(to)
  ) {
    return to;
  }

  const hashIndex = to.indexOf("#");
  const hash = hashIndex >= 0 ? to.slice(hashIndex) : "";
  const withoutHash = hashIndex >= 0 ? to.slice(0, hashIndex) : to;
  const queryIndex = withoutHash.indexOf("?");
  const search = queryIndex >= 0 ? withoutHash.slice(queryIndex) : "";
  const pathname =
    queryIndex >= 0 ? withoutHash.slice(0, queryIndex) : withoutHash;

  if (getLocaleSegment(pathname)) {
    return to;
  }

  const normalizedPath = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const suffix = normalizedPath === "/" ? "" : normalizedPath;
  return `${localePathPrefix(locale)}${suffix}${search}${hash}`;
}

export function usePrefixPathWithLocale(path: string) {
  const rootData = useRouteLoaderData<RootLoader>("root");
  const locale = rootData?.selectedLocale ?? DEFAULT_LOCALE;
  return prefixPathWithLocale(path, locale);
}

export function useIsHomePath() {
  const { pathname } = useLocation();
  return stripLocalePrefix(pathname) === "/";
}

export function intlLocale(locale: Pick<I18nLocale, "language" | "country">) {
  return `${routeLanguageCode(locale.language)}-${locale.country.toUpperCase()}`;
}

export function formatDate(
  value: Date | string | number,
  locale: Pick<I18nLocale, "language" | "country">,
  options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  },
) {
  return new Intl.DateTimeFormat(intlLocale(locale), {
    timeZone: "UTC",
    ...options,
  }).format(value instanceof Date ? value : new Date(value));
}

export function formatNumber(
  value: number,
  locale: Pick<I18nLocale, "language" | "country">,
  options?: Intl.NumberFormatOptions,
) {
  return new Intl.NumberFormat(intlLocale(locale), options).format(value);
}

export function formatCurrency(
  value: number,
  locale: Pick<I18nLocale, "language" | "country" | "currency">,
  options?: Omit<Intl.NumberFormatOptions, "style" | "currency">,
) {
  return formatNumber(value, locale, {
    ...options,
    style: "currency",
    currency: locale.currency,
  });
}

export const parseAsCurrency = formatCurrency;

export function getCanonicalLocaleRedirect(
  request: Request,
  localization: StoreLocalization,
) {
  if (!(request.method === "GET" || request.method === "HEAD")) {
    return null;
  }

  const url = new URL(request.url);
  if (url.pathname.endsWith(".data") || isLocaleAgnosticPath(url.pathname)) {
    return null;
  }

  if (getLocaleSegment(url.pathname)) {
    return null;
  }

  const suffix = url.pathname === "/" ? "" : url.pathname;
  return `${localization.defaultLocale.pathPrefix}${suffix}${url.search}`;
}
