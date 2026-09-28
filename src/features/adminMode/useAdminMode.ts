"use client";

import { useAdminModeStore } from "@/features/adminMode/adminModeStore";
import { hasActiveAdminPrivileges } from "@/features/adminMode/effectiveAccessViewer";
import { useUserStore } from "@/shared/stores/userStore";

export function useAdminMode() {
  const user = useUserStore((state) => state.user);
  const isAdminMode = useAdminModeStore((state) => state.isAdminMode);
  const setAdminMode = useAdminModeStore((state) => state.setAdminMode);
  const canUseAdminMode = user?.role === "ADMIN";
  const isAdminModeActive = hasActiveAdminPrivileges(user, isAdminMode);

  return {
    canUseAdminMode,
    isAdminMode: isAdminModeActive,
    setAdminMode,
  };
}
