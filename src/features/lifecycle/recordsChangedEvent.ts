export const recordsChangedEventName = "records:changed";

export function emitRecordsChangedEvent(): void {
  if (typeof window === "undefined") {
    return;
  }
  window.dispatchEvent(new CustomEvent(recordsChangedEventName));
}
