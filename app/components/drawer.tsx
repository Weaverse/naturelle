import * as Dialog from "@radix-ui/react-dialog";
import { useTranslation } from "@weaverse/hydrogen";
import { cva } from "class-variance-authority";
import { useEffect, useRef, useState } from "react";
import { cn } from "~/utils/cn";
import { IconArrowLeft, IconClose } from "./icon";

type DrawerForm = "cart" | "search" | "menu" | "filter";

const panelVariants = cva(
  "flex transform flex-col bg-(--color-drawer-bg) text-left align-middle shadow-xl",
  {
    variants: {
      isForm: {
        cart: "gap-3 overflow-hidden px-6 pt-3 pb-6",
        filter: "hiddenScroll gap-4 overflow-y-auto px-6 pt-3 pb-6",
        menu: "",
        search: "",
      },
    },
    defaultVariants: { isForm: "search" },
  },
);

const headerVariants = cva("sticky top-0 flex shrink-0 items-center", {
  variants: {
    isForm: {
      cart: "h-auto py-2.5",
      filter: "h-11",
      menu: "h-nav px-6",
      search: "h-nav",
    },
  },
  defaultVariants: { isForm: "search" },
});

const closeButtonVariants = cva(
  "text-text-primary transition hover:text-text-primary/50",
  {
    variants: {
      isForm: {
        cart: "-m-4 p-4",
        filter: "-mr-3 p-3",
        menu: "-m-4 p-4",
        search: "-m-4 p-4",
      },
    },
    defaultVariants: { isForm: "search" },
  },
);

const titleVariants = cva("font-heading text-xl", {
  variants: {
    isForm: {
      cart: "font-normal leading-[150%] tracking-[-0.2px] text-text",
      filter:
        "font-normal leading-[150%] tracking-[-0.2px] text-text uppercase",
      menu: "font-normal leading-[150%] tracking-[-0.2px] text-text uppercase",
      search: "font-semibold text-text-primary",
    },
  },
  defaultVariants: { isForm: "search" },
});

/**
 * Drawer component that opens on user click.
 * @param heading - string. Shown at the top of the drawer.
 * @param open - boolean state. if true opens the drawer.
 * @param onClose - function should set the open state.
 * @param openFrom - right, left
 * @param children - react children node.
 */
export function Drawer({
  heading,
  open,
  onClose,
  onBack,
  openFrom = "right",
  isForm,
  isBackMenu = false,
  children,
}: {
  heading?: string;
  open: boolean;
  onClose: () => void;
  onBack?: () => void;
  openFrom: "right" | "left" | "top";
  children: React.ReactNode;
  isForm?: DrawerForm;
  isBackMenu?: boolean;
}) {
  const { t } = useTranslation();
  const returnFocus = useRef<HTMLElement | null>(null);
  const slideOffset = {
    right: "100%",
    left: "-100%",
    top: "-100%",
  };

  const maxWidth =
    isForm === "cart"
      ? "max-w-[460px]"
      : isForm === "menu"
        ? "max-w-[430px]"
        : isForm === "search"
          ? openFrom === "top"
            ? "max-w-none"
            : "max-w-[430px]"
          : isForm === "filter"
            ? "max-w-none md:max-w-[400px]"
            : "max-w-96";

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          onClose();
        }
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 data-[state=open]:animate-fade-in data-[state=closed]:animate-fade-out [--fade-in-duration:300ms] [--fade-out-duration:300ms] motion-reduce:animate-none" />
        <Dialog.Content
          aria-describedby={undefined}
          onOpenAutoFocus={() => {
            returnFocus.current = document.activeElement as HTMLElement;
          }}
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            if (returnFocus.current?.isConnected) {
              returnFocus.current.focus();
            }
          }}
          style={
            {
              "--drawer-slide-x":
                openFrom === "top" ? "0px" : slideOffset[openFrom],
              "--drawer-slide-y": openFrom === "top" ? slideOffset.top : "0px",
            } as React.CSSProperties
          }
          className={cn(
            panelVariants({ isForm }),
            "fixed z-50 w-screen data-[state=open]:animate-[drawer-enter_300ms_ease-in-out] data-[state=closed]:animate-[drawer-exit_300ms_ease-in-out] motion-reduce:animate-none",
            openFrom === "top"
              ? "inset-x-0 top-0 h-fit"
              : `inset-y-0 h-screen-dynamic ${maxWidth}`,
            openFrom === "right" ? "right-0" : "left-0",
          )}
        >
          <header
            className={cn(
              headerVariants({ isForm }),
              heading ? "justify-between" : "justify-items-end",
              openFrom === "left" && isForm === "search" && "px-6",
              openFrom === "left" ||
                isForm === "cart" ||
                (openFrom === "top" && !isBackMenu)
                ? "flex-row-reverse"
                : "",
            )}
          >
            <button
              type="button"
              className={closeButtonVariants({ isForm })}
              onClick={onClose}
              data-test="close-cart"
            >
              <IconClose
                className={
                  isForm === "search"
                    ? "size-6"
                    : isForm === "cart" || isForm === "filter"
                      ? "size-5"
                      : undefined
                }
                aria-label={t("accessibility.close")}
              />
            </button>
            {heading !== null && (
              <Dialog.Title asChild>
                <span className={titleVariants({ isForm })}>{heading}</span>
              </Dialog.Title>
            )}
            {isBackMenu && (
              <button
                type="button"
                className="text-text-primary hover:text-text-primary/50 -m-4 p-2 transition"
                onClick={onBack ?? onClose}
                aria-label={t("accessibility.backToMenu")}
                data-test="close-cart"
              >
                <IconArrowLeft
                  viewBox="0 0 32 32"
                  className="h-8 w-8 opacity-50"
                  aria-hidden="true"
                />
              </button>
            )}
            {isForm !== "cart" && isForm !== "filter" && !isBackMenu && (
              <div className="p-0" />
            )}
          </header>
          {isForm === "cart" ? (
            <div className="flex min-h-0 flex-1 flex-col">{children}</div>
          ) : (
            children
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

/* Use for associating arialabelledby with the title*/
Drawer.Title = Dialog.Title;

export function useDrawer(openDefault = false) {
  const [isOpen, setIsOpen] = useState(openDefault);
  useEffect(() => {
    setIsOpen(false);
  }, []);

  function openDrawer() {
    setIsOpen(true);
  }

  function closeDrawer() {
    setIsOpen(false);
  }

  return {
    isOpen,
    openDrawer,
    closeDrawer,
  };
}
