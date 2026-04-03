export function resolveApiMediaUrl(
  url: string,
  apiBaseUrl: string | null,
): string {
  const trimmed = url.trim();
  if (!trimmed) {
    return "";
  }
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  if (!apiBaseUrl) {
    return trimmed;
  }
  const base = apiBaseUrl.replace(/\/$/, "");
  const path = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  return `${base}${path}`;
}
