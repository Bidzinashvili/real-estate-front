export function formatLifecycleDate(isoTimestamp: string | null | undefined): string | null {
  if (!isoTimestamp || isoTimestamp.trim() === "") {
    return null;
  }
  const parsed = new Date(isoTimestamp);
  if (Number.isNaN(parsed.getTime())) {
    return isoTimestamp;
  }
  return parsed.toLocaleDateString("ka-GE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatLifecycleDateTime(
  isoTimestamp: string | null | undefined,
): string | null {
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
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
