export const noteOpenedEventName = "notes:opened";

export function emitNoteOpenedEvent(): void {
  if (typeof window === "undefined") {
    return;
  }
  window.dispatchEvent(new CustomEvent(noteOpenedEventName));
}
