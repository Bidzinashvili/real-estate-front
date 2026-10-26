export const collaborationsChangedEventName = "collaborations:changed";

export function emitCollaborationsChangedEvent(): void {
  if (typeof window === "undefined") {
    return;
  }
  window.dispatchEvent(new CustomEvent(collaborationsChangedEventName));
}
