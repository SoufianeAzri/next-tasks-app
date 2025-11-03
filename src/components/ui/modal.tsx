"use client";

import React, { forwardRef, useEffect } from "react";
import { cn } from "@/utils/helpers";

interface ModalProps extends React.HTMLAttributes<HTMLDivElement> {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  backdropClose?: boolean;
}

const Modal = forwardRef<HTMLDivElement, ModalProps>(
  (
    { open, onClose, children, backdropClose = true, className, ...props },
    ref
  ) => {

    // Disable scrolling when modal is open
    useEffect(() => {
      if (open) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
      }
    }, [open]);

    // Don’t render if not open
    if (!open) return null;

    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center"
        aria-modal="true"
        role="dialog"
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/50"
          onClick={() => backdropClose && onClose()}
        />

        {/* Modal content */}
        <div
          ref={ref}
          className={cn(
            "relative bg-white rounded-2xl shadow-lg p-6 w-fit z-10",
            className
          )}
          {...props}
        >
          {children}
        </div>
      </div>
    );
  }
);

Modal.displayName = "Modal";

export { Modal };
