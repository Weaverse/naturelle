import { CircleNotchIcon, XIcon } from "@phosphor-icons/react";
import * as Dialog from "@radix-ui/react-dialog";
import {
  AnalyticsEvent,
  CartForm,
  Money,
  useAnalytics,
} from "@shopify/hydrogen";
import { useThemeSettings, useTranslation } from "@weaverse/hydrogen";
import { type SyntheticEvent, useState } from "react";
import { useFetcher } from "react-router";
import { buttonVariants } from "~/components/button";
import { Link } from "~/components/link";
import { Skeleton } from "~/components/skeleton";
import { cn } from "~/utils/cn";
import { usePrefixPathWithLocale } from "~/utils/locale";
import {
  CartActionBanner,
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
  if (layout === "page") {
    return <CartPageSummary cart={cart} />;
  }

  return <CartAsideSummary cart={cart} />;
}

function useCartActionSettings() {
  const {
    enableCartNote,
    cartNoteButtonText,
    enableDiscountCode,
    discountCodeButtonText,
    enableGiftCard,
    giftCardButtonText,
  } = useThemeSettings();

  return {
    enableCartNote,
    cartNoteButtonText,
    enableDiscountCode,
    discountCodeButtonText,
    enableGiftCard,
    giftCardButtonText,
  };
}

function useAppliedCodeControls() {
  const [removingDiscountCode, setRemovingDiscountCode] = useState<
    string | null
  >(null);
  const [removingGiftCard, setRemovingGiftCard] = useState<string | null>(null);
  const dcRemoveFetcher = useFetcher({ key: "discount-code-remove" });
  const gcRemoveFetcher = useFetcher({ key: "gift-card-remove" });
  const cartRoute = usePrefixPathWithLocale("/cart");

  return {
    removingDiscountCode,
    setRemovingDiscountCode,
    removingGiftCard,
    setRemovingGiftCard,
    dcRemoveFetcher,
    gcRemoveFetcher,
    cartRoute,
  };
}

function useCartPendingLines() {
  const pendingLineUpdates = useCartStore((state) => state.pendingLineUpdates);
  const lineUpdatesInFlight = useCartStore(
    (state) => state.lineUpdatesInFlight,
  );
  const pendingLineRemovals = useCartStore(
    (state) => state.pendingLineRemovals,
  );

  return (
    pendingLineUpdates.size > 0 ||
    lineUpdatesInFlight.size > 0 ||
    pendingLineRemovals.size > 0
  );
}

function getApplicableCodes(
  discountCodes: CartWithOptimistic["discountCodes"],
) {
  return discountCodes?.filter((discount) => discount.applicable) || [];
}

