import type { FetcherWithComponents } from "@remix-run/react";
import type { ShopifyAddToCartPayload } from "@shopify/hydrogen";
import {
  AnalyticsEventName,
  CartForm,
  getClientBrowserParameters,
  sendShopifyAnalytics,
} from "@shopify/hydrogen";
import type { CartLineInput } from "@shopify/hydrogen/storefront-api-types";
import { useEffect } from "react";

import { Button } from "~/components/button";
import { usePageAnalytics } from "~/hooks/usePageAnalytics";

export function AddToCartButton({
  children,
  lines,
  className = "",
  variant = "primary",
  width = "full",
  disabled,
  analytics,
  onFetchingStateChange,
  ...props
}: {
  children: React.ReactNode;
  lines: CartLineInput[];
  className?: string;
  variant?: "primary" | "secondary" | "outline";
  width?: "auto" | "full";
  disabled?: boolean;
  analytics?: unknown;
  onFetchingStateChange?: (state: string) => void;
  [key: string]: any;
}) {
  return (
    <CartForm
      route="/cart"
      inputs={{
        lines,
      }}
      action={CartForm.ACTIONS.LinesAdd}
    >
      {(fetcher: FetcherWithComponents<any>) => {
        useEffect(() => {
          if (onFetchingStateChange) {
            onFetchingStateChange(fetcher.state);
          }
        }, [fetcher.state]);

        return (
          <AddToCartAnalytics fetcher={fetcher}>
            <input
              type="hidden"
              name="analytics"
              value={JSON.stringify(analytics)}
            />
            <Button
              as="button"
              type="submit"
              size="lg"
              className={className}
              disabled={disabled ?? fetcher.state !== "idle"}
              loading={fetcher.state === "submitting"}
              variant={variant}
              {...props}
            >
              {children}
            </Button>
          </AddToCartAnalytics>
        );
      }}
    </CartForm>
  );
}

function AddToCartAnalytics({
  fetcher,
  children,
}: {
  fetcher: FetcherWithComponents<any>;
  children: React.ReactNode;
}): JSX.Element {
  const fetcherData = fetcher.data;
  const formData = fetcher.formData;
  const pageAnalytics = usePageAnalytics({ hasUserConsent: true });

  useEffect(() => {
    if (formData) {
      const cartData: Record<string, unknown> = {};
      const cartInputs = CartForm.getFormInput(formData);

      try {
        if (cartInputs.inputs.analytics) {
          const dataInForm: unknown = JSON.parse(
            String(cartInputs.inputs.analytics),
          );
          Object.assign(cartData, dataInForm);
        }
      } catch {
        // do nothing
      }

      if (Object.keys(cartData).length && fetcherData) {
        const addToCartPayload: ShopifyAddToCartPayload = {
          ...getClientBrowserParameters(),
          ...pageAnalytics,
          ...cartData,
          cartId: fetcherData.cart.id,
        };

        sendShopifyAnalytics({
          eventName: AnalyticsEventName.ADD_TO_CART,
          payload: addToCartPayload,
        });
      }
    }
  }, [fetcherData, formData, pageAnalytics]);
  return <>{children}</>;
}
