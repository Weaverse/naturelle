import { Dialog, Transition } from "@headlessui/react";
import { useTranslation } from "@weaverse/hydrogen";
import { cva } from "class-variance-authority";
import { Fragment, useEffect, useState } from "react";
import { useLocation } from "react-router";
import { cn } from "~/utils/cn";
import { IconArrowLeft, IconClose } from "./icon";

type DrawerForm = "cart" | "search" | "menu" | "filter";

const panelVariants = cva(
  "flex transform flex-col bg-(--color-drawer-bg) text-left align-middle shadow-xl transition-all",
  {
    variants: {
      form: {
        cart: "gap-3 overflow-hidden px-6 pt-3 pb-6",
        filter: "gap-4 overflow-y-auto px-6 pt-3 pb-6",
        menu: "",
        search: "",
      },
    },
    defaultVariants: { form: "search" },
  },
);

const headerVariants = cva("sticky top-0 flex shrink-0 items-center", {
  variants: {
    form: {
      cart: "h-auto py-2.5",
      filter: "h-11",
      menu: "h-nav",
      search: "h-nav",
    },
  },
  defaultVariants: { form: "search" },
});

const closeButtonVariants = cva(
  "text-text-primary transition hover:text-text-primary/50",
  {
    variants: {
      form: {
        cart: "-m-4 p-4",
        filter: "-mr-3 p-3",
        menu: "-m-4 p-4",
        search: "-m-4 p-4",
      },
    },
    defaultVariants: { form: "search" },
  },
);

const titleVariants = cva("font-heading text-xl", {
  variants: {
    form: {
      cart: "font-normal leading-[150%] tracking-[-0.2px] text-text",
      filter:
        "font-normal leading-[150%] tracking-[-0.2px] text-text uppercase",
      menu: "font-normal leading-[150%] tracking-[-0.2px] text-text uppercase",
      search: "font-semibold text-text-primary",
    },
  },
  defaultVariants: { form: "search" },
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
  openFrom = "right",
  isForm,
  isBackMenu = false,
  children,
}: {
  heading?: string;
  open: boolean;
  onClose: () => void;
  openFrom: "right" | "left" | "top";
  children: React.ReactNode;
  isForm?: DrawerForm;
  isBackMenu?: boolean;
}) {
  const { t } = useTranslation();
  const offScreen = {
    right: "translate-x-full",
    left: "-translate-x-full",
    top: "-translate-y-full",
  };

  const maxWidth =
    isForm === "cart"
      ? "max-w-[460px]"
      : isForm === "menu"
        ? "max-w-none md:w-1/2"
        : isForm === "search"
          ? "max-w-none"
          : isForm === "filter"
            ? "max-w-none md:max-w-[400px]"
            : "max-w-96";

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 left-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="text-body fixed inset-0 bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0">
          <div className="absolute inset-0 overflow-hidden bg-black/60">
            <div
              className={`fixed inset-y-0 flex max-w-full ${
                openFrom === "right" ? "right-0" : ""
              }`}
            >
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500"
                enterFrom={offScreen[openFrom]}
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500"
                leaveFrom="translate-x-0"
                leaveTo={offScreen[openFrom]}
              >
                <Dialog.Panel
                  className={cn(
                    panelVariants({ form: isForm }),
                    openFrom === "left"
                      ? `h-screen-dynamic w-screen ${maxWidth}`
                      : openFrom === "top"
                        ? "h-fit w-screen"
                        : `h-screen-dynamic w-screen ${maxWidth}`,
                  )}
                >
                  <header
                    className={cn(
                      headerVariants({ form: isForm }),
                      heading ? "justify-between" : "justify-items-end",
                      openFrom === "left" ||
                        isForm === "cart" ||
                        (openFrom === "top" && !isBackMenu)
                        ? "flex-row-reverse"
                        : "",
                    )}
                  >
                    <button
                      type="button"
                      className={closeButtonVariants({ form: isForm })}
                      onClick={onClose}
                      data-test="close-cart"
                    >
                      <IconClose
                        className={
                          isForm === "cart" || isForm === "filter"
                            ? "size-5"
                            : undefined
                        }
                        aria-label={t("accessibility.close")}
                      />
                    </button>
                    {heading !== null && (
                      <Dialog.Title as="span">
                        <span
                          className={titleVariants({ form: isForm })}
                          id="cart-contents"
                        >
                          {heading}
                        </span>
                      </Dialog.Title>
                    )}
                    {isBackMenu && (
                      <button
                        type="button"
                        className="text-text-primary hover:text-text-primary/50 -m-4 p-2 transition"
                        onClick={onClose}
                        data-test="close-cart"
                      >
                        <IconArrowLeft
                          viewBox="0 0 32 32"
                          className="h-8 w-8 opacity-50"
                          aria-label={t("accessibility.close")}
                        />
                      </button>
                    )}
                    {isForm !== "cart" &&
                      isForm !== "filter" &&
                      !isBackMenu && <div className="p-0" />}
                  </header>
                  {isForm === "cart" ? (
                    <div className="flex min-h-0 flex-1 flex-col">
                      {children}
                    </div>
                  ) : (
                    children
                  )}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

/* Use for associating arialabelledby with the title*/
Drawer.Title = Dialog.Title;

export function useDrawer(openDefault = false) {
  const [isOpen, setIsOpen] = useState(openDefault);
  const location = useLocation();
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
