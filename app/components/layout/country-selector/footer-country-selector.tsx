import { LocaleSelect } from "./locale-select";
import { LANGUAGE_LABELS, useCountrySelector } from "./use-country-selector";

export function FooterCountrySelector() {
  const {
    countryGroups,
    getRedirectUrl,
    languages,
    observerRef,
    selectedLocale,
  } = useCountrySelector();

  return (
    <div ref={observerRef} className="flex items-center gap-4">
      <LocaleSelect
        ariaLabel="Select language"
        label={
          LANGUAGE_LABELS[selectedLocale.language] ?? selectedLocale.language
        }
        options={languages.map((locale) => ({
          key: `${locale.language}-${locale.country}`,
          label: LANGUAGE_LABELS[locale.language] ?? locale.language,
          locale,
        }))}
        getRedirectUrl={getRedirectUrl}
        placement="footer"
      />
      <LocaleSelect
        ariaLabel="Select country"
        label={selectedLocale.label}
        options={countryGroups.map(([country, countryLocales]) => {
          const locale =
            countryLocales.find(
              (item) => item.language === selectedLocale.language,
            ) ?? countryLocales[0];
          return { key: country, label: locale.label, locale };
        })}
        getRedirectUrl={getRedirectUrl}
        placement="footer"
      />
    </div>
  );
}
