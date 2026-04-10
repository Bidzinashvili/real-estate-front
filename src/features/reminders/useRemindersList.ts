"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getReminders,
  type GetRemindersQuery,
} from "@/features/reminders/remindersApi";
import type { DashboardReminderRow } from "@/features/reminders/dashboardReminderNormalizer";

type UseRemindersListOptions = {
  enabled: boolean;
  query?: GetRemindersQuery;
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
}: UseRemindersListOptions): UseRemindersListResult {
  const [reminders, setReminders] = useState<DashboardReminderRow[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async (): Promise<DashboardReminderRow[]> => {
    setIsLoading(true);
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
      setReminders([]);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [query]);

  useEffect(() => {
    if (!enabled) {
      return;
    }
    void refetch();
  }, [enabled, query, refetch]);

  return { reminders, isLoading, error, refetch };
}
