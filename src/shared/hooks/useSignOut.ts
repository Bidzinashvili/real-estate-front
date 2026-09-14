"use client";

import { useCallback } from "react";
import { logoutToSignIn } from "@/shared/lib/sessionExpired";

export function useSignOut() {
  const signOut = useCallback(() => {
    logoutToSignIn();
  }, []);

  return signOut;
}
