import { XIcon } from "@phosphor-icons/react";
import * as Dialog from "@radix-ui/react-dialog";
import { CartForm } from "@shopify/hydrogen";
import { useTranslation } from "@weaverse/hydrogen";
import { useEffect, useId, useRef, useState } from "react";
import { useFetcher } from "react-router";
import type { CartApiQueryFragment } from "storefront-api.generated";
import { Button } from "~/components/button";
import { getCartMutationError } from "~/utils/cart-error";
import { cn } from "~/utils/cn";
import { usePrefixPathWithLocale } from "~/utils/locale";

type CartLayout = "page" | "aside";

export function CartActionBanner({
  variant,
  children,
}: {
  variant: "success" | "error";
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "w-full px-3 py-2 text-center text-sm",
        variant === "success" && "bg-green-100 text-green-700",
        variant === "error" && "bg-red-100 text-red-700",
      )}
    >
      {children}
    </div>
  );
}

function dialogContentClass(layout: CartLayout) {
  return cn(
    "fixed z-[60] w-full overflow-hidden bg-(--color-drawer-bg) p-6 shadow-xl",
    "data-[state=open]:animate-slide-up data-[state=closed]:animate-slide-down",
    layout === "aside"
      ? "bottom-0 right-0 max-w-[420px] [--slide-down-to:100%] [--slide-up-from:100%]"
      : "top-1/2 left-1/2 max-w-[400px] -translate-x-1/2 -translate-y-1/2 md:max-w-[420px] [--slide-down-to:40px] [--slide-up-from:40px]",
  );
}

export function NoteDialog({
  cartNote: currentNote,
  layout = "aside",
}: {
  cartNote: string;
  layout?: CartLayout;
}) {
  const { t } = useTranslation();
  const [note, setNote] = useState(currentNote);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const fetcher = useFetcher();
  const lastProcessedData = useRef(fetcher.data);
  const noteId = useId();
  const cartRoute = usePrefixPathWithLocale("/cart");

  useEffect(() => {
    if (
      fetcher.state !== "idle" ||
      !fetcher.data ||
      fetcher.data === lastProcessedData.current
    ) {
      return;
    }
    lastProcessedData.current = fetcher.data;
    const error = getCartMutationError(fetcher.data);
    const responseNote = (
      fetcher.data as { cart?: { id?: unknown; note?: unknown } }
    ).cart;
    const responseNoteValue = responseNote?.note;
    if (
      error ||
      typeof responseNote?.id !== "string" ||
      (responseNoteValue !== null && typeof responseNoteValue !== "string")
    ) {
      setSubmitted(false);
      setSubmitError(error || t("cart.noteSaveError"));
      return;
    }
    setNote(typeof responseNoteValue === "string" ? responseNoteValue : "");
    setSubmitted(true);
    setSubmitError(null);
  }, [fetcher.data, fetcher.state, t]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formCartNote = formData.get("cartNote") as string;
    setSubmitted(false);
    setSubmitError(null);
    fetcher.submit(
      {
        [CartForm.INPUT_NAME]: JSON.stringify({
          action: CartForm.ACTIONS.NoteUpdate,
          inputs: { cartNote: formCartNote },
        }),
      },
      { method: "POST", action: cartRoute },
    );
    setNote(formCartNote);
  }

  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-[60] bg-black/50 data-[state=closed]:animate-fade-out data-[state=open]:animate-fade-in" />
      <Dialog.Content
        onCloseAutoFocus={(e) => {
          e.preventDefault();
          setNote(currentNote);
          setSubmitted(false);
          setSubmitError(null);
        }}
        className={dialogContentClass(layout)}
        aria-describedby={undefined}
      >
        <Dialog.Close asChild>
          <button
            type="button"
            className="absolute top-2 right-2 z-10 flex size-8 items-center justify-center"
            aria-label={t("accessibility.close")}
          >
            <XIcon size={16} />
          </button>
        </Dialog.Close>
        <Dialog.Title asChild>
          <p className="mb-4 font-body text-sm font-medium">
            {t("cart.noteTitle")}
          </p>
        </Dialog.Title>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <label htmlFor={noteId} className="sr-only">
            {t("cart.noteTitle")}
          </label>
          <textarea
            id={noteId}
            className="min-h-[92px] w-full resize-none rounded-lg border border-border-subtle p-3"
            placeholder={t("cart.notePlaceholder")}
            rows={3}
            name="cartNote"
            value={note}
            onChange={(e) => {
              setNote(e.target.value);
              setSubmitted(false);
              setSubmitError(null);
            }}
          />
          {submitted && (
            <CartActionBanner variant="success">
              {t("cart.noteSaved")}
            </CartActionBanner>
          )}
          {submitError && (
            <CartActionBanner variant="error">{submitError}</CartActionBanner>
          )}
          <Button
            type="submit"
            loading={fetcher.state !== "idle"}
            disabled={fetcher.state !== "idle"}
            className="w-full rounded-lg"
          >
            {t("cart.addNote")}
          </Button>
        </form>
      </Dialog.Content>
    </Dialog.Portal>
  );
}

