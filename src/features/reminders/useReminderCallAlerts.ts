"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { DashboardReminderRow } from "@/features/reminders/dashboardReminderNormalizer";
import { patchReminder } from "@/features/reminders/remindersApi";

type UseReminderCallAlertsOptions = {
  reminders: DashboardReminderRow[];
};

type UseReminderCallAlertsResult = {
  activeReminder: DashboardReminderRow | null;
  isDismissing: boolean;
  isSnoozing: boolean;
  error: string | null;
  dismissActiveReminder: () => Promise<void>;
  snoozeActiveReminder: (minutes: number) => Promise<void>;
  clearError: () => void;
};

function isReminderDuePending(reminder: DashboardReminderRow): boolean {
  if (reminder.dismissedAtIso) {
    return false;
  }
  const dueAtTime = new Date(reminder.dueAtIso).getTime();
  if (!Number.isFinite(dueAtTime)) {
    return false;
  }
  return dueAtTime <= Date.now();
}

function sortByMostRecentDue(left: DashboardReminderRow, right: DashboardReminderRow): number {
  const leftTime = new Date(left.dueAtIso).getTime();
  const rightTime = new Date(right.dueAtIso).getTime();
  if (!Number.isFinite(leftTime) && !Number.isFinite(rightTime)) return 0;
  if (!Number.isFinite(leftTime)) return 1;
  if (!Number.isFinite(rightTime)) return -1;
  return rightTime - leftTime;
}

export function useReminderCallAlerts({
  reminders,
}: UseReminderCallAlertsOptions): UseReminderCallAlertsResult {
  const [activeReminderId, setActiveReminderId] = useState<string | null>(null);
  const [isDismissing, setIsDismissing] = useState(false);
  const [isSnoozing, setIsSnoozing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dismissedReminderIdsRef = useRef<Set<string>>(new Set());

  const dueReminders = useMemo(() => {
    return reminders
      .filter((reminder) => isReminderDuePending(reminder))
      .sort(sortByMostRecentDue);
  }, [reminders]);

  const activeReminder =
    (activeReminderId ? dueReminders.find((reminder) => reminder.id === activeReminderId) : null) ??
    null;

  useEffect(() => {
    if (activeReminder) {
      return;
    }

    const nextReminder =
      dueReminders.find((reminder) => !dismissedReminderIdsRef.current.has(reminder.id)) ?? null;
    setActiveReminderId(nextReminder?.id ?? null);
  }, [activeReminder, dueReminders]);

  const dismissActiveReminder = useCallback(async () => {
    if (!activeReminder || isDismissing) {
      return;
    }

    const reminderId = activeReminder.id;
    dismissedReminderIdsRef.current.add(reminderId);
    setActiveReminderId(null);
    setError(null);
    setIsDismissing(true);

    try {
      await patchReminder(reminderId, { dismissedAt: new Date().toISOString() });
    } catch (errorUnknown) {
      dismissedReminderIdsRef.current.delete(reminderId);
      setActiveReminderId(reminderId);
      const message =
        errorUnknown instanceof Error
          ? errorUnknown.message
          : "Could not dismiss this reminder right now.";
      setError(message);
    } finally {
      setIsDismissing(false);
    }
  }, [activeReminder, isDismissing]);

  const snoozeActiveReminder = useCallback(
    async (minutes: number) => {
      if (!activeReminder || isSnoozing) {
        return;
      }
      if (!Number.isFinite(minutes) || minutes <= 0) {
        return;
      }

      setIsSnoozing(true);
      setError(null);
      try {
        const notifyAtIso = new Date(Date.now() + minutes * 60_000).toISOString();
        await patchReminder(activeReminder.id, { notifyAt: notifyAtIso });
        setActiveReminderId(null);
      } catch (errorUnknown) {
        const message =
          errorUnknown instanceof Error
            ? errorUnknown.message
            : "Could not snooze this reminder right now.";
        setError(message);
      } finally {
        setIsSnoozing(false);
      }
    },
    [activeReminder, isSnoozing],
  );

  return {
    activeReminder,
    isDismissing,
    isSnoozing,
    error,
    dismissActiveReminder,
    snoozeActiveReminder,
    clearError: () => setError(null),
  };
}
