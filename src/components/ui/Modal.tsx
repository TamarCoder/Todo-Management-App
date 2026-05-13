"use client";

import { ReactNode, useEffect } from "react";
import { X } from "lucide-react";

export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-[rgba(11,28,48,0.45)] backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <div className="relative z-10 w-full max-w-md rounded-xl border border-outline-variant bg-white shadow-card">
        <div className="flex items-center justify-between px-5 py-4 border-b border-outline-variant">
          <h3 className="font-display text-[18px] font-semibold text-on-surface">{title}</h3>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-on-surface-variant hover:bg-surface-container-low"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="px-5 py-4 text-sm text-on-surface-variant">{children}</div>
        {footer && (
          <div className="flex justify-end gap-2 px-5 py-4 border-t border-outline-variant">{footer}</div>
        )}
      </div>
    </div>
  );
}
