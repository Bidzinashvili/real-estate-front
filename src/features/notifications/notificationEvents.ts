export const notificationsChangedEventName = "notifications:changed";

export function emitNotificationsChangedEvent(): void {
  if (typeof window === "undefined") {
    return;
  }
  window.dispatchEvent(new CustomEvent(notificationsChangedEventName));
}