function CartPageSummary({ cart }: { cart: CartWithOptimistic }) {
  const { t } = useTranslation();
  const {
    enableCartNote,
    cartNoteButtonText,
    enableDiscountCode,
    discountCodeButtonText,
    enableGiftCard,
    giftCardButtonText,
  } = useCartActionSettings();
  const [discountCode, setDiscountCode] = useState("");
  const [submittedDiscountCode, setSubmittedDiscountCode] = useState<
    string | null
  >(null);
  const dcApplyFetcher = useFetcher({ key: "discount-code-apply" });
  const {
    removingDiscountCode,
    setRemovingDiscountCode,
    removingGiftCard,
    setRemovingGiftCard,
    dcRemoveFetcher,
    gcRemoveFetcher,
    cartRoute,
  } = useAppliedCodeControls();
  const hasPendingLines = useCartPendingLines();
  const { publish } = useAnalytics();
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
    dcApplyFetcher.state !== "idle" ||
    gcRemoveFetcher.state !== "idle" ||
    hasPendingLines;
  const applicableCodes = getApplicableCodes(discountCodes);
  const discountSubmissionComplete = Boolean(
    submittedDiscountCode &&
      dcApplyFetcher.state === "idle" &&
      dcApplyFetcher.data,
  );
  const discountApplied = Boolean(
    discountSubmissionComplete &&
      applicableCodes.some(
        ({ code }) =>
          code.toLowerCase() === submittedDiscountCode?.toLowerCase(),
      ),
  );

  function applyDiscountCode(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    const code = discountCode.trim();
    if (!code) {
      return;
    }
    setSubmittedDiscountCode(code);
    dcApplyFetcher.submit(
      {
        [CartForm.INPUT_NAME]: JSON.stringify({
          action: CartForm.ACTIONS.DiscountCodesUpdate,
          inputs: {
            discountCodes: [
              ...(discountCodes?.map(({ code: appliedCode }) => appliedCode) ||
                []),
              code,
            ],
          },
        }),
      },
      { method: "POST", action: cartRoute },
    );
  }

  return (
    <section
      aria-labelledby="cart-summary"
      className="flex w-full flex-col gap-4 rounded-xl bg-background-basic p-5 md:p-6"
    >
      <h2 id="cart-summary" className="sr-only">
        {t("cart.orderSummary")}
      </h2>
      <div className="flex items-center justify-between text-sm">
        <span className="font-body text-base leading-[160%] font-semibold tracking-[-0.16px] text-text">
          {t("cart.subtotal")}
        </span>
        {isCartUpdating ? (
          <Skeleton className="h-4 w-20 rounded" />
        ) : (
          <Money
            data={cost.subtotalAmount}
            className="font-body text-base leading-none font-normal tracking-[-0.16px] text-text"
          />
        )}
      </div>

      <PageDiscountForm
        enabled={enableDiscountCode}
        label={discountCodeButtonText}
        code={discountCode}
        onCodeChange={(value) => {
          setDiscountCode(value);
          setSubmittedDiscountCode(null);
        }}
        onSubmit={applyDiscountCode}
        isSubmitting={dcApplyFetcher.state !== "idle"}
        submissionComplete={discountSubmissionComplete}
        applied={discountApplied}
      />

      {enableGiftCard && (
        <Dialog.Root>
          <Dialog.Trigger asChild>
            <button
              type="button"
              className="self-start font-body text-sm leading-none font-normal tracking-[-0.14px] text-text-subtle underline underline-offset-2"
            >
              {giftCardButtonText || t("cart.giftCard")}
            </button>
          </Dialog.Trigger>
          <GiftCardDialog appliedGiftCards={appliedGiftCards} layout="page" />
        </Dialog.Root>
      )}

      <AppliedCartCodes
        appliedGiftCards={appliedGiftCards}
        discountCodes={discountCodes}
        cartRoute={cartRoute}
        removingGiftCard={removingGiftCard}
        onRemovingGiftCard={setRemovingGiftCard}
        gcRemoveFetcher={gcRemoveFetcher}
        removingDiscountCode={removingDiscountCode}
        onRemovingDiscountCode={(code) => {
          setRemovingDiscountCode(code);
          setSubmittedDiscountCode(null);
        }}
        dcRemoveFetcher={dcRemoveFetcher}
      />

      <div className="flex flex-col gap-4 font-body text-base leading-none font-normal tracking-[-0.16px] text-text">
        <div className="flex justify-between gap-4">
          <span>{t("account.shipping")}</span>
          <span>{t("cart.calculatedAtCheckout")}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span>{t("cart.estimatedTax")}</span>
          <span>
            {cost.totalTaxAmount ? (
              <Money data={cost.totalTaxAmount} />
            ) : (
              t("cart.calculatedAtCheckout")
            )}
          </span>
        </div>
      </div>
      <div
        aria-hidden="true"
        className="h-px w-full bg-text-subtle opacity-20"
      />

      <div className="flex items-center justify-between">
        <span className="font-heading text-[26px] leading-[110%] font-normal text-text">
          {t("cart.total")}
        </span>
        {isCartUpdating ? (
          <Skeleton className="h-6 w-24 rounded" />
        ) : (
          <Money
            data={cost.totalAmount}
            className="font-heading text-[31px] leading-[110%] font-normal text-text"
          />
        )}
      </div>
      <p className="font-body text-sm leading-none font-normal tracking-[-0.14px] text-text-subtle">
        {t("cart.shippingTaxesCheckout")}
      </p>

      {enableCartNote && (
        <Dialog.Root>
          <Dialog.Trigger asChild>
            <button
              type="button"
              className="self-start text-left font-body text-base leading-[160%] font-normal tracking-[-0.16px] text-text-subtle underline decoration-solid [text-decoration-skip-ink:none] [text-decoration-thickness:auto] [text-underline-position:from-font]"
            >
              {cartNoteButtonText || t("cart.noteTitle")}
            </button>
          </Dialog.Trigger>
          <NoteDialog cartNote={note} layout="page" />
        </Dialog.Root>
      )}

      {checkoutUrl && (
        <a
          href={checkoutUrl}
          className={buttonVariants({
            shape: "default",
            className: cn(
              "w-full rounded-xl",
              isCartUpdating && "pointer-events-none opacity-50",
            ),
          })}
          aria-disabled={isCartUpdating || undefined}
          aria-busy={isCartUpdating || undefined}
          tabIndex={isCartUpdating ? -1 : undefined}
          onClick={(event) => {
            if (isCartUpdating) {
              event.preventDefault();
              return;
            }

            publish(AnalyticsEvent.CUSTOM_EVENT, {
              eventName: "checkout_started",
            });
          }}
        >
          {t("cart.checkout")}
        </a>
      )}
      <p className="text-center font-body text-sm leading-none font-normal tracking-[-0.14px] text-text-subtle">
        {t("cart.or")}{" "}
        <Link to="/collections" className="text-text">
          {t("cart.continueShopping")}
        </Link>
      </p>
    </section>
  );
}

