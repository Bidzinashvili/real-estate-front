"use client";

import { useCallback, useEffect, useState } from "react";

type UseSessionDraftResult<TDraft> = {
  restoredDraft: TDraft | null;
  isDraftReady: boolean;
  saveDraft: (draftValue: TDraft) => void;
  clearDraft: () => void;
};

function getNavigationType(): PerformanceNavigationTiming["type"] | null {
  if (typeof window === "undefined") {
    return null;
  }

  const navigationEntries = window.performance.getEntriesByType(
    "navigation",
  ) as PerformanceNavigationTiming[];

  return navigationEntries[0]?.type ?? null;
}

function getInitialDraft<TDraft>(storageKey: string): TDraft | null {
  if (typeof window === "undefined") {
    return null;
  }

  if (getNavigationType() !== "reload") {
    window.sessionStorage.removeItem(storageKey);
    return null;
  }

  const storedDraft = window.sessionStorage.getItem(storageKey);

  if (!storedDraft) {
    return null;
  }

  try {
    return JSON.parse(storedDraft) as TDraft;
  } catch {
    window.sessionStorage.removeItem(storageKey);
    return null;
  }
}

export function useSessionDraft<TDraft>(
  storageKey: string,
): UseSessionDraftResult<TDraft> {
  const [restoredDraft, setRestoredDraft] = useState<TDraft | null>(null);
  const [isDraftReady, setIsDraftReady] = useState(false);

  const saveDraft = useCallback(
    (draftValue: TDraft) => {
      if (typeof window === "undefined") {
        return;
      }

      window.sessionStorage.setItem(storageKey, JSON.stringify(draftValue));
    },
    [storageKey],
  );

  const clearDraft = useCallback(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.sessionStorage.removeItem(storageKey);
  }, [storageKey]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const initialDraft = getInitialDraft<TDraft>(storageKey);
    setRestoredDraft(initialDraft);
    setIsDraftReady(true);

    const currentPathname = window.location.pathname;
    const originalPushState = window.history.pushState.bind(window.history);
    const originalReplaceState = window.history.replaceState.bind(window.history);

    const clearDraftForNextUrl = (nextUrl?: string | URL | null) => {
      if (!nextUrl) {
        return;
      }

      const resolvedUrl = new URL(nextUrl.toString(), window.location.href);

      if (resolvedUrl.pathname !== currentPathname) {
        clearDraft();
      }
    };

    window.history.pushState = function pushStateOverride(state, title, url) {
      clearDraftForNextUrl(url);
      originalPushState(state, title, url);
    };

    window.history.replaceState = function replaceStateOverride(state, title, url) {
      clearDraftForNextUrl(url);
      originalReplaceState(state, title, url);
    };

    const handlePopState = () => {
      if (window.location.pathname !== currentPathname) {
        clearDraft();
      }
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.history.pushState = originalPushState;
      window.history.replaceState = originalReplaceState;
      window.removeEventListener("popstate", handlePopState);
    };
  }, [clearDraft]);

  return {
    restoredDraft,
    isDraftReady,
    saveDraft,
    clearDraft,
  };
}
