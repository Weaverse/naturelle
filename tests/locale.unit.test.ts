import assert from "node:assert/strict";
import test from "node:test";
import { DEFAULT_LOCALE } from "../app/utils/const.ts";
import {
  formatCurrency,
  formatDate,
  formatNumber,
  getCanonicalLocaleRedirect,
  getLocaleSegment,
  includeDefaultLocale,
  intlLocale,
  localeCode,
  prefixPathWithLocale,
  storefrontLanguageCode,
  stripLocalePrefix,
  switchLocalePath,
} from "../app/utils/locale.ts";

const enUS = DEFAULT_LOCALE;
const frFR = {
  ...DEFAULT_LOCALE,
  language: "FR",
  country: "FR",
  currency: "EUR",
  pathPrefix: "/fr-fr",
} as const;

test("recognizes only a leading language-country locale", () => {
  assert.equal(getLocaleSegment("/fr-fr/products/serum"), "fr-fr");
  assert.equal(getLocaleSegment("/FR-FR.data"), "fr-fr");
  assert.equal(getLocaleSegment("/fil-ph/products/serum"), "fil-ph");
  assert.equal(getLocaleSegment("/products/fr-fr-serum"), null);
});

test("normalizes Shopify regional language codes to BCP-47 routes", () => {
  const ptBR = { ...enUS, language: "PT_BR", country: "BR" } as const;
  assert.equal(localeCode(ptBR), "pt-br");
  assert.equal(intlLocale(ptBR), "pt-BR");
  assert.equal(storefrontLanguageCode("pt", "br"), "PT_BR");
  assert.equal(storefrontLanguageCode("zh", "tw"), "ZH_TW");
  assert.equal(storefrontLanguageCode("fil", "ph"), "FIL");
});

test("prefixes internal paths exactly once", () => {
  assert.equal(
    prefixPathWithLocale("/products/serum", enUS),
    "/en-us/products/serum",
  );
  assert.equal(
    prefixPathWithLocale("/fr-fr/products/serum", frFR),
    "/fr-fr/products/serum",
  );
  assert.equal(
    prefixPathWithLocale("https://example.com", frFR),
    "https://example.com",
  );
  assert.equal(prefixPathWithLocale("#reviews", frFR), "#reviews");
});

test("switching locale preserves path, query, and hash", () => {
  assert.equal(
    switchLocalePath({
      pathname: "/en-us/products/serum",
      search: "?size=large",
      hash: "#reviews",
      locale: frFR,
    }),
    "/fr-fr/products/serum?size=large#reviews",
  );
  assert.equal(stripLocalePrefix("/fr-fr"), "/");
});

test("keeps every live locale while placing the default first", () => {
  assert.deepEqual(includeDefaultLocale([frFR], enUS), [enUS, frFR]);
  assert.deepEqual(includeDefaultLocale([frFR, enUS], enUS), [enUS, frFR]);
});

test("canonical redirect adds the live default locale prefix", () => {
  const localization = {
    availableLocales: [enUS, frFR],
    defaultLocale: enUS,
    selectedLocale: enUS,
  };
  assert.equal(
    getCanonicalLocaleRedirect(
      new Request("https://example.com/products/serum?size=large"),
      localization,
    ),
    "/en-us/products/serum?size=large",
  );
  assert.equal(
    getCanonicalLocaleRedirect(
      new Request("https://example.com/fr-fr/products/serum"),
      localization,
    ),
    null,
  );
  assert.equal(
    getCanonicalLocaleRedirect(
      new Request("https://example.com/en-us.data?_routes=root"),
      localization,
    ),
    null,
  );
});

test("formats currency, dates, and numbers with the selected locale", () => {
  assert.match(formatCurrency(1234.5, frFR), /1[\s\u202f]234,50\s€/);
  assert.equal(formatNumber(1234.5, frFR), "1 234,5");
  assert.match(formatDate("2026-09-28T00:00:00Z", frFR), /28 septembre 2026/);
});
