export type GetClientProfilesQuery = {
  search?: string;
  blacklisted?: boolean;
  page?: number;
  limit?: number;
};

export const CLIENT_PROFILES_PAGE_LIMIT = 20;

export const CLIENT_PROFILES_SEARCH_DEBOUNCE_MS = 400;

export function toGetClientProfilesSearchParams(
  query: GetClientProfilesQuery | undefined,
): Record<string, string> {
  if (!query) {
    return {};
  }

  const params: Record<string, string> = {};
  const search = query.search?.trim();
  if (search) {
    params.search = search;
  }
  if (query.blacklisted !== undefined) {
    params.blacklisted = query.blacklisted ? "true" : "false";
  }
  if (query.page !== undefined) {
    params.page = String(query.page);
  }
  if (query.limit !== undefined) {
    params.limit = String(query.limit);
  }
  return params;
}
