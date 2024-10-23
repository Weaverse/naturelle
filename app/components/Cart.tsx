import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { cn } from "@/lib/utils";
import { Link } from "@remix-run/react";
import { CartForm, Image, Money } from "@shopify/hydrogen";
import type { CartLineUpdateInput } from "@shopify/hydrogen/storefront-api-types";
import clsx from "clsx";
import type { CartApiQueryFragment } from "storefrontapi.generated";
import { useVariantUrl } from "~/lib/variants";
import { IconRemove } from "./Icon";

type CartLine = CartApiQueryFragment["lines"]["nodes"][0];

type CartMainProps = {
  cart: CartApiQueryFragment | null;
  layout: "page" | "aside";
};

export function CartMain({ layout, cart }: CartMainProps) {
  const linesCount = Boolean(cart?.lines?.nodes?.length || 0);
  const withDiscount =
    cart &&
    Boolean(cart.discountCodes.filter((code) => code.applicable).length);
  const styles = {
    page: "cart-main container mt-10",
    aside: "cart-main px-6 relative",
  };
  return (
    <div className={styles[layout]}>
      <CartEmpty hidden={linesCount} layout={layout} />
      <CartDetails cart={cart} layout={layout} />
    </div>
  );
}

function CartDetails({ layout, cart }: CartMainProps) {
  const cartHasItems = !!cart && cart.totalQuantity > 0;
  let styles = {
    page: "cart-details grid gap-y-6 lg:gap-10 grid-cols-1 lg:grid-cols-3",
    aside:
      "cart-details flex flex-col gap-6 relative justify-between h-screen-in-drawer",
  };
  if (!cart) return null;
  return (
    <div className={styles[layout]}>
      <CartLines lines={cart?.lines} layout={layout} />
      <CartCheckout cartHasItems={cartHasItems} cart={cart} layout={layout} />
    </div>
  );
}

