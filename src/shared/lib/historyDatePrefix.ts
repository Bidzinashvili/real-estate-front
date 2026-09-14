import { formatHistoryDatePrefix } from "@/shared/lib/formatDate";

const EXISTING_DATE_PREFIX_PATTERN = /^\d{2}\.\d{2}\.\d{2} - /;

export function appendHistoryDateEntry(
  currentText: string,
  currentDate: Date = new Date(),
): string {
  const datePrefix = formatHistoryDatePrefix(currentDate);
  if (datePrefix === "") {
    return currentText;
  }
  if (currentText.trim() === "") {
    return datePrefix;
  }
  const separator = currentText.endsWith("\n") ? "" : "\n";
  return `${currentText}${separator}${datePrefix}`;
}

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
  if (EXISTING_DATE_PREFIX_PATTERN.test(rawValue)) {
    return rawValue;
  }
  return `${formatHistoryDatePrefix(currentDate)}${rawValue.trimStart()}`;
}
