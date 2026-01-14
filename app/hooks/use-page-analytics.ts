import type { ShopifyPageViewPayload } from "@shopify/hydrogen";
import { useMemo } from "react";
import { useMatches } from "react-router";

import { DEFAULT_LOCALE } from "~/utils/const";

export function usePageAnalytics({
  hasUserConsent,
}: {
  hasUserConsent: boolean;
}) {
  const matches = useMatches();

  return useMemo(() => {
    const data: Record<string, unknown> = {};

    for (const event of matches) {
      const eventData = event?.data as Record<string, unknown>;
      if (eventData) {
        if (eventData.analytics) {
          Object.assign(data, eventData.analytics);
        }

        const selectedLocale =
          (eventData.selectedLocale as typeof DEFAULT_LOCALE) || DEFAULT_LOCALE;

        Object.assign(data, {
          currency: selectedLocale.currency,
          acceptedLanguage: selectedLocale.language,
        });
      }
    }

    return {
      ...data,
      hasUserConsent,
    } as unknown as ShopifyPageViewPayload;
  }, [matches, hasUserConsent]);
}
