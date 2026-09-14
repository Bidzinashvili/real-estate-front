import {
  CLIENT_REMINDER_ID_PREFIX,
  LISTING_VERIFICATION_ID_PREFIX,
} from "@/features/reminders/dashboardReminderNormalizer";

const LIFECYCLE_REMINDER_ID_MARKERS = [
  LISTING_VERIFICATION_ID_PREFIX,
  CLIENT_REMINDER_ID_PREFIX,
] as const;

const OVERLAY_CACHE_HINTS = [
  "overlay",
  "alert",
  "snooze",
  "due-reminder",
  "duereminder",
  "callalert",
  "reminder-call",
  "remindercall",
] as const;

const NOT_FOUND_HINTS = ["reminder not found", "404"] as const;

function storageLooksLikeStaleAlarmOverlayCache(key: string, value: string): boolean {
  const haystack = `${key}\n${value}`.toLowerCase();
  const hasLifecycleMarker = LIFECYCLE_REMINDER_ID_MARKERS.some((marker) =>
    haystack.includes(marker),
  );
  const looksLikeOverlayCache = OVERLAY_CACHE_HINTS.some((hint) => haystack.includes(hint));
  const looksLikeFailedOverlay = NOT_FOUND_HINTS.some((hint) => haystack.includes(hint));
  return hasLifecycleMarker && (looksLikeOverlayCache || looksLikeFailedOverlay);
}

function purgeWebStorage(storage: Storage): void {
  const keysToRemove: string[] = [];
  for (let itemIndex = 0; itemIndex < storage.length; itemIndex += 1) {
    const storageKey = storage.key(itemIndex);
    if (!storageKey) {
      continue;
    }
    const storedValue = storage.getItem(storageKey) ?? "";
    if (storageLooksLikeStaleAlarmOverlayCache(storageKey, storedValue)) {
      keysToRemove.push(storageKey);
    }
  }
  for (const storageKey of keysToRemove) {
    storage.removeItem(storageKey);
  }
}

export function purgeStaleAlarmOverlayCache(): void {
  if (typeof window === "undefined") {
    return;
  }
  try {
    purgeWebStorage(window.localStorage);
  } catch (storageError) {
    void storageError;
  }
  try {
    purgeWebStorage(window.sessionStorage);
  } catch (storageError) {
    void storageError;
  }
}
