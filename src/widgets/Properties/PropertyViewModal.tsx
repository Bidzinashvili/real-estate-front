"use client";

import { useEffect, useId } from "react";
import { X } from "lucide-react";
import { PropertyDetailsReadOnlyBody } from "@/widgets/PropertyDetails/PropertyDetailsReadOnlyBody";

type PropertyViewModalProps = {
  propertyId: string;
  onClose: () => void;
};

export function PropertyViewModal({ propertyId, onClose }: PropertyViewModalProps) {
  const titleId = useId();

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  const handleBackdropPointerDown = () => {
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-slate-900/40 px-4 py-8 sm:items-center sm:py-10"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) handleBackdropPointerDown();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative max-h-[min(90vh,48rem)] w-full max-w-2xl overflow-y-auto rounded-2xl bg-slate-50 p-4 pt-12 shadow-lg ring-1 ring-slate-200 sm:p-6 sm:pt-14"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <span id={titleId} className="sr-only">
          Property details
        </span>
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-200/80 hover:text-slate-800"
          aria-label="Close"
        >
          <X className="h-5 w-5" aria-hidden />
        </button>

        <PropertyDetailsReadOnlyBody
          propertyId={propertyId}
          layout="embedded"
          onBeforeEditNavigation={onClose}
        />
      </div>
    </div>
  );
}
