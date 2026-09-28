"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchNotifications } from "@/features/notifications/notificationsApi";
import type { AppNotification } from "@/features/notifications/notificationsApi.types";
import { notificationsChangedEventName } from "@/features/notifications/notificationEvents";

const NOTIFICATIONS_POLL_INTERVAL_MS = 45_000;

type UseNotificationsListOptions = {
  enabled: boolean;
  pollIntervalMs?: number;
};

type UseNotificationsListResult = {
  notifications: AppNotification[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<AppNotification[]>;
};

export function useNotificationsList({
  enabled,
  pollIntervalMs = NOTIFICATIONS_POLL_INTERVAL_MS,
}: UseNotificationsListOptions): UseNotificationsListResult {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(
    async (showLoadingState = false): Promise<AppNotification[]> => {
      if (!enabled) {
        setNotifications([]);
        setError(null);
        return [];
      }

      if (showLoadingState) {
        setIsLoading(true);
      }
      setError(null);

      try {
        const result = await fetchNotifications();
        setNotifications(result.notifications);
        return result.notifications;
      } catch (errorUnknown) {
        const message =
          errorUnknown instanceof Error
            ? errorUnknown.message
            : "შეტყობინებების ჩატვირთვა ვერ მოხერხდა.";
        setError(message);
        return [];
      } finally {
        if (showLoadingState) {
          setIsLoading(false);
        }
      }
    },
    [enabled],
  );

  useEffect(() => {
    if (!enabled) {
      return;
    }
    void refetch(true);
    const intervalId = window.setInterval(() => {
      void refetch(false);
    }, pollIntervalMs);
    return () => window.clearInterval(intervalId);
  }, [enabled, pollIntervalMs, refetch]);

  useEffect(() => {
    if (!enabled) {
      return;
    }
    const handleNotificationsChanged = () => {
      void refetch(false);
    };
    window.addEventListener(notificationsChangedEventName, handleNotificationsChanged);
    return () => {
      window.removeEventListener(
        notificationsChangedEventName,
        handleNotificationsChanged,
      );
    };
  }, [enabled, refetch]);

  return {
    notifications,
    isLoading,
    error,
    refetch: () => refetch(true),
  };
}
