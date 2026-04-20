"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getReminders,
  type GetRemindersQuery,
} from "@/features/reminders/remindersApi";
import type { DashboardReminderRow } from "@/features/reminders/dashboardReminderNormalizer";
import { remindersChangedEventName } from "@/features/reminders/reminderEvents";

type UseRemindersListOptions = {
  enabled: boolean;
  query?: GetRemindersQuery;
  pollIntervalMs?: number;
};

type UseRemindersListResult = {
  reminders: DashboardReminderRow[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<DashboardReminderRow[]>;
};

export function useRemindersList({
  enabled,
  query,
  pollIntervalMs,
}: UseRemindersListOptions): UseRemindersListResult {
  const [reminders, setReminders] = useState<DashboardReminderRow[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRows = useCallback(
    async (showLoadingState: boolean): Promise<DashboardReminderRow[]> => {
      if (showLoadingState) {
        setIsLoading(true);
      }
      setError(null);
    try {
      const rows = await getReminders(query);
      setReminders(rows);
      return rows;
    } catch (errorUnknown) {
      const message =
        errorUnknown instanceof Error
          ? errorUnknown.message
          : "Could not load reminders right now.";
      setError(message);
      if (showLoadingState) {
        setReminders([]);
      }
      return [];
    } finally {
      if (showLoadingState) {
        setIsLoading(false);
      }
    }
    },
    [query],
  );

  const refetch = useCallback(async (): Promise<DashboardReminderRow[]> => {
    return fetchRows(true);
  }, [fetchRows]);

  useEffect(() => {
    if (!enabled) {
      return;
    }
    void refetch();
  }, [enabled, query, refetch]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const handleRemindersChanged = () => {
      void fetchRows(false);
    };

    window.addEventListener(remindersChangedEventName, handleRemindersChanged);

    return () => {
      window.removeEventListener(remindersChangedEventName, handleRemindersChanged);
    };
  }, [enabled, fetchRows]);

  useEffect(() => {
    if (!enabled || !pollIntervalMs || pollIntervalMs <= 0) {
      return;
    }

    const timer = window.setInterval(() => {
      void fetchRows(false);
    }, pollIntervalMs);

    return () => {
      window.clearInterval(timer);
    };
  }, [enabled, fetchRows, pollIntervalMs]);

  return { reminders, isLoading, error, refetch };
}
