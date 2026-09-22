import { formatHistoryDatePrefix } from "@/shared/lib/formatDate";

const EXISTING_DATE_PREFIX_PATTERN = /^\d{2}\.\d{2}\.\d{2} - /;

export function applyEmptyHistoryDatePrefix(
  previousValue: string,
  rawValue: string,
  currentDate: Date = new Date(),
): string {
  if (previousValue.trim() !== "") {
    return rawValue;
  }
  if (rawValue.trim() === "") {
    return rawValue;
  }
  if (EXISTING_DATE_PREFIX_PATTERN.test(rawValue.trimStart())) {
    return rawValue;
  }
  return `${formatHistoryDatePrefix(currentDate)}${rawValue.trimStart()}`;
}

export function refreshLeadingHistoryDate(
  currentText: string,
  currentDate: Date = new Date(),
): string {
  const datePrefix = formatHistoryDatePrefix(currentDate);
  if (datePrefix === "") {
    return currentText;
  }
  if (!EXISTING_DATE_PREFIX_PATTERN.test(currentText)) {
    return currentText;
  }
  return currentText.replace(EXISTING_DATE_PREFIX_PATTERN, datePrefix);
}

function isCaretInsideLeadingDate(
  text: string,
  caretStart: number,
  caretEnd: number,
): boolean {
  const datePrefixMatch = text.match(EXISTING_DATE_PREFIX_PATTERN);
  if (!datePrefixMatch) {
    return false;
  }
  const prefixLength = datePrefixMatch[0].length;
  return Math.min(caretStart, caretEnd) < prefixLength;
}

export function applyHistoryNoteTextChange(options: {
  previousValue: string;
  rawValue: string;
  caretStart: number;
  caretEnd: number;
  shouldRefreshLeadingDate: boolean;
  currentDate?: Date;
}): string {
  const {
    previousValue,
    rawValue,
    caretStart,
    caretEnd,
    shouldRefreshLeadingDate,
    currentDate = new Date(),
  } = options;

  const isReplacingAll =
    previousValue.length > 0 &&
    caretStart <= 0 &&
    caretEnd >= previousValue.length;

  if (previousValue.trim() === "" || isReplacingAll) {
    return applyEmptyHistoryDatePrefix("", rawValue, currentDate);
  }

  if (
    !shouldRefreshLeadingDate ||
    isCaretInsideLeadingDate(previousValue, caretStart, caretEnd) ||
    previousValue.trim() === rawValue.trim()
  ) {
    return rawValue;
  }

  return refreshLeadingHistoryDate(rawValue, currentDate);
}
