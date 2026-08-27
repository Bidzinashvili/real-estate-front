export function formatHiddenAt(isoTimestamp: string | null | undefined): string | null {
  if (!isoTimestamp || isoTimestamp.trim() === "") {
    return null;
  }
  const parsed = new Date(isoTimestamp);
  if (Number.isNaN(parsed.getTime())) {
    return isoTimestamp;
  }
  return parsed.toLocaleString("ka-GE", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}
