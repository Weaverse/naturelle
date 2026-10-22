import * as Dialog from "@radix-ui/react-dialog";
import { useTranslation } from "@weaverse/hydrogen";
import { Button } from "~/components/button";
import { IconClose } from "./icon";

export function Modal({
  children,
  onClose,
  ariaLabel,
}: {
  children: React.ReactNode;
  onClose?: () => void;
  ariaLabel?: string;
}) {
  const { t } = useTranslation();

  return (
    <Dialog.Root
      open
      onOpenChange={(open) => {
        if (!open) {
          onClose?.();
        }
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 transition-opacity" />
        <Dialog.Content
          aria-describedby={undefined}
          className="fixed top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2 overflow-visible rounded-xl text-left focus:outline-none"
        >
          <Dialog.Title className="sr-only">
            {ariaLabel ?? t("product.quickView")}
          </Dialog.Title>
          <div className="relative transform overflow-visible rounded-xl transition-all">
            <div className="absolute -top-2 -right-2.5 z-50 md:top-0 md:right-0">
              <Dialog.Close asChild>
                <Button
                  type="button"
                  variant="custom"
                  size="icon"
                  aria-label={t("accessibility.close")}
                  className="text-body hover:text-body/50"
                >
                  <IconClose aria-hidden="true" />
                </Button>
              </Dialog.Close>
            </div>
            {children}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
