"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { SlidersHorizontal, X } from "lucide-react";
import type { UsePropertiesCatalogResult } from "@/features/properties/usePropertiesCatalog";
import { PropertyCatalogFilterFields } from "@/widgets/Properties/propertyCatalogFilterFields";

export function PropertyCatalogDesktopAside({
  catalog,
}: {
  catalog: UsePropertiesCatalogResult;
}) {
  return (
    <aside className="sticky top-4 max-h-[calc(100vh-2rem)] overflow-y-auto rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="mb-4 text-sm font-semibold text-slate-900">Filters</h2>
      <PropertyCatalogFilterFields
        catalog={catalog}
        showMobileFooter={false}
      />
    </aside>
  );
}

export function PropertyCatalogMobileFiltersButton({
  catalog,
  onOpen,
}: {
  catalog: UsePropertiesCatalogResult;
  onOpen: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="relative inline-flex w-full items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-800 shadow-sm transition hover:bg-slate-50 sm:w-auto"
    >
      <SlidersHorizontal className="h-4 w-4 text-slate-600" aria-hidden />
      Filters
      {catalog.activeFilterCount > 0 && (
        <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-500 px-1.5 text-[10px] font-bold text-white">
          {catalog.activeFilterCount > 99 ? "99+" : catalog.activeFilterCount}
        </span>
      )}
    </button>
  );
}

export function PropertyCatalogMobileDrawer({
  catalog,
  open,
  onClose,
}: {
  catalog: UsePropertiesCatalogResult;
  open: boolean;
  onClose: () => void;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!open || !mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex h-dvh max-h-dvh min-h-dvh w-full flex-col overflow-hidden bg-white lg:hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Property filters"
    >
      <div className="flex shrink-0 items-center justify-between gap-3 border-b border-slate-200 px-4 py-3">
        <h2 className="text-base font-semibold text-slate-900">Filters</h2>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => catalog.resetFilters()}
            className="text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            Clear
          </button>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-700"
            aria-label="Close filters"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain px-4 py-4">
        <PropertyCatalogFilterFields
          catalog={catalog}
          showMobileFooter
          onApplyMobile={onClose}
        />
      </div>
    </div>,
    document.body,
  );
}
