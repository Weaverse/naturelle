import { XIcon } from "@phosphor-icons/react";
import * as Dialog from "@radix-ui/react-dialog";
import { CartForm } from "@shopify/hydrogen";
import { useEffect, useRef, useState } from "react";
import { useFetcher } from "react-router";
import type { CartApiQueryFragment } from "storefront-api.generated";
import { Button } from "~/components/button";
import { cn } from "~/utils/cn";

type CartLayout = "page" | "aside";

function Banner({
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
  const [note, setNote] = useState(currentNote);
  const [submitted, setSubmitted] = useState(false);
  const fetcher = useFetcher();

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data) {
      setSubmitted(true);
    }
  }, [fetcher]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formCartNote = formData.get("cartNote") as string;
    if (formCartNote) {
      fetcher.submit(
        {
          [CartForm.INPUT_NAME]: JSON.stringify({
            action: CartForm.ACTIONS.NoteUpdate,
            inputs: { cartNote: formCartNote },
          }),
        },
        { method: "POST", action: "/cart" },
      );
      setNote(formCartNote);
    }
  }

  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-[60] bg-black/50 data-[state=closed]:animate-fade-out data-[state=open]:animate-fade-in" />
      <Dialog.Content
        onCloseAutoFocus={(e) => {
          e.preventDefault();
          setNote(currentNote);
          setSubmitted(false);
        }}
        className={dialogContentClass(layout)}
        aria-describedby={undefined}
      >
        <Dialog.Close asChild>
          <button
            type="button"
            className="absolute top-2 right-2 z-10 flex size-8 items-center justify-center"
            aria-label="Close"
          >
            <XIcon size={16} />
          </button>
        </Dialog.Close>
        <Dialog.Title asChild>
          <p className="mb-4 font-body text-sm font-medium">Order Note</p>
        </Dialog.Title>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <textarea
            className="min-h-[92px] w-full resize-none rounded-lg border border-border-subtle p-3"
            placeholder="Order special instructions"
            rows={3}
            name="cartNote"
            value={note}
            onChange={(e) => {
              setNote(e.target.value);
              setSubmitted(false);
            }}
          />
          {submitted && (
            <Banner variant="success">Cart note saved successfully</Banner>
          )}
          <Button
            type="submit"
            loading={fetcher.state !== "idle"}
            disabled={fetcher.state !== "idle"}
            shape="round"
            className="w-full"
          >
            Add note
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
  const [code, setCode] = useState("");
  const fetcher = useFetcher();
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
        { method: "POST", action: "/cart" },
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
            aria-label="Close"
          >
            <XIcon size={16} />
          </button>
        </Dialog.Close>
        <Dialog.Title asChild>
          <p className="mb-4 font-body text-sm font-medium">Discount Code</p>
        </Dialog.Title>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              fetcher.data = null;
            }}
            className="w-full rounded-lg border border-border-subtle p-3"
            type="text"
            name="discountCode"
            placeholder="Discount code"
            required
          />
          {success && (
            <Banner variant="success">Discount applied successfully</Banner>
          )}
          {error && <Banner variant="error">Invalid discount code.</Banner>}
          <Button
            type="submit"
            shape="round"
            className="w-full"
            loading={fetcher.state !== "idle"}
            disabled={fetcher.state !== "idle"}
          >
            Apply
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
  const appliedGiftCardCodes = useRef<string[]>([]);
  const [code, setCode] = useState("");
  const fetcher = useFetcher();
  const submitted = Boolean(code && fetcher.state === "idle" && fetcher.data);
  const success = Boolean(
    submitted &&
      appliedGiftCards?.find((gc) =>
        code.toLowerCase().endsWith(gc.lastCharacters),
      ),
  );
  const error = submitted && !success;

  function saveAppliedCode(gcCode: string) {
    const formattedCode = gcCode.replace(/\s/g, "");
    if (!appliedGiftCardCodes.current.includes(formattedCode)) {
      appliedGiftCardCodes.current.push(formattedCode);
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const giftCardCode = formData.get("giftCardCode") as string;
    if (giftCardCode) {
      fetcher.submit(
        {
          [CartForm.INPUT_NAME]: JSON.stringify({
            action: CartForm.ACTIONS.GiftCardCodesUpdate,
            inputs: {
              giftCardCode,
              giftCardCodes: appliedGiftCardCodes.current,
            },
          }),
        },
        { method: "POST", action: "/cart" },
      );
      saveAppliedCode(giftCardCode);
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
            aria-label="Close"
          >
            <XIcon size={16} />
          </button>
        </Dialog.Close>
        <Dialog.Title asChild>
          <p className="mb-4 font-body text-sm font-medium">Giftcard</p>
        </Dialog.Title>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            className="w-full rounded-lg border border-border-subtle p-3"
            type="text"
            name="giftCardCode"
            placeholder="Giftcard"
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              fetcher.data = null;
            }}
            required
          />
          {success && (
            <Banner variant="success">Gift card applied successfully</Banner>
          )}
          {error && <Banner variant="error">Invalid gift card code.</Banner>}
          <Button
            type="submit"
            shape="round"
            className="w-full"
            loading={fetcher.state !== "idle"}
            disabled={fetcher.state !== "idle"}
          >
            Apply
          </Button>
        </form>
      </Dialog.Content>
    </Dialog.Portal>
  );
}
