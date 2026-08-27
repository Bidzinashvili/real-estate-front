"use client";

import { useEffect } from "react";
import { installSessionExpiredInterceptor } from "@/shared/lib/sessionExpired";

export function AuthSessionGuard() {
  useEffect(() => {
    installSessionExpiredInterceptor();
  }, []);

  return null;
}
