import type {
  OptimisticCartLineInput,
  ShopifyAddToCartPayload,
} from "@shopify/hydrogen";
import {
  AnalyticsEventName,
  CartForm,
  getClientBrowserParameters,
  sendShopifyAnalytics,
} from "@shopify/hydrogen";
import { useEffect, useRef } from "react";
import type { FetcherWithComponents } from "react-router";
import { Button } from "~/components/button";
import { useCartFetcherSync } from "~/components/cart/cart-sync";
import { useCartStore } from "~/components/cart/store";
import { usePageAnalytics } from "~/hooks/use-page-analytics";
import { getCartMutationError } from "~/utils/cart-error";
import { cn } from "~/utils/cn";
import { usePrefixPathWithLocale } from "~/utils/locale";

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
  lines: OptimisticCartLineInput[];
  className?: string;
  variant?: "primary" | "secondary" | "outline";
  width?: "auto" | "full";
  disabled?: boolean;
  analytics?: unknown;
  onFetchingStateChange?: (state: string) => void;
  onAdded?: () => void;
  [key: string]: any;
}) {
  const cartRoute = usePrefixPathWithLocale("/cart");
  const hasValidLines =
    lines.length > 0 &&
    lines.every(
      (line) =>
        typeof line.merchandiseId === "string" &&
        line.merchandiseId.length > 0 &&
        Number.isInteger(line.quantity) &&
        Number(line.quantity) > 0,
    );

  return (
    <CartForm
      route={cartRoute}
      inputs={{ lines }}
      action={CartForm.ACTIONS.LinesAdd}
    >
      {(fetcher: FetcherWithComponents<any>) => (
        <AddToCartContent
          analytics={analytics}
          className={className}
          disabled={Boolean(disabled)}
          fetcher={fetcher}
          hasValidLines={hasValidLines}
          lines={lines}
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
  lines,
  onAdded,
  onFetchingStateChange,
  props,
  variant,
}: {
  analytics?: unknown;
  children: React.ReactNode;
  className: string;
  disabled: boolean;
  fetcher: FetcherWithComponents<any>;
  hasValidLines: boolean;
  lines: OptimisticCartLineInput[];
  onAdded?: () => void;
  onFetchingStateChange?: (state: string) => void;
  props: Record<string, any>;
  variant: "primary" | "secondary" | "outline";
}) {
  const pendingToken = useRef<string | null>(null);
  const submitted = useRef(false);
  const isAdding = fetcher.state !== "idle";
  const errorMessage = getCartMutationError(fetcher.data);
  useCartFetcherSync(fetcher);

  useEffect(() => {
    onFetchingStateChange?.(fetcher.state);
  }, [fetcher.state, onFetchingStateChange]);

  useEffect(() => {
    if (fetcher.state !== "idle" || !submitted.current) {
      return;
    }
    submitted.current = false;
    if (pendingToken.current) {
      useCartStore.getState().clearPendingAdd(pendingToken.current);
    }
    pendingToken.current = null;
  }, [fetcher.state]);

  return (
    <AddToCartAnalytics fetcher={fetcher} onAdded={onAdded}>
      <input type="hidden" name="analytics" value={JSON.stringify(analytics)} />
      <Button
        as="button"
        type="submit"
        size="lg"
        className={cn("h-12 px-6 py-3 text-base", className)}
        disabled={Boolean(disabled || isAdding || !hasValidLines)}
        loading={fetcher.state === "submitting"}
        variant={variant}
        {...props}
        onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
          props.onClick?.(event);
          if (event.defaultPrevented) {
            return;
          }
          submitted.current = true;
          pendingToken.current = useCartStore.getState().stagePendingAdd(lines);
          useCartStore.getState().open();
        }}
      >
        {children}
      </Button>
      {errorMessage ? (
        <p role="alert" className="mt-2 text-red-700 text-sm">
          {errorMessage}
        </p>
      ) : null}
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

      // The drawer opens synchronously at click time. A completed request may
      // call the product-specific success callback, but must never reopen a
      // drawer the customer already dismissed.
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

        const cartInputs = formData
          ? CartForm.getFormInput(formData)
          : undefined;
        const lines = cartInputs?.inputs.lines as
          | Array<{ sellingPlanId?: string }>
          | undefined;
        const hasSubscription =
          Array.isArray(lines) && lines.some((line) => line.sellingPlanId);

        sendShopifyAnalytics({
          eventName: hasSubscription
            ? ("subscription_added_to_cart" as typeof AnalyticsEventName.ADD_TO_CART)
            : AnalyticsEventName.ADD_TO_CART,
          payload: addToCartPayload,
        });
      }
    }
  }, [fetcherData, formData, onAdded, pageAnalytics]);
  return <>{children}</>;
}
