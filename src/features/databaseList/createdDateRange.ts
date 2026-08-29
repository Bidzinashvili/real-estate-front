export const CALENDAR_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export const CREATED_DATE_RANGE_ERROR =
  "დაწყების თარიღი არ უნდა აღემატებოდეს დასრულების თარიღს.";

export function isCalendarDate(value: string): boolean {
  const trimmed = value.trim();
  if (!CALENDAR_DATE_PATTERN.test(trimmed)) {
    return false;
  }

  const year = Number(trimmed.slice(0, 4));
  const month = Number(trimmed.slice(5, 7));
  const day = Number(trimmed.slice(8, 10));
  const calendarDate = new Date(year, month - 1, day);

  return (
    calendarDate.getFullYear() === year &&
    calendarDate.getMonth() === month - 1 &&
    calendarDate.getDate() === day
  );
}

export function formatLocalCalendarDate(date: Date): string {
  const year = String(date.getFullYear());
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function addCalendarDays(date: Date, days: number): Date {
  const nextDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate;
}

export type CreatedDateQuery = {
  createdFrom?: string;
  createdTo?: string;
  error: string | null;
};

export function resolveCreatedDateQuery(
  createdFromInput: string,
  createdToInput: string,
): CreatedDateQuery {
  const createdFrom = createdFromInput.trim();
  const createdTo = createdToInput.trim();

  if (createdFrom && !isCalendarDate(createdFrom)) {
    return { error: "არასწორი დაწყების თარიღი." };
  }
  if (createdTo && !isCalendarDate(createdTo)) {
    return { error: "არასწორი დასრულების თარიღი." };
  }
  if (createdFrom && createdTo && createdFrom > createdTo) {
    return { error: CREATED_DATE_RANGE_ERROR };
  }

  return {
    createdFrom: createdFrom || undefined,
    createdTo: createdTo || undefined,
    error: null,
  };
}

export function resolveLastOpenedDateQuery(
  lastOpenedFromInput: string,
  lastOpenedToInput: string,
): {
  lastOpenedFrom?: string;
  lastOpenedTo?: string;
  error: string | null;
} {
  const resolved = resolveCreatedDateQuery(lastOpenedFromInput, lastOpenedToInput);
  return {
    lastOpenedFrom: resolved.createdFrom,
    lastOpenedTo: resolved.createdTo,
    error: resolved.error,
  };
}

export type CreatedDatePreset = "today" | "last7" | "last30";

export function createdDatePresetRange(
  preset: CreatedDatePreset,
  now: Date = new Date(),
): { createdFrom: string; createdTo: string } {
  const today = formatLocalCalendarDate(now);
  if (preset === "today") {
    return { createdFrom: today, createdTo: today };
  }
  const daysBack = preset === "last7" ? 6 : 29;
  return {
    createdFrom: formatLocalCalendarDate(addCalendarDays(now, -daysBack)),
    createdTo: today,
  };
}
