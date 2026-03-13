"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { AUTH_TOKEN_KEY } from "@/shared/lib/auth";
import { useUserStore } from "@/shared/stores";

export function useSignOut() {
  const router = useRouter();
  const clearUser = useUserStore((state) => state.clearUser);

  const signOut = useCallback(() => {
    clearUser();

    if (typeof window !== "undefined") {
      window.localStorage.removeItem(AUTH_TOKEN_KEY);
    }

    if (typeof document !== "undefined") {
      document.cookie = `${AUTH_TOKEN_KEY}=; Max-Age=0; Path=/`;
    }

    router.push("/sign-up");
  }, [router, clearUser]);

  return signOut;
}
