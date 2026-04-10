function padTwoDigits(value: number): string {
  return String(value).padStart(2, "0");
}

export function isoToDatetimeLocalValue(iso: string | null | undefined): string {
  if (typeof iso !== "string" || iso.trim() === "") {
    return "";
  }
  const parsed = new Date(iso);
  if (Number.isNaN(parsed.getTime())) {
    return "";
  }
  const year = parsed.getFullYear();
  const month = padTwoDigits(parsed.getMonth() + 1);
  const day = padTwoDigits(parsed.getDate());
  const hours = padTwoDigits(parsed.getHours());
  const minutes = padTwoDigits(parsed.getMinutes());
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export function datetimeLocalValueToIso(local: string): string | null {
  const trimmed = local.trim();
  if (trimmed === "") {
    return null;
  }
  const parsed = new Date(trimmed);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }
  return parsed.toISOString();
}
