"use client";

import { useAdminModeStore } from "@/features/adminMode/adminModeStore";
import { useUserStore } from "@/shared/stores/userStore";

export function useAdminMode() {
  const userRole = useUserStore((state) => state.user?.role);
  const isAdminMode = useAdminModeStore((state) => state.isAdminMode);
  const setAdminMode = useAdminModeStore((state) => state.setAdminMode);
  const canUseAdminMode = userRole === "ADMIN";

  return {
    canUseAdminMode,
    isAdminMode: canUseAdminMode && isAdminMode,
    setAdminMode,
  };
}
