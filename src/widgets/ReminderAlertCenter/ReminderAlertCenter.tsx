"use client";

import { useUserStore } from "@/shared/stores";
import { useRemindersList } from "@/features/reminders/useRemindersList";
import { useReminderCallAlerts } from "@/features/reminders/useReminderCallAlerts";
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

  const { reminders, refetch } = useRemindersList({
    enabled: isEnabled,
    query: REMINDER_ALERTS_QUERY,
    pollIntervalMs: REMINDER_ALERTS_POLL_INTERVAL_MS,
  });

  const reminderCallAlerts = useReminderCallAlerts({
    reminders,
    onReminderSnoozed: () => void refetch(),
  });

  if (!reminderCallAlerts.activeReminder) {
    return null;
  }

  return (
    <ReminderCallNotification
      reminder={reminderCallAlerts.activeReminder}
      isSnoozing={reminderCallAlerts.isSnoozing}
      error={reminderCallAlerts.error}
      onDismiss={reminderCallAlerts.dismissActiveReminder}
      onSnooze={(minutes) => void reminderCallAlerts.snoozeActiveReminder(minutes)}
      onClearError={reminderCallAlerts.clearError}
    />
  );
}
