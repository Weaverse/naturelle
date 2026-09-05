import type { ShopifyAddToCartPayload } from "@shopify/hydrogen";
import {
  AnalyticsEventName,
  CartForm,
  getClientBrowserParameters,
  sendShopifyAnalytics,
} from "@shopify/hydrogen";
import type { CartLineInput } from "@shopify/hydrogen/storefront-api-types";
import { useEffect, useRef } from "react";
import type { FetcherWithComponents } from "react-router";
import { Button } from "~/components/button";
import { usePageAnalytics } from "~/hooks/use-page-analytics";

export function AddToCartButton({
  children,
  lines,
  className = "",
  variant = "primary",
  width = "full",
  disabled,
  analytics,
  onFetchingStateChange,
  onAdded,
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
  onAdded?: () => void;
  [key: string]: any;
}) {
  const hasValidLines =
    lines.length > 0 &&
    lines.every(
      (line) =>
        typeof line.merchandiseId === "string" &&
        line.merchandiseId.length > 0 &&
        Number.isInteger(line.quantity) &&
        line.quantity > 0,
    );

  return (
    <CartForm
      route="/cart"
      inputs={{
        lines,
      }}
      action={CartForm.ACTIONS.LinesAdd}
    >
      {(fetcher: FetcherWithComponents<any>) => (
        <AddToCartContent
          analytics={analytics}
          className={className}
          disabled={disabled}
          fetcher={fetcher}
          hasValidLines={hasValidLines}
          onAdded={onAdded}
          onFetchingStateChange={onFetchingStateChange}
          props={props}
          variant={variant}
        >
          {children}
        </AddToCartContent>
      )}
    </CartForm>
  );
}

function AddToCartContent({
  analytics,
  children,
  className,
  disabled,
  fetcher,
  hasValidLines,
  onAdded,
  onFetchingStateChange,
  props,
  variant,
}: {
  analytics?: unknown;
  children: React.ReactNode;
  className: string;
  disabled?: boolean;
  fetcher: FetcherWithComponents<any>;
  hasValidLines: boolean;
  onAdded?: () => void;
  onFetchingStateChange?: (state: string) => void;
  props: Record<string, unknown>;
  variant: "primary" | "secondary" | "outline";
}) {
  useEffect(() => {
    onFetchingStateChange?.(fetcher.state);
  }, [fetcher.state, onFetchingStateChange]);

  return (
    <AddToCartAnalytics fetcher={fetcher} onAdded={onAdded}>
      <input type="hidden" name="analytics" value={JSON.stringify(analytics)} />
      <Button
        as="button"
        type="submit"
        size="lg"
        className={className}
        disabled={Boolean(
          disabled || fetcher.state !== "idle" || !hasValidLines,
        )}
        loading={fetcher.state === "submitting"}
        variant={variant}
        {...props}
      >
        {children}
      </Button>
    </AddToCartAnalytics>
  );
}

function AddToCartAnalytics({
  fetcher,
  children,
  onAdded,
}: {
  fetcher: FetcherWithComponents<any>;
  children: React.ReactNode;
  onAdded?: () => void;
}): React.ReactNode {
  const fetcherData = fetcher.data;
  const formData = fetcher.formData;
  const pageAnalytics = usePageAnalytics({ hasUserConsent: true });
  const handledData = useRef<unknown>(null);

  useEffect(() => {
    if (fetcherData && handledData.current !== fetcherData) {
      handledData.current = fetcherData;
      const cartData: Record<string, unknown> = {};
      if (formData) {
        const cartInputs = CartForm.getFormInput(formData);
        try {
          if (cartInputs.inputs.analytics) {
            const dataInForm: unknown = JSON.parse(
              String(cartInputs.inputs.analytics),
            );
            Object.assign(cartData, dataInForm);
          }
        } catch {
          // Analytics must never block a successful cart update.
        }
      }

      if (
        fetcherData.cart &&
        !fetcherData.userErrors?.length &&
        !fetcherData.errors?.length
      ) {
        onAdded?.();
      }

      if (Object.keys(cartData).length && fetcherData.cart) {
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
  }, [fetcherData, formData, onAdded, pageAnalytics]);
  return <>{children}</>;
}
