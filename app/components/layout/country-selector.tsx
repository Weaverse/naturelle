import { CartForm } from "@shopify/hydrogen";
import type { CartBuyerIdentityInput } from "@shopify/hydrogen/storefront-api-types";
import clsx from "clsx";
import { useCallback, useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import { useFetcher, useLocation, useRouteLoaderData } from "react-router";
import { Button } from "~/components/button";
import { IconCaret, IconCheck } from "~/components/icon";
import { useRootLoaderData } from "~/root";
import type { Locale, Localizations } from "~/types/type-locale";
import { DEFAULT_LOCALE } from "~/utils/const";

export function CountrySelector() {
  const fetcher = useFetcher();
  const closeRef = useRef<HTMLDetailsElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const rootData = useRootLoaderData();
  const selectedLocale = rootData?.selectedLocale ?? DEFAULT_LOCALE;
  const { pathname, search } = useLocation();
  const pathWithoutLocale = `${pathname.replace(
    selectedLocale.pathPrefix,
    "",
  )}${search}`;

  const countries = (fetcher.data ?? {}) as Localizations;
  const defaultLocale = countries?.["default"];
  const defaultLocalePrefix = defaultLocale
    ? `${defaultLocale?.language}-${defaultLocale?.country}`
    : "";

  const { ref, inView } = useInView({
    threshold: 0,
    triggerOnce: true,
  });

  const observerRef = useRef(null);
  useEffect(() => {
    ref(observerRef.current);
  }, [ref, observerRef]);

  // Get available countries list when in view
  useEffect(() => {
    if (!inView || fetcher.data || fetcher.state === "loading") return;
    fetcher.load("/api/countries");
  }, [inView, fetcher]);

  const closeDropdown = useCallback(() => {
    closeRef.current?.removeAttribute("open");
    setIsOpen(false);
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div
      ref={observerRef}
      className="md:max-w-96 w-full"
      onMouseLeave={closeDropdown}
    >
      <div className="relative">
        <details
          className="w-full overflow-hidden rounded border border-border-subtle"
          ref={closeRef}
          onToggle={toggleDropdown}
        >
          <summary className="flex w-full cursor-pointer items-center justify-between px-4 py-3">
            <span className="font-normal font-heading text-xl">
              {selectedLocale.label}
            </span>
            <span
              className={`transition-transform duration-300 ${isOpen ? "-rotate-180" : "rotate-0"}`}
            >
              <IconCaret direction="down" className="h-4 w-4" />
            </span>
          </summary>
          <div
            className={`hiddenScroll absolute bottom-full left-0 right-0 w-full overflow-auto border border-border-subtle bg-background transition-all duration-500
            ${isOpen ? "max-h-36" : "max-h-0"}`}
          >
            {countries &&
              Object.keys(countries).map((countryPath) => {
                const countryLocale = countries[countryPath];
                const isSelected =
                  countryLocale.language === selectedLocale.language &&
                  countryLocale.country === selectedLocale.country;
                const countryUrlPath = getCountryUrlPath({
                  countryLocale,
                  defaultLocalePrefix,
                  pathWithoutLocale,
                });
                return (
                  <Country
                    key={countryPath}
                    closeDropdown={closeDropdown}
                    countryUrlPath={countryUrlPath}
                    isSelected={isSelected}
                    countryLocale={countryLocale}
                  />
                );
              })}
          </div>
        </details>
      </div>
    </div>
  );
}

function Country({
  closeDropdown,
  countryLocale,
  countryUrlPath,
  isSelected,
}: {
  closeDropdown: () => void;
  countryLocale: Locale;
  countryUrlPath: string;
  isSelected: boolean;
}) {
  return (
    <ChangeLocaleForm
      key={countryLocale.country}
      redirectTo={countryUrlPath}
      buyerIdentity={{
        countryCode: countryLocale.country,
      }}
    >
      <Button
        classNameContainer={clsx([
          "flex w-full justify-start",
          "cursor-pointer items-center px-4 py-2 text-left",
        ])}
        className="rounded bg-background p-2 transition w-full"
        variant={"custom"}
        type="submit"
        onClick={closeDropdown}
      >
        {countryLocale.label}
        {isSelected ? (
          <span className="ml-2">
            <IconCheck />
          </span>
        ) : null}
      </Button>
    </ChangeLocaleForm>
  );
}

function ChangeLocaleForm({
  children,
  buyerIdentity,
  redirectTo,
}: {
  children: React.ReactNode;
  buyerIdentity: CartBuyerIdentityInput;
  redirectTo: string;
}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.BuyerIdentityUpdate}
      inputs={{
        buyerIdentity,
      }}
    >
      <>
        <input type="hidden" name="redirectTo" value={redirectTo} />
        {children}
      </>
    </CartForm>
  );
}

function getCountryUrlPath({
  countryLocale,
  defaultLocalePrefix,
  pathWithoutLocale,
}: {
  countryLocale: Locale;
  pathWithoutLocale: string;
  defaultLocalePrefix: string;
}) {
  let countryPrefixPath = "";
  const countryLocalePrefix = `${countryLocale.language}-${countryLocale.country}`;

  if (countryLocalePrefix !== defaultLocalePrefix) {
    countryPrefixPath = `/${countryLocalePrefix.toLowerCase()}`;
  }
  return `${countryPrefixPath}${pathWithoutLocale}`;
}
