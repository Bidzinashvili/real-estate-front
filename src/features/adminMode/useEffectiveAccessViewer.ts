"use client";

import { useMemo } from "react";
import { useAdminModeStore } from "@/features/adminMode/adminModeStore";
import {
  hasActiveAdminPrivileges,
  resolveEffectiveAccessViewer,
  type AccessViewer,
} from "@/features/adminMode/effectiveAccessViewer";
import { useCurrentUser } from "@/shared/hooks";

export function useEffectiveAccessViewer(): AccessViewer | null {
  const { user } = useCurrentUser();
  const isAdminMode = useAdminModeStore((state) => state.isAdminMode);

  return useMemo(
    () => resolveEffectiveAccessViewer(user, isAdminMode),
    [user, isAdminMode],
  );
}

export function useActiveAdminPrivileges(): boolean {
  const { user } = useCurrentUser();
  const isAdminMode = useAdminModeStore((state) => state.isAdminMode);

  return hasActiveAdminPrivileges(user, isAdminMode);
}
