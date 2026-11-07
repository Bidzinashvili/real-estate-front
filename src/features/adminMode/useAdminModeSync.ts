"use client";

import { useEffect } from "react";
import { ADMIN_MODE_STORAGE_KEY } from "@/features/adminMode/adminModeCopy";
import { useAdminModeStore } from "@/features/adminMode/adminModeStore";

/**
 * Keeps Admin Mode in sync across browser tabs and mirrors it in the document
 * title, so the admin always knows the mode is on.
 */
export function useAdminModeSync(isActive: boolean) {
  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === ADMIN_MODE_STORAGE_KEY) {
        void useAdminModeStore.persist.rehydrate();
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    const base = document.title.replace(/^🔒\s/, "");
    if (isActive) {
      document.title = `🔒 ${base}`;
    } else {
      document.title = base;
    }
    return () => {
      document.title = document.title.replace(/^🔒\s/, "");
    };
  }, [isActive]);
}
