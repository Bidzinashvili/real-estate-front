"use client";

import { ADMIN_MODE_COPY } from "@/features/adminMode/adminModeCopy";
import { useAdminMode } from "@/features/adminMode/useAdminMode";
import { useAdminModeSync } from "@/features/adminMode/useAdminModeSync";
import { Shield } from "lucide-react";

/** Slim banner shown on every page while Admin Mode is ON. Also syncs tabs and the title. */
export function AdminModeBanner() {
  const { isAdminMode, canUseAdminMode, setAdminMode } = useAdminMode();
  useAdminModeSync(isAdminMode);

  if (!canUseAdminMode || !isAdminMode) {
    return null;
  }

  return (
    <div
      role="status"
      data-testid="admin-mode-banner"
      className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-amber-500 bg-amber-100 px-4 py-2 text-sm text-amber-950 dark:bg-amber-950 dark:text-amber-100"
    >
      <span className="inline-flex items-center gap-2">
        <Shield className="h-4 w-4 shrink-0" aria-hidden />
        <span className="font-semibold">{ADMIN_MODE_COPY.bannerOn}</span>
        <span className="hidden sm:inline">— {ADMIN_MODE_COPY.bannerDetail}</span>
      </span>
      <button
        type="button"
        onClick={() => setAdminMode(false)}
        className="rounded-full border border-amber-700 px-3 py-1 text-xs font-medium hover:bg-amber-200 dark:hover:bg-amber-900"
      >
        {ADMIN_MODE_COPY.bannerOff}
      </button>
    </div>
  );
}
