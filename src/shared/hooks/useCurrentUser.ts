"use client";

import { useEffect } from "react";
import { useUserStore } from "@/shared/stores";

export function useCurrentUser() {
  const { user, isLoading, error, fetchCurrentUser } = useUserStore();

  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  return { user, isLoading, error };
}
