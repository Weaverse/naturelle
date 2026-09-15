import { CircleNotchIcon } from "@phosphor-icons/react";
import { Image, Money } from "@shopify/hydrogen";
import { Link } from "~/components/link";
import { cn } from "~/utils/cn";
import { useVariantUrl } from "~/utils/variants";
import { IconRemove } from "../icon";
import { CartPopularCollections } from "./cart-popular-collections";
import { CartSummary } from "./cart-summary";
import type { CartLayout, CartLine, CartWithOptimistic } from "./cart-types";
import { getCartLineRenderKeys } from "./optimistic-cart";
import { useCart, useCartStore } from "./store";

type CartMainProps = {
  layout: CartLayout;
  onClose?: () => void;
};

export function CartMain({ layout, onClose }: CartMainProps) {
  const cart = useCart();
  const linesCount = Boolean(cart?.lines?.nodes?.length || 0);
  const cartHasItems = Boolean(cart) && (cart?.totalQuantity ?? 0) > 0;

  return (
    <div
      className={cn(
        layout === "page" && "cart-main container mt-10",
        layout === "aside" && "relative flex min-h-0 flex-1 flex-col",
      )}
    >
      <CartEmpty
        hidden={cartHasItems || linesCount}
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
  return (
    <div
      className={cn(
        layout === "page" &&
          "grid grid-cols-1 gap-y-6 lg:grid-cols-3 lg:gap-10",
        layout === "aside" && "flex min-h-0 flex-1 flex-col justify-between",
      )}
    >
      <CartLines lines={cart?.lines} layout={layout} onClose={onClose} />
      <CartSummary cart={cart} layout={layout} />
    </div>
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
      className={cn(
        layout === "page" && "lg:col-span-2",
        layout === "aside" && "min-h-0 flex-1 overflow-y-auto",
      )}
    >
      <ul
        className={cn(
          "grid border-border-subtle border-t",
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

  return (
    <li
      className="flex gap-4 border-border-subtle border-b py-6"
      style={{ display: isLineRemoving ? "none" : "flex" }}
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
          <CartLineQuantity line={line} />
          <CartLinePrice line={line} />
        </div>
      </div>
    </li>
  );
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

function CartLineRemoveButton({ lineId }: { lineId: CartLine["id"] }) {
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
      className="flex size-8 shrink-0 items-center justify-center"
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

function CartLineQuantity({ line }: { line: CartLine }) {
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
    <fieldset
      aria-label={`Quantity, ${optimisticQuantity}`}
      className="flex h-8 w-fit items-center rounded-full border border-border"
    >
      <button
        type="button"
        className="flex size-8 items-center justify-center disabled:cursor-not-allowed disabled:opacity-50"
        aria-label="Decrease quantity"
        disabled={optimisticQuantity <= 1 || isOptimistic || isQuantityUpdating}
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
      className="font-heading"
    />
  );
}

export function CartEmpty({
  hidden = false,
  layout = "aside",
  onClose,
}: {
  hidden: boolean;
  layout?: CartLayout;
  onClose?: () => void;
}) {
  return (
    <div hidden={hidden} className={cn(layout === "aside" && "px-0 py-2")}>
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
