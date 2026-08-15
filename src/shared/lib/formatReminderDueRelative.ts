const MINUTE_MS = 60_000;
const HOUR_MS = 3_600_000;
const DAY_MS = 86_400_000;
const LONG_HORIZON_MS = 14 * DAY_MS;

function formatCount(count: number, unit: string): string {
  return `${count} ${unit}`;
}

function joinNatural(parts: string[]): string {
  if (parts.length === 0) {
    return "";
  }
  if (parts.length === 1) {
    return parts[0]!;
  }
  if (parts.length === 2) {
    return `${parts[0]} და ${parts[1]}`;
  }
  return `${parts.slice(0, -1).join(", ")} და ${parts[parts.length - 1]}`;
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

function withRelative(isFuture: boolean, label: string): string {
  return isFuture ? `${label}ში` : `${label}ის წინ`;
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
    return isFuture ? "ერთ წუთზე ნაკლებში" : "ახლახან";
  }

  if (absMs < HOUR_MS) {
    const minutesTotal = Math.max(1, Math.ceil(absMs / MINUTE_MS));
    const label = formatCount(minutesTotal, "წუთ");
    return withRelative(isFuture, label);
  }

  if (absMs < 24 * HOUR_MS) {
    const hoursTotal = Math.max(1, Math.ceil(absMs / HOUR_MS));
    const label = formatCount(hoursTotal, "საათ");
    return withRelative(isFuture, label);
  }

  if (absMs < LONG_HORIZON_MS) {
    const daysTotal = Math.max(1, Math.ceil(absMs / DAY_MS));
    return isFuture ? `${daysTotal} დღეში` : `${daysTotal} დღის წინ`;
  }

  const earlier = isFuture ? referenceNow : due;
  const later = isFuture ? due : referenceNow;
  const { years, months, days } = calendarComponentsUntil(earlier, later);

  const segments: string[] = [];
  if (years > 0) segments.push(formatCount(years, "წელი"));
  if (months > 0) segments.push(formatCount(months, "თვე"));
  if (days > 0) segments.push(formatCount(days, "დღე"));

  const core = joinNatural(segments);
  if (core === "") {
    const hoursTotal = Math.max(1, Math.ceil(absMs / HOUR_MS));
    const label = formatCount(hoursTotal, "საათ");
    return withRelative(isFuture, label);
  }

  return isFuture ? `${core}ში` : `${core}ის წინ`;
}
