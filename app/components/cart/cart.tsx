import {
  CartForm,
  Image,
  Money,
  type OptimisticCart,
  OptimisticInput,
  useOptimisticCart,
  useOptimisticData,
} from "@shopify/hydrogen";
import type { CartLineUpdateInput } from "@shopify/hydrogen/storefront-api-types";
import type { CartApiQueryFragment } from "storefront-api.generated";
import { Link } from "~/components/link";
import { cn } from "~/utils/cn";
import { useVariantUrl } from "~/utils/variants";
import { IconRemove } from "../icon";
import { CartPopularCollections } from "./cart-popular-collections";
import { CartSummary } from "./cart-summary";

type CartLine = OptimisticCart<CartApiQueryFragment>["lines"]["nodes"][0];
type CartLayout = "page" | "aside";

type CartMainProps = {
  cart: CartApiQueryFragment;
  layout: CartLayout;
  onClose?: () => void;
};

type OptimisticData = {
  action?: string;
  quantity?: number;
};

export function CartMain({ layout, cart, onClose }: CartMainProps) {
  const optimisticCart = useOptimisticCart<CartApiQueryFragment>(cart);
  const linesCount = Boolean(optimisticCart?.lines?.nodes?.length || 0);
  const cartHasItems =
    Boolean(optimisticCart) && optimisticCart.totalQuantity > 0;

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
      {cartHasItems && (
        <CartDetails cart={optimisticCart} layout={layout} onClose={onClose} />
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
  cart: OptimisticCart<CartApiQueryFragment>;
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
  lines: CartApiQueryFragment["lines"] | undefined;
  onClose?: () => void;
}) {
  if (!lines) {
    return null;
  }

  return (
    <section
      aria-labelledby="cart-lines"
      className={cn(
        layout === "page" && "lg:col-span-2",
        layout === "aside" && "min-h-0 flex-1 overflow-y-auto",
      )}
    >
      <ul className={cn("grid", layout === "aside" && "pb-4")}>
        {lines.nodes.map((line) => (
          <CartLineItem
            key={line.id}
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
  layout,
  line,
  onClose,
}: {
  layout: CartLayout;
  line: CartLine;
  onClose?: () => void;
}) {
  const optimisticData = useOptimisticData<OptimisticData>(line?.id);
  const { id, merchandise } = line;
  const { product, title, image, selectedOptions } = merchandise;
  const lineItemUrl = useVariantUrl(product.handle, selectedOptions);
  const isDefaultVariant =
    selectedOptions?.length === 1 &&
    selectedOptions[0].name === "Title" &&
    selectedOptions[0].value === "Default Title";

  return (
    <li
      className="flex gap-4 border-border-subtle py-6 not-last:border-b first:pt-0"
      style={{
        display: optimisticData?.action === "remove" ? "none" : "flex",
      }}
    >
      {image && (
        <Link
          to={lineItemUrl}
          prefetch="intent"
          onClick={onClose}
          className={cn(
            "shrink-0 overflow-hidden rounded-sm",
            layout === "aside" ? "size-[72px]" : "size-[100px]",
          )}
        >
          <Image
            alt={title}
            aspectRatio="1/1"
            data={image}
            height={144}
            loading="lazy"
            width={144}
            className="size-full object-cover"
          />
        </Link>
      )}
      <div className="flex min-w-0 flex-1 flex-col justify-between gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link prefetch="intent" to={lineItemUrl} onClick={onClose}>
              <p className="line-clamp-1 text-sm font-medium">
                {product.title}
              </p>
            </Link>
            {!isDefaultVariant && (
              <p className="text-sm text-text-subtle">{title}</p>
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

function CartLineRemoveButton({ lineId }: { lineId: CartLine["id"] }) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.LinesRemove}
      inputs={{ lineIds: [lineId] }}
      fetcherKey="cart-line-remove"
    >
      <button
        type="submit"
        className="flex size-8 shrink-0 items-center justify-center"
        aria-label="Remove"
      >
        <IconRemove className="size-4.5" />
      </button>
      <OptimisticInput id={lineId} data={{ action: "remove" }} />
    </CartForm>
  );
}

function CartLineQuantity({ line }: { line: CartLine }) {
  const optimisticId = line?.id;
  const optimisticData = useOptimisticData<OptimisticData>(optimisticId);

  if (!line || typeof line?.quantity === "undefined") {
    return null;
  }

  const optimisticQuantity = optimisticData?.quantity || line.quantity;
  const { id: lineId, isOptimistic } = line;
  const prevQuantity = Number(Math.max(1, optimisticQuantity - 1).toFixed(0));
  const nextQuantity = Number((optimisticQuantity + 1).toFixed(0));

  return (
    <>
      <label htmlFor={`quantity-${lineId}`} className="sr-only">
        Quantity, {optimisticQuantity}
      </label>
      <div className="flex h-8 w-fit items-center rounded-full border border-border">
        <CartLineUpdateButton lines={[{ id: lineId, quantity: prevQuantity }]}>
          <button
            type="submit"
            className="flex size-8 items-center justify-center disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Decrease quantity"
            disabled={optimisticQuantity <= 1 || isOptimistic}
            name="decrease-quantity"
            value={prevQuantity}
          >
            <span>&#8722;</span>
            <OptimisticInput
              id={optimisticId}
              data={{ quantity: prevQuantity }}
            />
          </button>
        </CartLineUpdateButton>
        <div className="min-w-6 text-center text-sm" data-test="item-quantity">
          {optimisticQuantity}
        </div>
        <CartLineUpdateButton lines={[{ id: lineId, quantity: nextQuantity }]}>
          <button
            type="submit"
            className="flex size-8 items-center justify-center disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Increase quantity"
            disabled={isOptimistic}
            name="increase-quantity"
            value={nextQuantity}
          >
            <span>&#43;</span>
            <OptimisticInput
              id={optimisticId}
              data={{ quantity: nextQuantity }}
            />
          </button>
        </CartLineUpdateButton>
      </div>
    </>
  );
}

function CartLinePrice({ line }: { line: CartLine }) {
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

function CartLineUpdateButton({
  children,
  lines,
}: {
  children: React.ReactNode;
  lines: CartLineUpdateInput[];
}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.LinesUpdate}
      fetcherKey={lines[0]?.id}
      inputs={{ lines }}
    >
      {children}
    </CartForm>
  );
}
