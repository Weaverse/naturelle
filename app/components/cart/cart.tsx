import { CircleNotchIcon, WarningCircleIcon } from "@phosphor-icons/react";
import { Image, Money } from "@shopify/hydrogen";
import { useThemeSettings } from "@weaverse/hydrogen";
import { PaymentMethods } from "~/components/layout/footer/payment-methods";
import { Link } from "~/components/link";
import {
  getCartMutationError,
  getCartMutationWarning,
} from "~/utils/cart-error";
import { cn } from "~/utils/cn";
import { useVariantUrl } from "~/utils/variants";
import { IconLock, IconRemove } from "../icon";
import { CartPopularCollections } from "./cart-popular-collections";
import { CartSummary } from "./cart-summary";
import type { CartLayout, CartLine, CartWithOptimistic } from "./cart-types";
import { getCartLineRenderKeys } from "./optimistic-cart";
import { useCart, useCartStore } from "./store";

type CartMainProps = {
  initialCart?: CartWithOptimistic | null;
  layout: CartLayout;
  onClose?: () => void;
};

export function CartMain({ initialCart, layout, onClose }: CartMainProps) {
  const liveCart = useCart();
  const cart = liveCart ?? initialCart ?? null;
  const linesCount = Boolean(cart?.lines?.nodes?.length || 0);
  const cartHasItems = Boolean(cart) && (cart?.totalQuantity ?? 0) > 0;

  return (
    <div
      className={cn(
        layout === "page" && "cart-main container",
        layout === "aside" && "relative flex min-h-0 flex-1 flex-col",
      )}
    >
      <CartEmpty
        visible={!(cartHasItems || linesCount)}
        layout={layout}
        onClose={onClose}
      />
      {cartHasItems && cart && (
        <CartDetails cart={cart} layout={layout} onClose={onClose} />
      )}
    </div>
  );
}

