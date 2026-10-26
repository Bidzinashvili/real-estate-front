"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getDashboardAnnouncement,
  updateDashboardAnnouncement,
} from "@/features/dashboardAnnouncement/dashboardAnnouncementApi";

type UseDashboardAnnouncementResult = {
  message: string;
  isLoading: boolean;
  hasLoaded: boolean;
  loadError: string | null;
  isSaving: boolean;
  saveError: string | null;
  reload: () => void;
  saveMessage: (nextMessage: string) => Promise<boolean>;
};

const LOAD_ERROR_MESSAGE = "შეტყობინების ჩატვირთვა ვერ მოხერხდა.";
const SAVE_ERROR_MESSAGE = "შეტყობინების შენახვა ვერ მოხერხდა.";

export function useDashboardAnnouncement(
  enabled: boolean,
): UseDashboardAnnouncementResult {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(enabled);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  const reload = useCallback(() => {
    setReloadToken((previous) => previous + 1);
  }, []);

  useEffect(() => {
    if (!enabled) {
      setIsLoading(false);
      setHasLoaded(false);
      return;
    }

    let cancelled = false;
    setIsLoading(true);
    setLoadError(null);
    setHasLoaded(false);

    void getDashboardAnnouncement()
      .then((response) => {
        if (cancelled) {
          return;
        }
        setMessage(response.message);
        setLoadError(null);
        setHasLoaded(true);
      })
      .catch(() => {
        if (cancelled) {
          return;
        }
        setLoadError(LOAD_ERROR_MESSAGE);
        setHasLoaded(true);
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [enabled, reloadToken]);

  const saveMessage = useCallback(async (nextMessage: string): Promise<boolean> => {
    setSaveError(null);
    setIsSaving(true);
    try {
      const response = await updateDashboardAnnouncement({ message: nextMessage });
      setMessage(response.message);
      return true;
    } catch {
      setSaveError(SAVE_ERROR_MESSAGE);
      return false;
    } finally {
      setIsSaving(false);
    }
  }, []);

  return {
    message,
    isLoading,
    hasLoaded,
    loadError,
    isSaving,
    saveError,
    reload,
    saveMessage,
  };
}
