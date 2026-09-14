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
      className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-primary/40 px-4 py-8 sm:items-center sm:py-10"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) handleBackdropPointerDown();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative max-h-[min(90vh,48rem)] w-full max-w-2xl overflow-y-auto rounded-2xl bg-muted p-4 pt-12 shadow-lg ring-1 ring-border sm:p-6 sm:pt-14"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <span id={titleId} className="sr-only">
          განცხადების დეტალები
        </span>
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition hover:bg-border/80 hover:text-foreground"
          aria-label="დახურვა"
        >
          <X className="h-5 w-5" aria-hidden />
        </button>

        <PropertyDetailsReadOnlyBody
          propertyId={propertyId}
          layout="embedded"
          onBeforeEditNavigation={onClose}
          onDeleted={onClose}
        />
      </div>
    </div>
  );
}
