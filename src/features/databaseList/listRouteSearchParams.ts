const ARCHIVE_TAB_QUERY_KEY = "tab";

export function mergeListRouteSearchParams(
  pathname: string,
  currentSearchParams: URLSearchParams,
  listSearchParams: URLSearchParams,
): URLSearchParams {
  const merged = new URLSearchParams(listSearchParams.toString());
  if (pathname !== "/archive") {
    return merged;
  }
  const archiveTab = currentSearchParams.get(ARCHIVE_TAB_QUERY_KEY);
  if (archiveTab === "clients" || archiveTab === "properties") {
    merged.set(ARCHIVE_TAB_QUERY_KEY, archiveTab);
  }
  return merged;
}

export function listRouteQueryString(
  pathname: string,
  currentSearchParams: URLSearchParams,
  listSearchParams: URLSearchParams,
): string {
  return mergeListRouteSearchParams(pathname, currentSearchParams, listSearchParams).toString();
}