export function DiscountDialog({
  discountCodes = [],
  layout = "aside",
}: {
  discountCodes: CartApiQueryFragment["discountCodes"];
  layout?: CartLayout;
}) {
  const { t } = useTranslation();
  const [code, setCode] = useState("");
  const fetcher = useFetcher();
  const discountCodeId = useId();
  const cartRoute = usePrefixPathWithLocale("/cart");
  const submitted = Boolean(code && fetcher.state === "idle" && fetcher.data);
  const success = Boolean(
    submitted && discountCodes?.find((d) => d.code === code && d.applicable),
  );
  const error = submitted && !success;

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const discountCode = formData.get("discountCode") as string;
    if (discountCode) {
      const existingCodes = discountCodes.map((d) => d.code);
      const updatedCodes = [...existingCodes, discountCode];
      fetcher.submit(
        {
          [CartForm.INPUT_NAME]: JSON.stringify({
            action: CartForm.ACTIONS.DiscountCodesUpdate,
            inputs: { discountCodes: updatedCodes },
          }),
        },
        { method: "POST", action: cartRoute },
      );
    }
  }

  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-[60] bg-black/50 data-[state=closed]:animate-fade-out data-[state=open]:animate-fade-in" />
      <Dialog.Content
        onCloseAutoFocus={(e) => {
          e.preventDefault();
          setCode("");
          fetcher.data = null;
        }}
        className={dialogContentClass(layout)}
        aria-describedby={undefined}
      >
        <Dialog.Close asChild>
          <button
            type="button"
            className="absolute top-2 right-2 z-10 flex size-8 items-center justify-center"
            aria-label={t("accessibility.close")}
          >
            <XIcon size={16} />
          </button>
        </Dialog.Close>
        <Dialog.Title asChild>
          <p className="mb-4 font-body text-sm font-medium">
            {t("cart.discountTitle")}
          </p>
        </Dialog.Title>
        <form onSubmit={handleSubmit} className="space-y-4">
          <label htmlFor={discountCodeId} className="sr-only">
            {t("cart.discountCode")}
          </label>
          <input
            id={discountCodeId}
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              fetcher.data = null;
            }}
            className="w-full rounded-lg border border-border-subtle p-3"
            type="text"
            name="discountCode"
            placeholder={t("cart.discountCode")}
            required
          />
          {success && (
            <CartActionBanner variant="success">
              {t("cart.discountApplied")}
            </CartActionBanner>
          )}
          {error && (
            <CartActionBanner variant="error">
              {t("cart.invalidDiscount")}
            </CartActionBanner>
          )}
          <Button
            type="submit"
            className="w-full rounded-lg"
            loading={fetcher.state !== "idle"}
            disabled={fetcher.state !== "idle"}
          >
            {t("cart.apply")}
          </Button>
        </form>
      </Dialog.Content>
    </Dialog.Portal>
  );
}

export function GiftCardDialog({
  appliedGiftCards = [],
  layout = "aside",
}: {
  appliedGiftCards: CartApiQueryFragment["appliedGiftCards"];
  layout?: CartLayout;
}) {
  const { t } = useTranslation();
  const [code, setCode] = useState("");
  const fetcher = useFetcher();
  const giftCardCodeId = useId();
  const cartRoute = usePrefixPathWithLocale("/cart");
  const submitted = Boolean(code && fetcher.state === "idle" && fetcher.data);
  const success = Boolean(
    submitted &&
      appliedGiftCards?.find((gc) =>
        code.toLowerCase().endsWith(gc.lastCharacters),
      ),
  );
  const error = submitted && !success;

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const giftCardCode = String(formData.get("giftCardCode") || "").trim();
    if (giftCardCode) {
      fetcher.submit(
        {
          [CartForm.INPUT_NAME]: JSON.stringify({
            action: CartForm.ACTIONS.GiftCardCodesAdd,
            inputs: {
              giftCardCodes: [giftCardCode],
            },
          }),
        },
        { method: "POST", action: cartRoute },
      );
    }
  }

  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-[60] bg-black/50 data-[state=closed]:animate-fade-out data-[state=open]:animate-fade-in" />
      <Dialog.Content
        onCloseAutoFocus={(e) => {
          e.preventDefault();
          setCode("");
          fetcher.data = null;
        }}
        className={dialogContentClass(layout)}
        aria-describedby={undefined}
      >
        <Dialog.Close asChild>
          <button
            type="button"
            className="absolute top-2 right-2 z-10 flex size-8 items-center justify-center"
            aria-label={t("accessibility.close")}
          >
            <XIcon size={16} />
          </button>
        </Dialog.Close>
        <Dialog.Title asChild>
          <p className="mb-4 font-body text-sm font-medium">
            {t("cart.giftCardTitle")}
          </p>
        </Dialog.Title>
        <form onSubmit={handleSubmit} className="space-y-4">
          <label htmlFor={giftCardCodeId} className="sr-only">
            {t("cart.giftCardCode")}
          </label>
          <input
            id={giftCardCodeId}
            className="w-full rounded-lg border border-border-subtle p-3"
            type="text"
            name="giftCardCode"
            placeholder={t("cart.giftCardCode")}
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              fetcher.data = null;
            }}
            required
          />
          {success && (
            <CartActionBanner variant="success">
              {t("cart.giftCardApplied")}
            </CartActionBanner>
          )}
          {error && (
            <CartActionBanner variant="error">
              {t("cart.invalidGiftCard")}
            </CartActionBanner>
          )}
          <Button
            type="submit"
            className="w-full rounded-lg"
            loading={fetcher.state !== "idle"}
            disabled={fetcher.state !== "idle"}
          >
            {t("cart.apply")}
          </Button>
        </form>
      </Dialog.Content>
    </Dialog.Portal>
  );
}
