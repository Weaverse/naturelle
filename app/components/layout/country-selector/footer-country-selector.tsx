import { useTranslation } from "@weaverse/hydrogen";
import { LocaleSelect } from "./locale-select";
import { useCountrySelector } from "./use-country-selector";

export function FooterCountrySelector() {
  const { t } = useTranslation();
  const { countryGroups, getRedirectUrl, languages, selectedLocale } =
    useCountrySelector();

  return (
    <div className="flex max-w-full flex-wrap items-center gap-4">
      <LocaleSelect
        ariaLabel={t("locale.selectLanguage")}
        label={selectedLocale.languageName ?? selectedLocale.language}
        options={languages.map((locale) => ({
          key: `${locale.language}-${locale.country}`,
          label: locale.languageName ?? locale.language,
          locale,
        }))}
        getRedirectUrl={getRedirectUrl}
        placement="footer"
      />
      <LocaleSelect
        ariaLabel={t("locale.selectCountry")}
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
