"use client";

import { useCurrentUser } from "@/shared/hooks";

export function UserBootstrap() {
  useCurrentUser();
  return null;
}

