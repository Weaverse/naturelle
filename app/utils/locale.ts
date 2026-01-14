import { useLocation, useRouteLoaderData } from "react-router";
import type { RootLoader } from "~/root";
import type { I18nLocale } from "~/types/type-locale";
import { COUNTRIES, DEFAULT_LOCALE } from "~/utils/const";

export function getLocaleFromRequest(request: Request): I18nLocale {
  const url = new URL(request.url);
  const firstPathPart = `/${url.pathname.substring(1).split("/")[0].toLowerCase()}`;

  return COUNTRIES[firstPathPart]
    ? {
        ...COUNTRIES[firstPathPart],
        pathPrefix: firstPathPart,
      }
    : {
        ...COUNTRIES.default,
        pathPrefix: "",
      };
}

export function usePrefixPathWithLocale(path: string) {
  const rootData = useRouteLoaderData<RootLoader>("root");
  const selectedLocale = rootData?.selectedLocale ?? DEFAULT_LOCALE;

  return `${selectedLocale.pathPrefix}${path.startsWith("/") ? path : `/${path}`}`;
}

export function useIsHomePath() {
  let { pathname } = useLocation();
  let rootData = useRouteLoaderData<RootLoader>("root");
  let selectedLocale = rootData?.selectedLocale ?? DEFAULT_LOCALE;
  let strippedPathname = pathname.replace(selectedLocale.pathPrefix, "");
  return strippedPathname === "/";
}

export function parseAsCurrency(value: number, locale: I18nLocale) {
  return new Intl.NumberFormat(`${locale.language}-${locale.country}`, {
    style: "currency",
    currency: locale.currency,
  }).format(value);
}
