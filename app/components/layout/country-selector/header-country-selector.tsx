import { useTranslation } from "@weaverse/hydrogen";
import { LocaleSelect } from "./locale-select";
import { useCountrySelector } from "./use-country-selector";

export function HeaderCountrySelector() {
  const { t } = useTranslation();
  const { countryGroups, getRedirectUrl, languages, selectedLocale } =
    useCountrySelector();

  return (
    <div className="flex items-center gap-4">
      <LocaleSelect
        ariaLabel={t("locale.selectLanguage")}
        label={selectedLocale.language}
        options={languages.map((locale) => ({
          key: `${locale.language}-${locale.country}`,
          label: locale.languageName ?? locale.language,
          locale,
        }))}
        getRedirectUrl={getRedirectUrl}
        placement="header"
      />
      <LocaleSelect
        ariaLabel={t("locale.selectCountry")}
        label={selectedLocale.currency}
        options={countryGroups.map(([country, countryLocales]) => {
          const locale =
            countryLocales.find(
              (item) => item.language === selectedLocale.language,
            ) ?? countryLocales[0];
          return { key: country, label: locale.label, locale };
        })}
        getRedirectUrl={getRedirectUrl}
        placement="header"
      />
    </div>
  );
}
