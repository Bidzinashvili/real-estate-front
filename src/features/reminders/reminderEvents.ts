export const remindersChangedEventName = "reminders:changed";

export function emitRemindersChangedEvent(): void {
  if (typeof window === "undefined") {
    return;
  }
  window.dispatchEvent(new CustomEvent(remindersChangedEventName));
}
