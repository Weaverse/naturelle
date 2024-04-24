import {Link} from '@remix-run/react';
import {IconClose} from './Icon';
import { Button } from "@/components/button";
import { useEffect } from "react";

export function Modal({
  children,
  cancelLink,
  onClose,
}: {
  children: React.ReactNode;
  cancelLink?: string;
  onClose?: () => void;
}) {
  useEffect(() => {
    if (!document.body.classList.contains("overflow-hidden")) {
      document.body.classList.add("overflow-hidden")
    }
    return () => {
      document.body.classList.remove("overflow-hidden")      
    }
  },[])
  return (
    <div
      className="relative z-50"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
      id="modal-bg"
    >
      <div className="fixed inset-0 transition-opacity bg-opacity-75 bg-primary/40"></div>
      <div className="fixed inset-0 z-50 overflow-y-hidden">
        <div className="flex items-center justify-center min-h-full p-4 text-center sm:p-0">
          <div
            className="relative flex-1 overflow-hidden text-left transition-all transform rounded sm:flex-none"
            role="button"
            onKeyPress={(e) => {
              e.stopPropagation();
            }}
            tabIndex={0}
          >
            <div className="absolute top-0 right-0">
              {cancelLink ? (
                <Link
                  to={cancelLink}
                  className="-m-4 transition text-body hover:text-body/50"
                >
                  <IconClose aria-label="Close panel" />
                </Link>
              ) : (
                <Button variant='link' onClick={onClose}>
                  <IconClose aria-label="Close panel" />
                </Button>
              )}
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
