const MINUTE_MS = 60_000;
const HOUR_MS = 3_600_000;
const DAY_MS = 86_400_000;
const LONG_HORIZON_MS = 14 * DAY_MS;

function pluralize(count: number, singular: string, plural: string): string {
  return `${count} ${count === 1 ? singular : plural}`;
}

function joinNatural(parts: string[]): string {
  if (parts.length === 0) {
    return "";
  }
  if (parts.length === 1) {
    return parts[0]!;
  }
  if (parts.length === 2) {
    return `${parts[0]} and ${parts[1]}`;
  }
  return `${parts.slice(0, -1).join(", ")} and ${parts[parts.length - 1]}`;
}

function calendarComponentsUntil(earlier: Date, later: Date): {
  years: number;
  months: number;
  days: number;
} {
  let years = 0;
  let months = 0;
  let days = 0;
  let cursor = new Date(earlier.getTime());
  const endMs = later.getTime();

  while (true) {
    const nextYear = new Date(cursor);
    nextYear.setFullYear(nextYear.getFullYear() + 1);
    if (nextYear.getTime() > endMs) break;
    cursor = nextYear;
    years += 1;
  }

  while (true) {
    const nextMonth = new Date(cursor);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    if (nextMonth.getTime() > endMs) break;
    cursor = nextMonth;
    months += 1;
  }

  while (true) {
    const nextDay = new Date(cursor);
    nextDay.setDate(nextDay.getDate() + 1);
    if (nextDay.getTime() > endMs) break;
    cursor = nextDay;
    days += 1;
  }

  return { years, months, days };
}

export function formatReminderDueRelative(
  isoTimestamp: string,
  referenceNow: Date = new Date(),
): string {
  const due = new Date(isoTimestamp);
  if (Number.isNaN(due.getTime())) {
    return isoTimestamp;
  }

  const diffMs = due.getTime() - referenceNow.getTime();
  const isFuture = diffMs >= 0;
  const absMs = Math.abs(diffMs);

  if (absMs < MINUTE_MS) {
    return isFuture ? "in less than a minute" : "just now";
  }

  if (absMs < HOUR_MS) {
    const minutesTotal = Math.max(1, Math.ceil(absMs / MINUTE_MS));
    const label = minutesTotal === 1 ? "1 min" : `${minutesTotal} mins`;
    return isFuture ? `in ${label}` : `${label} ago`;
  }

  if (absMs < 24 * HOUR_MS) {
    const hoursTotal = Math.max(1, Math.ceil(absMs / HOUR_MS));
    const label = pluralize(hoursTotal, "hour", "hours");
    return isFuture ? `in ${label}` : `${label} ago`;
  }

  if (absMs < LONG_HORIZON_MS) {
    const daysTotal = Math.max(1, Math.ceil(absMs / DAY_MS));
    const label = pluralize(daysTotal, "day", "days");
    return isFuture ? `in ${label}` : `${label} ago`;
  }

  const earlier = isFuture ? referenceNow : due;
  const later = isFuture ? due : referenceNow;
  const { years, months, days } = calendarComponentsUntil(earlier, later);

  const segments: string[] = [];
  if (years > 0) segments.push(pluralize(years, "year", "years"));
  if (months > 0) segments.push(pluralize(months, "month", "months"));
  if (days > 0) segments.push(pluralize(days, "day", "days"));

  const core = joinNatural(segments);
  if (core === "") {
    const hoursTotal = Math.max(1, Math.ceil(absMs / HOUR_MS));
    const label = pluralize(hoursTotal, "hour", "hours");
    return isFuture ? `in ${label}` : `${label} ago`;
  }

  return isFuture ? `in ${core}` : `${core} ago`;
}
