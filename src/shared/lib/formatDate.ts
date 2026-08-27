export const TBILISI_TIME_ZONE = "Asia/Tbilisi";

type TbilisiDateParts = {
  day: string;
  month: string;
  yearTwoDigit: string;
  hour: string;
  minute: string;
};

function parseTimestamp(value: string | Date): Date | null {
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }
  const trimmedValue = value.trim();
  if (trimmedValue === "") {
    return null;
  }
  const parsedDate = new Date(trimmedValue);
  return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
}

export function getTbilisiDateParts(value: string | Date): TbilisiDateParts | null {
  const parsedDate = parseTimestamp(value);
  if (!parsedDate) {
    return null;
  }

  const formatter = new Intl.DateTimeFormat("en-GB", {
    timeZone: TBILISI_TIME_ZONE,
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  });
  const formattedParts = formatter.formatToParts(parsedDate);
  const readPart = (partType: Intl.DateTimeFormatPartTypes): string =>
    formattedParts.find((part) => part.type === partType)?.value ?? "";

  const day = readPart("day");
  const month = readPart("month");
  const yearTwoDigit = readPart("year");
  const hour = readPart("hour");
  const minute = readPart("minute");
  if (!day || !month || !yearTwoDigit || !hour || !minute) {
    return null;
  }

  return { day, month, yearTwoDigit, hour, minute };
}

export function formatTbilisiCompactDate(value: string | Date): string | null {
  const parts = getTbilisiDateParts(value);
  if (!parts) {
    return null;
  }
  return `${parts.day}.${parts.month}.${parts.yearTwoDigit}`;
}

export function formatTbilisiDateTime(value: string | Date): string | null {
  const parts = getTbilisiDateParts(value);
  if (!parts) {
    return null;
  }
  return `${parts.day}.${parts.month}.${parts.yearTwoDigit}, ${parts.hour}:${parts.minute}`;
}

export function formatNoteDate(date: Date = new Date()): string {
  return formatTbilisiCompactDate(date) ?? "";
}

export function formatHistoryDatePrefix(date: Date = new Date()): string {
  const compactDate = formatNoteDate(date);
  if (compactDate === "") {
    return "";
  }
  return `${compactDate} - `;
}