function CartDetails({
  layout,
  cart,
  onClose,
}: {
  layout: CartLayout;
  cart: CartWithOptimistic;
  onClose?: () => void;
}) {
  const paymentSettings = useThemeSettings();
  const {
    showVisa,
    showMastercard,
    showAmericanExpress,
    showPayPal,
    showDiners,
  } = paymentSettings;
  const hasPaymentMethods =
    showVisa !== false ||
    showMastercard !== false ||
    showAmericanExpress !== false ||
    showPayPal !== false ||
    showDiners === true;

  if (layout === "page") {
    return (
      <div className="flex flex-col lg:flex-row items-start max-w-page w-full gap-10 px-4 md:px-6 lg:px-0 pb-12 lg:pb-20">
        <div className="mx-auto w-full min-w-0 flex-1">
          <CartLines lines={cart?.lines} layout={layout} onClose={onClose} />
        </div>

        <div
          className={cn(
            "grid w-full shrink-0 grid-cols-1 items-center [grid-template-areas:'summary'_'secure'] lg:ml-auto lg:w-auto lg:gap-4",
            hasPaymentMethods
              ? "md:grid-cols-2 md:[grid-template-areas:'payments_summary'_'._secure'] lg:grid-cols-1 lg:[grid-template-areas:'summary'_'payments'_'secure']"
              : "md:ml-auto md:w-1/2 lg:w-auto",
          )}
        >
          {hasPaymentMethods && (
            <CartAcceptedPayments
              showVisa={showVisa}
              showMastercard={showMastercard}
              showAmericanExpress={showAmericanExpress}
              showPayPal={showPayPal}
              showDiners={showDiners}
            />
          )}
          <div className="flex flex-col gap-4 [grid-area:summary]">
            <CartSummary cart={cart} layout={layout} />
          </div>
          <SecureCheckoutNotice className="[grid-area:secure]" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col justify-between">
      <CartLines lines={cart?.lines} layout={layout} onClose={onClose} />
      <CartSummary cart={cart} layout={layout} />
    </div>
  );
}

function CartAcceptedPayments({
  showVisa,
  showMastercard,
  showAmericanExpress,
  showPayPal,
  showDiners,
}: {
  showVisa?: boolean;
  showMastercard?: boolean;
  showAmericanExpress?: boolean;
  showPayPal?: boolean;
  showDiners?: boolean;
}) {
  return (
    <div className="hidden w-full flex-col items-center justify-center gap-4 px-6 py-4 md:flex [grid-area:payments]">
      <p className="text-sm text-text-subtle text-center">We accept</p>
      <PaymentMethods
        showVisa={showVisa}
        showMastercard={showMastercard}
        showAmericanExpress={showAmericanExpress}
        showPayPal={showPayPal}
        showDiners={showDiners}
      />
    </div>
  );
}

function SecureCheckoutNotice({ className }: { className?: string }) {
  return (
    <p
      className={cn(
        "flex w-full items-center justify-center gap-2 px-4 py-2 text-center font-body text-sm leading-none font-normal tracking-[-0.14px] text-text-subtle",
        className,
      )}
    >
      <IconLock className="size-3.5 shrink-0" aria-hidden="true" />
      <span>Secure checkout</span>
    </p>
  );
}

function CartLines({
  lines,
  layout,
  onClose,
}: {
  layout: CartLayout;
  lines: CartWithOptimistic["lines"] | undefined;
  onClose?: () => void;
}) {
  if (!lines) {
    return null;
  }

  const renderKeys = getCartLineRenderKeys(lines.nodes);

  return (
    <section
      aria-label="Cart items"
      className={cn(layout === "aside" && "min-h-0 flex-1 overflow-y-auto")}
    >
      {layout === "page" && (
        <>
          <div className="border-border-subtle border-b pb-4 font-heading text-xl leading-[150%] font-normal tracking-[-0.2px] text-text md:hidden">
            Product
          </div>
          <div className="hidden grid-cols-[minmax(0,2fr)_0.8fr_1fr_0.8fr_32px] gap-3 border-border-subtle border-b pb-4 font-heading text-xl leading-[150%] font-normal tracking-[-0.2px] text-text md:grid lg:gap-5">
            <span>Product</span>
            <span>Price</span>
            <span>Quantity</span>
            <span>Total</span>
            <span className="sr-only">Remove</span>
          </div>
        </>
      )}
      <ul
        className={cn(
          "grid border-border-subtle",
          layout === "page" && "border-b",
          layout === "aside" && "border-t",
          layout === "aside" && "pb-4",
        )}
      >
        {lines.nodes.map((line, index) => (
          <CartLineItem
            key={renderKeys[index]}
            line={line}
            layout={layout}
            onClose={onClose}
          />
        ))}
      </ul>
    </section>
  );
}

function CartLineItem({
  line,
  layout,
  onClose,
}: {
  layout: CartLayout;
  line: CartLine;
  onClose?: () => void;
}) {
  const { id, merchandise } = line;
  const lineItemUrl = useVariantUrl(
    merchandise.product.handle,
    merchandise.selectedOptions,
  );
  const variantSummary = getVariantSummary(merchandise.selectedOptions);

  const isLineRemoving = useCartStore((state) =>
    state.pendingLineRemovals.has(id),
  );
  const removalError = useCartStore((state) => state.lineRemovalErrors.get(id));
  const removalWarning = useCartStore((state) =>
    state.lineRemovalWarnings.get(id),
  );
  const removalErrorMessage = getCartMutationError(removalError);
  const removalWarningMessage = getCartMutationWarning(removalWarning);

  if (layout === "page") {
    return (
      <li
        className="grid grid-cols-[5rem_minmax(0,1fr)_auto] items-start gap-x-2 gap-y-3 border-border-subtle border-b py-4 last:border-b-0 md:grid-cols-[minmax(0,2fr)_0.8fr_1fr_0.8fr_32px] md:items-center md:gap-3 lg:gap-5"
        hidden={isLineRemoving}
      >
        <div className="contents md:flex md:min-w-0 md:items-center md:gap-4">
          {merchandise.image && (
            <Link
              to={lineItemUrl}
              prefetch="intent"
              onClick={onClose}
              className="col-start-1 row-span-2 row-start-1 size-20 shrink-0 overflow-hidden rounded-sm bg-background-basic md:size-16"
            >
              <Image
                alt={merchandise.product.title}
                data={merchandise.image}
                width={128}
                height={128}
                loading="lazy"
                className="size-full object-contain"
              />
            </Link>
          )}
          <div className="col-start-2 row-start-1 min-w-0">
            <Link prefetch="intent" to={lineItemUrl} onClick={onClose}>
              <p className="font-body text-base leading-[160%] font-normal tracking-[-0.16px] text-text">
                {merchandise.product.title}
              </p>
            </Link>
            {variantSummary && (
              <p className="font-body text-base leading-[160%] font-normal text-text-subtle">
                {variantSummary}
              </p>
            )}
          </div>
        </div>
        <div className="hidden font-body text-base leading-[160%] font-normal tracking-[-0.16px] text-text md:block">
          <CartLineUnitPrice line={line} />
        </div>
        <div className="col-start-2 row-start-2 flex w-fit items-center gap-2 md:contents">
          <div className="md:col-start-3 md:row-start-1">
            <CartLineQuantity line={line} layout={layout} />
          </div>
          <CartLineRemoveButton
            lineId={id}
            className="shrink-0 md:col-start-5 md:row-start-1"
          />
        </div>
        <div className="col-start-3 row-start-1 font-semibold md:col-start-4 md:row-start-1">
          <CartLinePrice line={line} />
        </div>
        <CartLineFeedback
          error={removalErrorMessage}
          warning={removalWarningMessage}
          className="col-span-3 md:col-span-5"
        />
      </li>
    );
  }

  return (
    <li
      className="flex gap-4 border-border-subtle border-b py-6"
      hidden={isLineRemoving}
    >
      {merchandise.image && (
        <Link
          to={lineItemUrl}
          prefetch="intent"
          onClick={onClose}
          className="w-1/4 shrink-0 self-stretch overflow-hidden rounded-sm"
        >
          <Image
            alt={merchandise.product.title}
            data={merchandise.image}
            width={250}
            height={250}
            loading="lazy"
            className="size-full object-contain"
          />
        </Link>
      )}
      <div className="flex min-w-0 flex-1 flex-col justify-between gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link prefetch="intent" to={lineItemUrl} onClick={onClose}>
              <p className="line-clamp-1 text-sm font-medium">
                {merchandise.product.title}
              </p>
            </Link>
            {variantSummary && (
              <p className="text-sm text-text-subtle">{variantSummary}</p>
            )}
          </div>
          <CartLineRemoveButton lineId={id} />
        </div>
        <div className="flex items-center justify-between gap-2">
          <CartLineQuantity line={line} layout={layout} />
          <CartLinePrice line={line} />
        </div>
        <CartLineFeedback
          error={removalErrorMessage}
          warning={removalWarningMessage}
        />
      </div>
    </li>
  );
}

function CartLineUnitPrice({ line }: { line: CartLine }) {
  if (!line?.cost?.amountPerQuantity) {
    return null;
  }

  return <Money withoutTrailingZeros data={line.cost.amountPerQuantity} />;
}

function getVariantSummary(
  selectedOptions:
    | Array<{
        name?: string;
        value?: string;
      }>
    | undefined,
) {
  if (!selectedOptions?.length) {
    return null;
  }

  const meaningfulOptions = selectedOptions.filter(
    (option) =>
      option.name !== undefined &&
      option.value !== undefined &&
      !(option.name === "Title" && option.value === "Default Title"),
  );

  if (!meaningfulOptions.length) {
    return null;
  }

  return meaningfulOptions.map((option) => `${option.value}`).join(" / ");
}

function CartLineRemoveButton({
  lineId,
  className,
}: {
  lineId: CartLine["id"];
  className?: string;
}) {
  const isPendingRemoval = useCartStore((state) =>
    state.pendingLineRemovals.has(lineId),
  );
  const isPendingUpdate = useCartStore((state) =>
    state.pendingLineUpdates.has(lineId),
  );
  const isUpdateInFlight = useCartStore((state) =>
    state.lineUpdatesInFlight.has(lineId),
  );
  const isOptimistic = isPendingRemoval || isPendingUpdate || isUpdateInFlight;

  return (
    <button
      type="button"
      className={cn(
        "flex size-8 shrink-0 items-center justify-center",
        className,
      )}
      aria-label="Remove"
      onClick={() => {
        if (!isOptimistic) {
          useCartStore.getState().stageLineRemoval(lineId);
        }
      }}
      disabled={isOptimistic}
    >
      <IconRemove className="size-4.5" />
    </button>
  );
}

function CartLineQuantity({
  line,
  layout,
}: {
  line: CartLine;
  layout: CartLayout;
}) {
  const { id: lineId, isOptimistic } = line;
  const quantity = line.quantity;
  const pendingQuantity = useCartStore((state) =>
    state.pendingLineUpdates.get(lineId),
  );
  const inFlightQuantity = useCartStore((state) =>
    state.lineUpdatesInFlight.get(lineId),
  );
  const isLineRemoving = useCartStore((state) =>
    state.pendingLineRemovals.has(lineId),
  );
  const updateError = useCartStore((state) =>
    state.lineUpdateErrors.get(lineId),
  );
  const updateWarning = useCartStore((state) =>
    state.lineUpdateWarnings.get(lineId),
  );
  const errorMessage = getCartMutationError(updateError);
  const warningMessage = getCartMutationWarning(updateWarning);

  if (typeof quantity === "undefined") {
    return null;
  }

  const optimisticQuantity = pendingQuantity ?? inFlightQuantity ?? quantity;
  const prevQuantity = Number(Math.max(1, optimisticQuantity - 1).toFixed(0));
  const nextQuantity = Number((optimisticQuantity + 1).toFixed(0));
  const isQuantityUpdating = Boolean(
    pendingQuantity || inFlightQuantity || isLineRemoving,
  );

  function updateQuantity(targetQuantity: number) {
    if (isOptimistic || isQuantityUpdating || targetQuantity <= 0) {
      return;
    }
    useCartStore.getState().stageLineUpdate(lineId, targetQuantity);
  }

  return (
    <div className="flex flex-col items-start gap-2">
      <fieldset
        aria-label={`Quantity, ${optimisticQuantity}`}
        className={cn(
          "flex h-8 w-fit items-center border border-border-subtle",
          layout === "page" ? "rounded-[2px]" : "rounded-full",
        )}
      >
        <button
          type="button"
          className="flex size-8 items-center justify-center disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Decrease quantity"
          disabled={
            optimisticQuantity <= 1 || isOptimistic || isQuantityUpdating
          }
          name="decrease-quantity"
          value={prevQuantity}
          onClick={() => updateQuantity(prevQuantity)}
        >
          <span>&#8722;</span>
        </button>
        <div className="min-w-6 text-center text-sm" data-test="item-quantity">
          {optimisticQuantity}
        </div>
        <button
          type="button"
          className="flex size-8 items-center justify-center disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Increase quantity"
          disabled={isOptimistic || isQuantityUpdating}
          name="increase-quantity"
          value={nextQuantity}
          onClick={() => updateQuantity(nextQuantity)}
        >
          <span>&#43;</span>
        </button>
      </fieldset>
      {errorMessage && (
        <p
          role="alert"
          className="flex items-center gap-2 font-body text-base leading-[160%] font-normal tracking-[-0.16px] text-red-600"
        >
          <WarningCircleIcon className="size-5 shrink-0" aria-hidden="true" />
          <span>{errorMessage}</span>
        </p>
      )}
      {warningMessage && (
        <p
          role="status"
          className="font-body text-sm leading-[160%] font-normal text-text-subtle"
        >
          {warningMessage}
        </p>
      )}
    </div>
  );
}

function CartLineFeedback({
  error,
  warning,
  className,
}: {
  error: string | null;
  warning: string | null;
  className?: string;
}) {
  if (!(error || warning)) {
    return null;
  }

  return (
    <div className={cn("space-y-1", className)}>
      {error && (
        <p
          role="alert"
          className="flex items-center gap-2 font-body text-sm leading-[160%] font-normal text-red-600"
        >
          <WarningCircleIcon className="size-5 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </p>
      )}
      {warning && (
        <p
          role="status"
          className="font-body text-sm leading-[160%] font-normal text-text-subtle"
        >
          {warning}
        </p>
      )}
    </div>
  );
}

function CartLinePrice({ line }: { line: CartLine }) {
  if (line.isOptimistic) {
    return <CircleNotchIcon size={18} className="animate-spin" />;
  }

  if (!line?.cost?.amountPerQuantity || !line?.cost?.totalAmount) {
    return null;
  }

  return (
    <Money
      withoutTrailingZeros
      as="span"
      data={line.cost.totalAmount}
      className="font-body text-base leading-[160%] font-semibold tracking-[-0.16px] text-text"
    />
  );
}

export function CartEmpty({
  visible = true,
  layout = "aside",
  onClose,
}: {
  visible?: boolean;
  layout?: CartLayout;
  onClose?: () => void;
}) {
  return (
    <div hidden={!visible} className={cn(layout === "aside" && "px-0 py-2")}>
      <p className="mb-4">
        Looks like you haven&rsquo;t added anything yet, let&rsquo;s get you
        started!
      </p>
      <Link
        to="/collections"
        onClick={onClose}
        className="text-animation font-medium"
      >
        Continue shopping →
      </Link>
      <CartPopularCollections layout={layout} />
    </div>
  );
}
