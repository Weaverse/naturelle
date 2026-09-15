import { CircleNotchIcon, XIcon } from "@phosphor-icons/react";
import * as Dialog from "@radix-ui/react-dialog";
import { CartForm, Money } from "@shopify/hydrogen";
import { useThemeSettings } from "@weaverse/hydrogen";
import { useState } from "react";
import { useFetcher } from "react-router";
import { buttonVariants } from "~/components/button";
import { Skeleton } from "~/components/skeleton";
import { cn } from "~/utils/cn";
import { usePrefixPathWithLocale } from "~/utils/locale";
import {
  DiscountDialog,
  GiftCardDialog,
  NoteDialog,
} from "./cart-summary-actions";
import type { CartLayout, CartWithOptimistic } from "./cart-types";
import { useCartStore } from "./store";

export function CartSummary({
  cart,
  layout,
}: {
  cart: CartWithOptimistic;
  layout: CartLayout;
}) {
  const {
    enableCartNote,
    cartNoteButtonText,
    enableDiscountCode,
    discountCodeButtonText,
    enableGiftCard,
    giftCardButtonText,
  } = useThemeSettings();
  const [removingDiscountCode, setRemovingDiscountCode] = useState<
    string | null
  >(null);
  const [removingGiftCard, setRemovingGiftCard] = useState<string | null>(null);
  const dcRemoveFetcher = useFetcher({ key: "discount-code-remove" });
  const gcRemoveFetcher = useFetcher({ key: "gift-card-remove" });
  const cartRoute = usePrefixPathWithLocale("/cart");
  const pendingLineUpdates = useCartStore((state) => state.pendingLineUpdates);
  const lineUpdatesInFlight = useCartStore(
    (state) => state.lineUpdatesInFlight,
  );
  const pendingLineRemovals = useCartStore(
    (state) => state.pendingLineRemovals,
  );
  const {
    cost,
    discountCodes,
    isOptimistic,
    checkoutUrl,
    appliedGiftCards,
    note,
  } = cart;
  const isCartUpdating =
    isOptimistic ||
    dcRemoveFetcher.state !== "idle" ||
    gcRemoveFetcher.state !== "idle" ||
    pendingLineUpdates.size > 0 ||
    lineUpdatesInFlight.size > 0 ||
    pendingLineRemovals.size > 0;
  const subtotal = Number(cost?.subtotalAmount?.amount || 0);
  const total = Number(cost?.totalAmount?.amount || 0);
  const hasDiscount = subtotal > total && total > 0;
  const applicableCodes =
    discountCodes?.filter((discount) => discount.applicable) || [];

  return (
    <section
      aria-labelledby="cart-summary"
      className={cn(
        layout === "aside" &&
          "shrink-0 border-t border-border-subtle pt-4 pb-5",
        layout === "page" && "space-y-4 bg-white p-6",
      )}
    >
      <h2 id="cart-summary" className="sr-only">
        Order summary
      </h2>

      {(appliedGiftCards?.length > 0 || applicableCodes.length > 0) && (
        <div className="mb-4 flex flex-wrap justify-end gap-2">
          {appliedGiftCards?.map((giftCard) => {
            const isGCRemoving =
              gcRemoveFetcher.state !== "idle" &&
              removingGiftCard === giftCard.lastCharacters;
            return (
              <div
                key={giftCard.id}
                className="flex items-center gap-1 rounded-full bg-background-subtle-1 px-2 py-0.5 text-xs [&>form]:flex"
              >
                <span>***{giftCard.lastCharacters}</span>
                <CartForm
                  route={cartRoute}
                  action={CartForm.ACTIONS.GiftCardCodesRemove}
                  inputs={{ giftCardCodes: [giftCard.id] }}
                  fetcherKey="gift-card-remove"
                >
                  <button
                    type="submit"
                    className="flex size-4 items-center justify-center"
                    aria-label={`Remove gift card ***${giftCard.lastCharacters}`}
                    onClick={() => setRemovingGiftCard(giftCard.lastCharacters)}
                  >
                    {isGCRemoving ? (
                      <CircleNotchIcon size={12} className="animate-spin" />
                    ) : (
                      <XIcon size={12} />
                    )}
                  </button>
                </CartForm>
              </div>
            );
          })}
          {applicableCodes.map((discount) => {
            const updatedCodes = applicableCodes
              .map((d) => d.code)
              .filter((c) => c !== discount.code);
            const isDCRemoving =
              dcRemoveFetcher.state !== "idle" &&
              removingDiscountCode === discount.code;
            return (
              <div
                key={discount.code}
                className="flex items-center gap-1 rounded-full bg-background-subtle-1 px-2 py-0.5 text-xs [&>form]:flex"
              >
                <span>{discount.code}</span>
                <CartForm
                  route={cartRoute}
                  action={CartForm.ACTIONS.DiscountCodesUpdate}
                  inputs={{ discountCodes: updatedCodes }}
                  fetcherKey="discount-code-remove"
                >
                  <button
                    type="submit"
                    className="flex size-4 items-center justify-center"
                    aria-label={`Remove discount code ${discount.code}`}
                    onClick={() => setRemovingDiscountCode(discount.code)}
                  >
                    {isDCRemoving ? (
                      <CircleNotchIcon size={12} className="animate-spin" />
                    ) : (
                      <XIcon size={12} />
                    )}
                  </button>
                </CartForm>
              </div>
            );
          })}
        </div>
      )}

      <div className="flex items-center justify-between">
        <span className="font-semibold">Subtotal</span>
        {isCartUpdating ? (
          <Skeleton className="h-4 w-20 rounded" />
        ) : (
          <div className="flex items-center gap-2">
            {hasDiscount && (
              <span className="text-sm text-text-subtle line-through">
                <Money data={cost.subtotalAmount} />
              </span>
            )}
            <span className="font-semibold">
              {cost?.totalAmount?.amount ? (
                <Money data={cost.totalAmount} />
              ) : (
                "-"
              )}
            </span>
          </div>
        )}
      </div>

      <p className="mt-1 text-sm text-text-subtle">
        Shipping and taxes will be calculated at checkout.
      </p>

      {(enableCartNote || enableDiscountCode || enableGiftCard) && (
        <div className="mt-3 flex flex-wrap items-center justify-center gap-x-1 text-sm">
          {enableCartNote && (
            <Dialog.Root>
              <Dialog.Trigger asChild>
                <button
                  type="button"
                  className="cursor-pointer underline underline-offset-2"
                >
                  {cartNoteButtonText || "Add a note"}
                </button>
              </Dialog.Trigger>
              <NoteDialog cartNote={note} layout={layout} />
            </Dialog.Root>
          )}
          {enableCartNote && (enableDiscountCode || enableGiftCard) && (
            <span className="text-text-subtle">/</span>
          )}
          {enableDiscountCode && (
            <Dialog.Root>
              <Dialog.Trigger asChild>
                <button
                  type="button"
                  className="cursor-pointer underline underline-offset-2"
                >
                  {discountCodeButtonText || "Discount code"}
                </button>
              </Dialog.Trigger>
              <DiscountDialog discountCodes={discountCodes} layout={layout} />
            </Dialog.Root>
          )}
          {enableDiscountCode && enableGiftCard && (
            <span className="text-text-subtle">/</span>
          )}
          {enableGiftCard && (
            <Dialog.Root>
              <Dialog.Trigger asChild>
                <button
                  type="button"
                  className="cursor-pointer underline underline-offset-2"
                >
                  {giftCardButtonText || "Giftcard"}
                </button>
              </Dialog.Trigger>
              <GiftCardDialog
                appliedGiftCards={appliedGiftCards}
                layout={layout}
              />
            </Dialog.Root>
          )}
        </div>
      )}

      {checkoutUrl && (
        <a
          href={isCartUpdating ? undefined : checkoutUrl}
          target="_self"
          className={buttonVariants({
            shape: "default",
            className: cn(
              "mt-4 w-full rounded-lg",
              isCartUpdating && "pointer-events-none opacity-50",
            ),
          })}
          aria-disabled={isCartUpdating || undefined}
          aria-busy={isCartUpdating || undefined}
        >
          Continue to Checkout
        </a>
      )}
    </section>
  );
}
