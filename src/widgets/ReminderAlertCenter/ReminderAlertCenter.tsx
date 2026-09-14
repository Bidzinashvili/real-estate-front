"use client";

import { useMemo } from "react";
import { useUserStore } from "@/shared/stores";
import { useRemindersList } from "@/features/reminders/useRemindersList";
import { useReminderCallAlerts } from "@/features/reminders/useReminderCallAlerts";
import { isAlarmOverlayReminder } from "@/features/reminders/dashboardReminderNormalizer";
import { ReminderCallNotification } from "@/widgets/Dashboard/ReminderCallNotification";
import type { GetRemindersQuery } from "@/features/reminders/remindersApi";

const REMINDER_ALERTS_QUERY: GetRemindersQuery = {
  timing: "ALL",
  limit: 500,
  page: 1,
};
const REMINDER_ALERTS_POLL_INTERVAL_MS = 15_000;

export function ReminderAlertCenter() {
  const user = useUserStore((state) => state.user);
  const isEnabled = user !== null;

  const { reminders } = useRemindersList({
    enabled: isEnabled,
    query: REMINDER_ALERTS_QUERY,
    pollIntervalMs: REMINDER_ALERTS_POLL_INTERVAL_MS,
  });

  const alarmReminders = useMemo(
    () => reminders.filter((reminder) => isAlarmOverlayReminder(reminder)),
    [reminders],
  );

  const reminderCallAlerts = useReminderCallAlerts({
    reminders: alarmReminders,
  });

  if (!reminderCallAlerts.activeReminder) {
    return null;
  }

  return (
    <ReminderCallNotification
      reminder={reminderCallAlerts.activeReminder}
      isDismissing={reminderCallAlerts.isDismissing}
      isSnoozing={reminderCallAlerts.isSnoozing}
      error={reminderCallAlerts.error}
      onDismiss={() => void reminderCallAlerts.dismissActiveReminder()}
      onSnooze={(minutes) => void reminderCallAlerts.snoozeActiveReminder(minutes)}
      onClearError={reminderCallAlerts.clearError}
    />
  );
}
