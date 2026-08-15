"use client";

import { useCallback, useEffect, useState } from "react";

type UseLocalStorageDraftResult<TDraft> = {
  restoredDraft: TDraft | null;
  isDraftReady: boolean;
  saveDraft: (draftValue: TDraft) => void;
  clearDraft: () => void;
};

function getInitialDraft<TDraft>(storageKey: string): TDraft | null {
  if (typeof window === "undefined") {
    return null;
  }

  const storedDraft = window.localStorage.getItem(storageKey);
  if (!storedDraft) {
    return null;
  }

  try {
    const parsedDraft: unknown = JSON.parse(storedDraft);
    if (
      parsedDraft === null ||
      typeof parsedDraft !== "object" ||
      Array.isArray(parsedDraft)
    ) {
      window.localStorage.removeItem(storageKey);
      return null;
    }

    return parsedDraft as TDraft;
  } catch {
    window.localStorage.removeItem(storageKey);
    return null;
  }
}

export function useLocalStorageDraft<TDraft>(
  storageKey: string,
): UseLocalStorageDraftResult<TDraft> {
  const [restoredDraft, setRestoredDraft] = useState<TDraft | null>(null);
  const [isDraftReady, setIsDraftReady] = useState(false);

  const saveDraft = useCallback(
    (draftValue: TDraft) => {
      if (typeof window === "undefined") {
        return;
      }

      window.localStorage.setItem(storageKey, JSON.stringify(draftValue));
    },
    [storageKey],
  );

  const clearDraft = useCallback(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.removeItem(storageKey);
  }, [storageKey]);

  useEffect(() => {
    setRestoredDraft(getInitialDraft<TDraft>(storageKey));
    setIsDraftReady(true);
  }, [storageKey]);

  return {
    restoredDraft,
    isDraftReady,
    saveDraft,
    clearDraft,
  };
}
