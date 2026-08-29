"use client";

import { ADMIN_MODE_COPY } from "@/features/adminMode/adminModeCopy";
import { useAdminMode } from "@/features/adminMode/useAdminMode";

export function AdminModeToggle() {
  const { canUseAdminMode, isAdminMode, setAdminMode } = useAdminMode();

  if (!canUseAdminMode) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={() => setAdminMode(!isAdminMode)}
      aria-pressed={isAdminMode}
      title={ADMIN_MODE_COPY.hint}
      className={`inline-flex shrink-0 items-center justify-center rounded-full px-3 py-1.5 text-xs font-medium shadow-sm transition sm:px-4 ${
        isAdminMode
          ? "border border-slate-800 bg-slate-800 text-white"
          : "border border-border bg-card text-foreground hover:bg-muted"
      }`}
    >
      {ADMIN_MODE_COPY.label}
    </button>
  );
}
