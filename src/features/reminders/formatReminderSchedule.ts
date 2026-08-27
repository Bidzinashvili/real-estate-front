const TIME_FORMATTER = new Intl.DateTimeFormat("ka-GE", {
  hour: "2-digit",
  minute: "2-digit",
});

const DATE_TIME_FORMATTER = new Intl.DateTimeFormat("ka-GE", {
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
});

function startOfLocalDay(value: Date): Date {
  return new Date(value.getFullYear(), value.getMonth(), value.getDate());
}

function dayOffsetFromToday(value: Date, referenceNow: Date): number {
  const startOfValue = startOfLocalDay(value).getTime();
  const startOfToday = startOfLocalDay(referenceNow).getTime();
  return Math.round((startOfValue - startOfToday) / 86_400_000);
}

export function formatReminderDateTime(isoTimestamp: string): string {
  const parsed = new Date(isoTimestamp);
  if (Number.isNaN(parsed.getTime())) {
    return isoTimestamp;
  }
  return DATE_TIME_FORMATTER.format(parsed);
}

export function formatReminderScheduleLabel(
  isoTimestamp: string,
  referenceNow: Date = new Date(),
): string {
  const parsed = new Date(isoTimestamp);
  if (Number.isNaN(parsed.getTime())) {
    return isoTimestamp;
  }

  const timeLabel = TIME_FORMATTER.format(parsed);
  const offsetDays = dayOffsetFromToday(parsed, referenceNow);

  if (offsetDays === 0) {
    return `დღეს ${timeLabel}`;
  }
  if (offsetDays === 1) {
    return `ხვალ, ${timeLabel}`;
  }
  if (offsetDays === -1) {
    return `გუშინ, ${timeLabel}`;
  }

  return DATE_TIME_FORMATTER.format(parsed);
}

export function minutesUntilTomorrowMorning(referenceNow: Date = new Date()): number {
  const tomorrowMorning = new Date(referenceNow);
  tomorrowMorning.setDate(tomorrowMorning.getDate() + 1);
  tomorrowMorning.setHours(9, 0, 0, 0);
  const minutes = Math.round((tomorrowMorning.getTime() - referenceNow.getTime()) / 60_000);
  return Math.min(1440, Math.max(1, minutes));
}