function CartAsideSummary({ cart }: { cart: CartWithOptimistic }) {
  const { t } = useTranslation();
  const {
    enableCartNote,
    cartNoteButtonText,
    enableDiscountCode,
    discountCodeButtonText,
    enableGiftCard,
    giftCardButtonText,
  } = useCartActionSettings();
  const {
    removingDiscountCode,
    setRemovingDiscountCode,
    removingGiftCard,
    setRemovingGiftCard,
    dcRemoveFetcher,
    gcRemoveFetcher,
    cartRoute,
  } = useAppliedCodeControls();
  const hasPendingLines = useCartPendingLines();
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
    hasPendingLines;
  const subtotal = Number(cost?.subtotalAmount?.amount || 0);
  const total = Number(cost?.totalAmount?.amount || 0);
  const hasDiscount = subtotal > total && total > 0;
  const { publish } = useAnalytics();

  return (
    <section
      aria-labelledby="cart-summary"
      className="shrink-0 border-border-subtle border-t flex flex-col gap-3 pt-3"
    >
      <h2 id="cart-summary" className="sr-only">
        {t("cart.orderSummary")}
      </h2>

      <AppliedCartCodes
        className="justify-end"
        appliedGiftCards={appliedGiftCards}
        discountCodes={discountCodes}
        cartRoute={cartRoute}
        removingGiftCard={removingGiftCard}
        onRemovingGiftCard={setRemovingGiftCard}
        gcRemoveFetcher={gcRemoveFetcher}
        removingDiscountCode={removingDiscountCode}
        onRemovingDiscountCode={setRemovingDiscountCode}
        dcRemoveFetcher={dcRemoveFetcher}
      />

      <div className="flex items-center justify-between font-body text-base leading-[160%] tracking-[-0.16px] text-text">
        <span className="font-semibold">{t("cart.subtotal")}</span>
        {isCartUpdating ? (
          <Skeleton className="h-4 w-20 rounded" />
        ) : (
          <div className="flex items-center gap-2">
            {hasDiscount && (
              <span className="font-normal text-text-subtle line-through">
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

      <p className="font-body text-sm leading-[160%] font-normal tracking-[-0.14px] text-text-subtle">
        {t("cart.shippingTaxesCheckout")}
      </p>

      {(enableCartNote || enableDiscountCode || enableGiftCard) && (
        <div className="flex flex-wrap items-center justify-end gap-x-2 font-body text-base leading-none font-normal tracking-[-0.16px] text-text">
          {enableCartNote && (
            <Dialog.Root>
              <Dialog.Trigger asChild>
                <button
                  type="button"
                  className="cursor-pointer underline underline-offset-2"
                >
                  {cartNoteButtonText || t("cart.noteTitle")}
                </button>
              </Dialog.Trigger>
              <NoteDialog cartNote={note} layout="aside" />
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
                  {discountCodeButtonText || t("cart.discountCode")}
                </button>
              </Dialog.Trigger>
              <DiscountDialog discountCodes={discountCodes} layout="aside" />
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
                  {giftCardButtonText || t("cart.giftCard")}
                </button>
              </Dialog.Trigger>
              <GiftCardDialog
                appliedGiftCards={appliedGiftCards}
                layout="aside"
              />
            </Dialog.Root>
          )}
        </div>
      )}

      {checkoutUrl && (
        <a
          href={checkoutUrl}
          target="_self"
          className={buttonVariants({
            shape: "default",
            className: cn(
              "h-auto w-full rounded-xl px-6 py-3 font-body text-base leading-[160%] font-semibold tracking-[-0.16px]",
              isCartUpdating && "pointer-events-none opacity-50",
            ),
          })}
          aria-disabled={isCartUpdating || undefined}
          aria-busy={isCartUpdating || undefined}
          tabIndex={isCartUpdating ? -1 : undefined}
          onClick={(event) => {
            if (isCartUpdating) {
              event.preventDefault();
              return;
            }

            publish(AnalyticsEvent.CUSTOM_EVENT, {
              eventName: "checkout_started",
            });
          }}
        >
          {t("cart.continueToCheckout")}
        </a>
      )}
    </section>
  );
}

function AppliedCartCodes({
  className,
  appliedGiftCards,
  discountCodes,
  cartRoute,
  removingGiftCard,
  onRemovingGiftCard,
  gcRemoveFetcher,
  removingDiscountCode,
  onRemovingDiscountCode,
  dcRemoveFetcher,
}: {
  className?: string;
  appliedGiftCards: CartWithOptimistic["appliedGiftCards"];
  discountCodes: CartWithOptimistic["discountCodes"];
  cartRoute: string;
  removingGiftCard: string | null;
  onRemovingGiftCard: (code: string) => void;
  gcRemoveFetcher: { state: string };
  removingDiscountCode: string | null;
  onRemovingDiscountCode: (code: string) => void;
  dcRemoveFetcher: { state: string };
}) {
  const { t } = useTranslation();
  const applicableCodes = getApplicableCodes(discountCodes);

  if (!(appliedGiftCards?.length > 0 || applicableCodes.length > 0)) {
    return null;
  }

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {appliedGiftCards?.map((giftCard) => {
        const isGCRemoving =
          gcRemoveFetcher.state !== "idle" &&
          removingGiftCard === giftCard.lastCharacters;
        return (
          <div
            key={giftCard.id}
            className="flex items-center gap-2 rounded-lg bg-background-subtle-2 px-2 py-1 text-xs leading-none tracking-[0.24px] text-text-subtle [&>form]:flex"
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
                aria-label={t("cart.removeGiftCard", {
                  digits: giftCard.lastCharacters,
                })}
                onClick={() => onRemovingGiftCard(giftCard.lastCharacters)}
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
        const updatedCodes = (discountCodes || [])
          .map((item) => item.code)
          .filter((code) => code !== discount.code);
        const isDCRemoving =
          dcRemoveFetcher.state !== "idle" &&
          removingDiscountCode === discount.code;
        return (
          <div
            key={discount.code}
            className="flex items-center gap-2 rounded-lg bg-background-subtle-2 px-2 py-1 text-xs leading-none tracking-[0.24px] text-text-subtle [&>form]:flex"
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
                aria-label={t("cart.removeDiscountCode", {
                  code: discount.code,
                })}
                onClick={() => onRemovingDiscountCode(discount.code)}
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
  );
}

function PageDiscountForm({
  enabled,
  label,
  code,
  onCodeChange,
  onSubmit,
  isSubmitting,
  submissionComplete,
  applied,
}: {
  enabled?: boolean;
  label?: string;
  code: string;
  onCodeChange: (value: string) => void;
  onSubmit: (event: SyntheticEvent<HTMLFormElement>) => void;
  isSubmitting: boolean;
  submissionComplete: boolean;
  applied: boolean;
}) {
  const { t } = useTranslation();
  if (!enabled) {
    return null;
  }

  return (
    <form className="flex flex-col gap-2" onSubmit={onSubmit}>
      <label
        htmlFor="cart-discount-code"
        className="font-body text-sm leading-none font-normal tracking-[-0.14px] text-text-subtle"
      >
        {label || t("cart.discountCode")}
      </label>
      <div className="flex gap-2">
        <input
          id="cart-discount-code"
          name="discountCode"
          value={code}
          onChange={(event) => onCodeChange(event.target.value)}
          placeholder={t("cart.enterCode")}
          className="min-w-0 flex-1 rounded-xl border border-border bg-background px-3 py-2 font-body text-sm leading-none font-normal tracking-[-0.14px] text-text-subtle outline-none placeholder:text-text-subtle"
        />
        <button
          type="submit"
          disabled={!code.trim() || isSubmitting}
          className="rounded-xl bg-text-primary px-6 py-3 font-body text-base leading-[160%] font-semibold tracking-[-0.16px] text-text-inverse disabled:cursor-not-allowed disabled:opacity-50"
        >
          {t("cart.apply")}
        </button>
      </div>
      {submissionComplete &&
        (applied ? (
          <CartActionBanner variant="success">
            {t("cart.discountApplied")}
          </CartActionBanner>
        ) : (
          <CartActionBanner variant="error">
            {t("cart.invalidDiscount")}
          </CartActionBanner>
        ))}
    </form>
  );
}
