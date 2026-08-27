"use client";

import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

type AdvancedSearchSheetProps = {
  open: boolean;
  title: string;
  appliedCount: number;
  onClose: () => void;
  onClear: () => void;
  children: ReactNode;
  footer?: ReactNode;
};

export function AdvancedSearchSheet({
  open,
  title,
  appliedCount,
  onClose,
  onClear,
  children,
  footer,
}: AdvancedSearchSheetProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) {
      return;
    }
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  if (!open || !mounted) {
    return null;
  }

  const heading =
    appliedCount > 0 ? `${title} · ${appliedCount}` : title;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex justify-end bg-primary/40">
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        aria-label="დახურვა"
        onClick={onClose}
      />
      <div
        className="relative flex h-dvh max-h-dvh w-full max-w-md flex-col overflow-hidden bg-card shadow-xl ring-1 ring-border"
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-border px-4 py-3">
          <h2 className="text-base font-semibold text-foreground">{heading}</h2>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClear}
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              გასუფთავება
            </button>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground"
              aria-label="დახურვა"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain px-4 py-4">
          {children}
        </div>
        {footer ? (
          <div className="shrink-0 border-t border-border px-4 py-3">{footer}</div>
        ) : null}
      </div>
    </div>,
    document.body,
  );
}
