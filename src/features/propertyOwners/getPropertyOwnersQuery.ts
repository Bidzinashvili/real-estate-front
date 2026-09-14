export type GetPropertyOwnersQuery = {
  search?: string;
  page?: number;
  limit?: number;
};

export const PROPERTY_OWNERS_PAGE_LIMIT = 20;

export const PROPERTY_OWNERS_SEARCH_DEBOUNCE_MS = 400;

export function toGetPropertyOwnersSearchParams(
  query: GetPropertyOwnersQuery | undefined,
): Record<string, string> {
  if (!query) {
    return {};
  }

  const params: Record<string, string> = {};
  const search = query.search?.trim();
  if (search) {
    params.search = search;
  }
  if (query.page !== undefined) {
    params.page = String(query.page);
  }
  if (query.limit !== undefined) {
    params.limit = String(query.limit);
  }
  return params;
}
