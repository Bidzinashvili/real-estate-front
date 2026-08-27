import type { JsonValue } from "@/shared/lib/jsonValue";
import { asBoolean, asNumber, asNullableString, isJsonObject } from "@/shared/lib/jsonValue";
import type { ReminderSummary } from "@/features/reminders/remindersApiTypes";

export const EMPTY_REMINDER_SUMMARY: ReminderSummary = {
  activeCount: 0,
  nextReminderAt: null,
  hasDueReminder: false,
  latestTriggeredAt: null,
};

export function parseReminderSummary(value: JsonValue | undefined): ReminderSummary {
  if (!isJsonObject(value)) {
    return EMPTY_REMINDER_SUMMARY;
  }

  const parsedCount = asNumber(value.activeCount, 0);
  const activeCount = Number.isFinite(parsedCount) && parsedCount > 0 ? Math.floor(parsedCount) : 0;

  return {
    activeCount,
    nextReminderAt: asNullableString(value.nextReminderAt),
    hasDueReminder: asBoolean(value.hasDueReminder, false),
    latestTriggeredAt: asNullableString(value.latestTriggeredAt),
  };
}
