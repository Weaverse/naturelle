import { cn } from "@/lib/utils";
import { Dialog, Transition } from "@headlessui/react";
import { useLocation } from "@remix-run/react";
import { Fragment, useEffect, useState } from "react";
import { IconArrowLeft, IconClose } from "./Icon";

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
  const offScreen = {
    right: "translate-x-full",
    left: "-translate-x-full",
    top: "-translate-y-full",
  };

  const maxWidth = isForm === "cart" ? "max-w-[420px]" : "max-w-96";

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
                    "transform text-left align-middle shadow-xl transition-all bg-[var(--color-drawer-bg)]",
                    openFrom === "left"
                      ? `h-screen-dynamic w-screen ${maxWidth}`
                      : openFrom === "top"
                        ? "h-fit w-screen"
                        : `h-screen-dynamic w-screen ${maxWidth}`
                  )}
                >
                  <header
                    className={cn(
                      "sticky top-0 flex h-nav items-center px-6 py-5",
                      heading ? "justify-between" : "justify-items-end",
                      openFrom === "left" || isForm === "cart" || (openFrom === "top" && !isBackMenu)
                        ? "flex-row-reverse"
                        : ""
                    )}
                  >
                    <button
                      type="button"
                      className="text-text-primary hover:text-text-primary/50 -m-4 p-4 transition"
                      onClick={onClose}
                      data-test="close-cart"
                    >
                      <IconClose aria-label="Close panel" />
                    </button>
                    {heading !== null && (
                      <Dialog.Title as="span">
                        <span className={cn("font-semibold font-heading text-xl text-text-primary", isForm !== 'search' && 'uppercase')} id="cart-contents">
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
                          aria-label="Close panel"
                        />
                      </button>
                    )}
                    {isForm !== 'cart' && isForm !== 'filter' && !isBackMenu && <div className="p-0" />}
                  </header>
                  {children}
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
  let { pathname } = useLocation();
  useEffect(() => {
    if (isOpen) {
      closeDrawer();
    }
  }, [pathname]);

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
