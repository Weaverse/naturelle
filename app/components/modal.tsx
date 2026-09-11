import { useEffect } from "react";
import { Button } from "~/components/button";
import { IconClose } from "./icon";

export function Modal({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose?: () => void;
}) {
  useEffect(() => {
    document.body.classList.add("overflow-hidden");
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, []);

  return (
    <div
      className="relative z-50 block"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="fixed inset-0 bg-black/60 bg-opacity-75 transition-opacity" />
      <div className="fixed inset-0 z-50 overflow-y-hidden">
        <div className="relative flex min-h-full items-center justify-center p-4 text-center sm:p-0">
          <div className="absolute inset-0 z-10" onClick={onClose} />
          <div className="relative z-20 flex-1 transform overflow-visible rounded-xl text-left transition-all sm:flex-none">
            <div className="absolute -right-[10px] -top-[8px] z-50 md:right-0 md:top-0">
              <Button
                type="button"
                variant="custom"
                size="icon"
                aria-label="Close panel"
                className="text-body hover:text-body/50"
                onClick={onClose}
              >
                <IconClose aria-hidden="true" />
              </Button>
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
