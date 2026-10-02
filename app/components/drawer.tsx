import { Dialog, Transition } from "@headlessui/react";
import { useTranslation } from "@weaverse/hydrogen";
import { Fragment, useEffect, useState } from "react";
import { useLocation } from "react-router";
import { cn } from "~/utils/cn";
import { IconArrowLeft, IconClose } from "./icon";

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
  isForm?: "cart" | "search" | "menu" | "filter";
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
                    "transform text-left align-middle shadow-xl transition-all bg-(--color-drawer-bg) flex flex-col gap-3",
                    isForm === "cart" && "overflow-hidden px-6 pt-3 pb-6",
                    isForm === "filter" &&
                      "gap-4 overflow-y-auto px-6 pt-3 pb-6",
                    openFrom === "left"
                      ? `h-screen-dynamic w-screen ${maxWidth}`
                      : openFrom === "top"
                        ? "h-fit w-screen"
                        : `h-screen-dynamic w-screen ${maxWidth}`,
                  )}
                >
                  <header
                    className={cn(
                      "sticky top-0 flex items-center shrink-0",
                      isForm === "cart"
                        ? "h-auto py-2.5"
                        : isForm === "filter"
                          ? "h-11"
                          : "h-nav",
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
                      className={cn(
                        "text-text-primary transition hover:text-text-primary/50",
                        isForm === "filter" ? "-mr-3 p-3" : "-m-4 p-4",
                      )}
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
                          className={cn(
                            "font-heading text-xl",
                            isForm === "cart"
                              ? "font-normal leading-[150%] tracking-[-0.2px] text-text uppercase"
                              : isForm === "filter"
                                ? "font-normal leading-[150%] tracking-[-0.2px] text-text"
                                : isForm === "menu"
                                  ? "leading-[150%] font-normal tracking-[-0.2px] text-text"
                                  : "font-semibold text-text-primary",
                            isForm !== "search" &&
                              isForm !== "cart" &&
                              "uppercase",
                          )}
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
