"use client";

import { Shield } from "lucide-react";
import { ADMIN_MODE_COPY } from "@/features/adminMode/adminModeCopy";
import { useAdminMode } from "@/features/adminMode/useAdminMode";

type AdminModeToggleProps = {
  isCollapsed?: boolean;
};

/**
 * Global Admin Mode switch, rendered once in the sidebar (and mobile header).
 * Returns null for non-admins.
 */
export function AdminModeToggle({ isCollapsed = false }: AdminModeToggleProps) {
  const { canUseAdminMode, isAdminMode, setAdminMode } = useAdminMode();

  if (!canUseAdminMode) {
    return null;
  }

  // No reload: screens that depend on the mode refetch on change, and unsaved form input is kept.
  const handleClick = () => {
    setAdminMode(!isAdminMode);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={isAdminMode}
      title={ADMIN_MODE_COPY.hint}
      data-testid="admin-mode-toggle"
      className={`flex w-full items-center gap-3 rounded-xl border px-3 py-2 text-left text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
        isCollapsed ? "lg:justify-center lg:gap-0 lg:px-2" : ""
      } ${
        isAdminMode
          ? "border-amber-500 bg-amber-500 text-white shadow-sm hover:bg-amber-600"
          : "border-border bg-card text-foreground hover:bg-muted"
      }`}
    >
      <Shield className="h-4 w-4 shrink-0" aria-hidden />
      <span className={isCollapsed ? "lg:hidden" : ""}>
        {ADMIN_MODE_COPY.label}
        {isAdminMode ? " · ჩართულია" : ""}
      </span>
    </button>
  );
}
