"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
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
  total: number;
  page: number;
  limit: number;
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
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(query?.page ?? 1);
  const [limit, setLimit] = useState(query?.limit ?? 20);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const queryKey = JSON.stringify(query ?? {});
  const parsedQuery = useMemo((): GetRemindersQuery | undefined => {
    if (queryKey === "{}") {
      return undefined;
    }
    return JSON.parse(queryKey) as GetRemindersQuery;
  }, [queryKey]);

  const fetchRows = useCallback(
    async (showLoadingState: boolean): Promise<DashboardReminderRow[]> => {
      if (showLoadingState) {
        setIsLoading(true);
      }
      setError(null);
      try {
        const result = await getReminders(parsedQuery);
        setReminders(result.reminders);
        setTotal(result.total);
        setPage(result.page);
        setLimit(result.limit);
        return result.reminders;
      } catch (errorUnknown) {
        const message =
          errorUnknown instanceof Error
            ? errorUnknown.message
            : "შეხსენებების ჩატვირთვა ვერ მოხერხდა.";
        setError(message);
        if (showLoadingState) {
          setReminders([]);
          setTotal(0);
        }
        return [];
      } finally {
        if (showLoadingState) {
          setIsLoading(false);
        }
      }
    },
    [parsedQuery],
  );

  const refetch = useCallback(async (): Promise<DashboardReminderRow[]> => {
    return fetchRows(true);
  }, [fetchRows]);

  useEffect(() => {
    if (!enabled) {
      return;
    }
    void refetch();
  }, [enabled, parsedQuery, refetch]);

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

  return { reminders, total, page, limit, isLoading, error, refetch };
}
