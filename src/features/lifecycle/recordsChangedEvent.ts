import { emitRemindersChangedEvent } from "@/features/reminders/reminderEvents";

export const recordsChangedEventName = "records:changed";

export function emitRecordsChangedEvent(): void {
  if (typeof window === "undefined") {
    return;
  }
  window.dispatchEvent(new CustomEvent(recordsChangedEventName));
}

export function emitRecordMutationEvents(): void {
  emitRecordsChangedEvent();
  emitRemindersChangedEvent();
}
