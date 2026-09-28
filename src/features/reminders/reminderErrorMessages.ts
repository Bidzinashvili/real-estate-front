import { ApiError } from "@/shared/lib/apiError";

export const REMINDERS_PER_RECORD_LIMIT = 50;

export const REMINDER_LIMIT_GEORGIAN_MESSAGE =
  "ერთ ჩანაწერზე შეგიძლიათ მაქსიმუმ 50 შეხსენება.";

function collectApiErrorText(apiError: ApiError): string {
  const parts: string[] = [apiError.message, apiError.error, apiError.code ?? ""];
  if (typeof apiError.rawMessage === "string") {
    parts.push(apiError.rawMessage);
  } else if (Array.isArray(apiError.rawMessage)) {
    parts.push(...apiError.rawMessage);
  }
  return parts.join(" ").toLowerCase();
}

export function isReminderLimitApiError(apiError: ApiError): boolean {
  if (apiError.statusCode === 409) {
    return true;
  }
  const haystack = collectApiErrorText(apiError);
  return (
    /\b50\b/.test(haystack) ||
    /limit/i.test(haystack) ||
    /maximum/i.test(haystack) ||
    /too many/i.test(haystack)
  );
}

export function toUserFacingReminderError(errorUnknown: unknown, fallback: string): string {
  if (errorUnknown instanceof ApiError && isReminderLimitApiError(errorUnknown)) {
    return REMINDER_LIMIT_GEORGIAN_MESSAGE;
  }
  if (errorUnknown instanceof Error && errorUnknown.message.trim() !== "") {
    return errorUnknown.message;
  }
  return fallback;
}