function CartLines({
  lines,
  layout,
}: {
  layout: CartMainProps["layout"];
  lines: CartApiQueryFragment["lines"] | undefined;
}) {
  if (!lines) return null;
  const styles = {
    page: "col-span-2",
    aside: "flex-1 overflow-y-auto overflow-hidden custom-scroll",
  };
  return (
    <div aria-labelledby="cart-lines" className={styles[layout]}>
      <table className="table-auto w-full">
        {layout === "page" && (
          <thead>
            <tr className="p-2">
              <th className="font-medium p-4 text-left border-bar/15 border-b border-bar">
                Product
              </th>
              <th className="font-medium p-4 border-b border-bar/15 hidden md:table-cell"></th>
              <th className="font-medium p-4 border-b border-bar/15 hidden md:table-cell">
                Price
              </th>
              <th className="font-medium p-4 border-b border-bar/15 hidden md:table-cell">
                Quantity
              </th>
              <th className="font-medium p-4 border-b border-bar/15 hidden md:table-cell">
                Total
              </th>
              <th className="font-medium p-4 border-b border-bar/15 hidden md:table-cell"></th>
            </tr>
          </thead>
        )}
        <tbody>
          {lines?.nodes?.map((line) => (
            <CartLineItem key={line.id} line={line} layout={layout} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CartLineItem({
  layout,
  line,
}: {
  layout: CartMainProps["layout"];
  line: CartLine;
}) {
  const { id, merchandise } = line;
  const { product, title, image, selectedOptions } = merchandise;
  const lineItemUrl = useVariantUrl(product.handle, selectedOptions);
  let styles = {
    page: "grid md:table-row gap-2 grid-rows-2 grid-cols-[100px_1fr_64px]",
    aside: "grid gap-3 grid-rows-[1fr_auto] grid-cols-[100px_1fr] pb-4",
  };

  const cellStyles = {
    page: "py-2 md:p-4",
    aside: "",
  };
  let cellClass = cellStyles[layout];

  return (
    <tr key={id} className={styles[layout]}>
      <td className="row-start-1 row-end-3">
        {image && (
          <Image
            alt={title}
            aspectRatio="3/4"
            data={image}
            height={100}
            loading="lazy"
            width={100}
            className="object-cover"
          />
        )}
      </td>
      <td className={cellClass}>
        <div className=" flex gap-1 justify-between">
          <Link
            prefetch="intent"
            to={lineItemUrl}
            onClick={() => {
              if (layout === "aside") {
                // close the drawer
                window.location.href = lineItemUrl;
              }
            }}
          >
            <p className="line-clamp-1">{product.title}</p>
          </Link>
          <div className={layout === "page" ? "md:hidden" : ""}>
            <CartLineRemoveButton lineIds={[line.id]} />
          </div>
        </div>
        <ul className="mt-4 space-y-1">
          {selectedOptions.map((option) => (
            <li key={option.name}>
              <span className="text-foreground-subtle">{option.value}</span>
            </li>
          ))}
        </ul>
      </td>
      {layout === "page" && (
        <td className={cn(cellClass, "text-center")}>
          <Money withoutTrailingZeros data={line.cost.amountPerQuantity} />
        </td>
      )}
      <td className={cn(cellClass, "row-start-2")}>
        <div className="flex items-center justify-between gap-2">
          <CartLineQuantity line={line} />
          {layout === "aside" && (
            <p className="text-center">
              <Money withoutTrailingZeros data={line.cost.amountPerQuantity} />
            </p>
          )}
        </div>
      </td>
      {layout === "page" && (
        <>
          <td className="py-2 md:p-4 text-center col-start-3 hidden md:table-cell font-semibold">
            <CartLinePrice line={line} as="span" />
          </td>
          <td className="py-2 md:p-4 text-center md:table-cell hidden">
            <CartLineRemoveButton lineIds={[line.id]} />
          </td>
        </>
      )}
    </tr>
  );
}

function CartCheckout({
  cartHasItems,
  cart,
  layout,
}: {
  cartHasItems: boolean;
  cart: CartApiQueryFragment;
  layout: CartMainProps["layout"];
}) {
  let styles = {
    page: "grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-1 border-bar-subtle md:border-t md:pt-6 lg:p-0 lg:border-none",
    aside: "pb-6 pt-4 shrink-0",
  };
  let isDrawer = layout === "aside";
  return (
    <div className={styles[layout]}>
      {cartHasItems && (
        <CartSummary cost={cart.cost} layout={layout}>
          <CartDiscounts discountCodes={cart.discountCodes} />
          <CartCheckoutActions checkoutUrl={cart.checkoutUrl} />
        </CartSummary>
      )}
      {!isDrawer && (
        <div className="text-center px-6 py-4 space-y-4 md:order-first lg:order-last">
          <p>We accept</p>
          <div className="flex gap-5 items-center justify-center">
            <Image
              data={{
                url: "https://cdn.shopify.com/s/files/1/0838/0052/3057/files/logos_visa.svg?v=1708336750",
                altText: "Visa",
              }}
              width={32}
              sizes="auto"
            />
            <Image
              data={{
                url: "https://cdn.shopify.com/s/files/1/0838/0052/3057/files/logos_mastercard.svg?v=1708336923",
                altText: "Mastercard",
              }}
              width={32}
              sizes="auto"
            />
            <Image
              data={{
                url: "https://cdn.shopify.com/s/files/1/0838/0052/3057/files/simple-icons_applepay.svg?v=1708336923",
                altText: "Apple Pay",
              }}
              width={32}
              sizes="auto"
            />
            <Image
              data={{
                url: "https://cdn.shopify.com/s/files/1/0838/0052/3057/files/logos_amex.svg?v=1708336923",
                altText: "Amex",
              }}
              width={32}
              sizes="auto"
            />
            <Image
              data={{
                url: "https://cdn.shopify.com/s/files/1/0838/0052/3057/files/logos_paypal.svg?v=1708336923",
                altText: "Paypal",
              }}
              width={32}
              sizes="auto"
            />
          </div>
        </div>
      )}
    </div>
  );
}

function CartCheckoutActions({ checkoutUrl }: { checkoutUrl: string }) {
  if (!checkoutUrl) return null;

  return (
    <div>
      <a href={checkoutUrl} target="_self">
        <Button className="w-full">Continue to Checkout</Button>
      </a>
      <br />
    </div>
  );
}

export function CartSummary({
  cost,
  layout,
  children = null,
}: {
  children?: React.ReactNode;
  cost: CartApiQueryFragment["cost"];
  layout: CartMainProps["layout"];
}) {
  const styles = {
    page: "bg-white p-6 space-y-6",
    aside: "space-y-6 border-t border-bar-subtle pt-4",
  };
  const totalStyles = {
    page: "text-2xl font-heading",
    aside: "font-semibold",
  };
  return (
    <div aria-labelledby="cart-summary" className={styles[layout]}>
      <div
        className={clsx(
          "flex items-center justify-between font-medium",
          totalStyles[layout]
        )}
      >
        <span className="font-semibold">Subtotal</span>
        <div className={layout === "page" ? "text-3xl" : ""}>
          {cost?.subtotalAmount?.amount ? (
            <Money data={cost?.subtotalAmount} />
          ) : (
            "-"
          )}
        </div>
      </div>
      {/* <p className="text-sm">Shipping & taxes calculated at checkout</p> */}
      {/* <p className="underline">Add delivery note</p> */}
      {children}
    </div>
  );
}

function CartLineRemoveButton({ lineIds }: { lineIds: string[] }) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.LinesRemove}
      inputs={{ lineIds }}
    >
      <button type="submit">
        <IconRemove />
      </button>
    </CartForm>
  );
}

function CartLineQuantity({ line }: { line: CartLine }) {
  if (!line || typeof line?.quantity === "undefined") return null;
  const { id: lineId, quantity } = line;
  const prevQuantity = Number(Math.max(0, quantity - 1).toFixed(0));
  const nextQuantity = Number((quantity + 1).toFixed(0));

  return (
    <div className="flex items-center border border-bar-subtle rounded w-fit">
      <CartLineUpdateButton lines={[{ id: lineId, quantity: prevQuantity }]}>
        <button
          className="w-10 h-10 transition "
          aria-label="Decrease quantity"
          disabled={quantity <= 1}
          name="decrease-quantity"
          value={prevQuantity}
        >
          <span>&#8722; </span>
        </button>
      </CartLineUpdateButton>
      <div className="px-2 w-8 text-center">{quantity}</div>
      <CartLineUpdateButton lines={[{ id: lineId, quantity: nextQuantity }]}>
        <button
          className="w-10 h-10 transition "
          aria-label="Increase quantity"
          name="increase-quantity"
          value={nextQuantity}
        >
          <span>&#43;</span>
        </button>
      </CartLineUpdateButton>
    </div>
  );
}

function CartLinePrice({
  line,
  priceType = "regular",
  ...passthroughProps
}: {
  line: CartLine;
  priceType?: "regular" | "compareAt";
  [key: string]: any;
}) {
  if (!line?.cost?.amountPerQuantity || !line?.cost?.totalAmount) return null;

  const moneyV2 =
    priceType === "regular"
      ? line.cost.totalAmount
      : line.cost.compareAtAmountPerQuantity;

  if (moneyV2 == null) {
    return null;
  }

  return (
    <div>
      <Money withoutTrailingZeros {...passthroughProps} data={moneyV2} />
    </div>
  );
}

export function CartEmpty({
  hidden = false,
  layout = "aside",
}: {
  hidden: boolean;
  layout?: CartMainProps["layout"];
}) {
  return (
    <div hidden={hidden}>
      <br />
      <p>
        Looks like you haven&rsquo;t added anything yet, let&rsquo;s get you
        started!
      </p>
      <br />
      <Link
        to="/collections"
        onClick={() => {
          if (layout === "aside") {
            window.location.href = "/collections";
          }
        }}
      >
        Continue shopping →
      </Link>
    </div>
  );
}

function CartDiscounts({
  discountCodes,
}: {
  discountCodes: CartApiQueryFragment["discountCodes"];
}) {
  const codes: string[] =
    discountCodes
      ?.filter((discount) => discount.applicable)
      ?.map(({ code }) => code) || [];

  return (
    <div>
      {/* Have existing discount, display it with a remove option */}
      <dl hidden={!codes.length}>
        <div>
          <dt>Discount(s)</dt>
          <UpdateDiscountForm>
            <div className="cart-discount">
              <code>{codes?.join(", ")}</code>
              &nbsp;
              <button>Remove</button>
            </div>
          </UpdateDiscountForm>
        </div>
      </dl>

      {/* Show an input to apply a discount */}
      <UpdateDiscountForm discountCodes={codes}>
        <div className="flex gap-2">
          <Input type="text" name="discountCode" placeholder="Promotion code" />
          <Button type="submit" variant="link">
            Apply
          </Button>
        </div>
      </UpdateDiscountForm>
    </div>
  );
}

function UpdateDiscountForm({
  discountCodes,
  children,
}: {
  discountCodes?: string[];
  children: React.ReactNode;
}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.DiscountCodesUpdate}
      inputs={{
        discountCodes: discountCodes || [],
      }}
    >
      {children}
    </CartForm>
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
      inputs={{ lines }}
    >
      {children}
    </CartForm>
  );
}
