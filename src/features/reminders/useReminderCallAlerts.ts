"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  isAlarmOverlayReminder,
  isLifecycleReminderId,
  type DashboardReminderRow,
} from "@/features/reminders/dashboardReminderNormalizer";
import { dismissReminder, snoozeReminder } from "@/features/reminders/remindersApi";
import { purgeStaleAlarmOverlayCache } from "@/features/reminders/purgeAlarmOverlayCache";
import { ApiError } from "@/shared/lib/apiError";

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
  if (!isAlarmOverlayReminder(reminder)) {
    return false;
  }
  if (reminder.dismissedAtIso) {
    return false;
  }
  return reminder.isDue;
}

function sortByMostRecentDue(left: DashboardReminderRow, right: DashboardReminderRow): number {
  const leftTime = new Date(left.dueAtIso).getTime();
  const rightTime = new Date(right.dueAtIso).getTime();
  if (!Number.isFinite(leftTime) && !Number.isFinite(rightTime)) return 0;
  if (!Number.isFinite(leftTime)) return 1;
  if (!Number.isFinite(rightTime)) return -1;
  return rightTime - leftTime;
}

function isReminderNotFoundError(errorUnknown: unknown): boolean {
  if (errorUnknown instanceof ApiError && errorUnknown.statusCode === 404) {
    return true;
  }
  if (!(errorUnknown instanceof Error)) {
    return false;
  }
  return errorUnknown.message.trim().toLowerCase().includes("reminder not found");
}

export function useReminderCallAlerts({
  reminders,
}: UseReminderCallAlertsOptions): UseReminderCallAlertsResult {
  const [activeReminderId, setActiveReminderId] = useState<string | null>(null);
  const [isDismissing, setIsDismissing] = useState(false);
  const [isSnoozing, setIsSnoozing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const droppedReminderIdsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    purgeStaleAlarmOverlayCache();
  }, []);

  const dueReminders = useMemo(() => {
    return reminders
      .filter((reminder) => isReminderDuePending(reminder))
      .sort(sortByMostRecentDue);
  }, [reminders]);

  const activeReminder =
    (activeReminderId ? dueReminders.find((reminder) => reminder.id === activeReminderId) : null) ??
    null;

  const dropReminderFromOverlay = useCallback((reminderId: string) => {
    droppedReminderIdsRef.current.add(reminderId);
    setActiveReminderId((currentId) => (currentId === reminderId ? null : currentId));
    setError(null);
  }, []);

  useEffect(() => {
    const lifecycleIds = reminders
      .map((reminder) => reminder.id)
      .filter((reminderId) => isLifecycleReminderId(reminderId));
    for (const reminderId of lifecycleIds) {
      droppedReminderIdsRef.current.add(reminderId);
    }
  }, [reminders]);

  useEffect(() => {
    if (activeReminderId && isLifecycleReminderId(activeReminderId)) {
      dropReminderFromOverlay(activeReminderId);
      return;
    }

    if (error && error.trim().toLowerCase().includes("reminder not found") && activeReminderId) {
      dropReminderFromOverlay(activeReminderId);
      return;
    }

    if (activeReminder) {
      return;
    }

    const nextReminder =
      dueReminders.find((reminder) => !droppedReminderIdsRef.current.has(reminder.id)) ?? null;
    setActiveReminderId(nextReminder?.id ?? null);
  }, [activeReminder, activeReminderId, dropReminderFromOverlay, dueReminders, error]);

  const dismissActiveReminder = useCallback(async () => {
    if (!activeReminder || isDismissing) {
      return;
    }

    const reminderId = activeReminder.id;
    droppedReminderIdsRef.current.add(reminderId);
    setActiveReminderId(null);
    setError(null);
    setIsDismissing(true);

    try {
      await dismissReminder(reminderId);
    } catch (errorUnknown) {
      if (isReminderNotFoundError(errorUnknown)) {
        dropReminderFromOverlay(reminderId);
        return;
      }
      droppedReminderIdsRef.current.delete(reminderId);
      setActiveReminderId(reminderId);
      const message =
        errorUnknown instanceof Error
          ? errorUnknown.message
          : "შეხსენების დახურვა ვერ მოხერხდა.";
      setError(message);
    } finally {
      setIsDismissing(false);
    }
  }, [activeReminder, dropReminderFromOverlay, isDismissing]);

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
        await snoozeReminder(activeReminder.id, minutes);
        droppedReminderIdsRef.current.add(activeReminder.id);
        setActiveReminderId(null);
      } catch (errorUnknown) {
        if (isReminderNotFoundError(errorUnknown)) {
          dropReminderFromOverlay(activeReminder.id);
          return;
        }
        const message =
          errorUnknown instanceof Error
            ? errorUnknown.message
            : "შეხსენების გადადება ვერ მოხერხდა.";
        setError(message);
      } finally {
        setIsSnoozing(false);
      }
    },
    [activeReminder, dropReminderFromOverlay, isSnoozing],
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
