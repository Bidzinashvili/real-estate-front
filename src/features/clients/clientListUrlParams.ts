import type { DealType, ClientStatus } from "@/features/clients/clientEnums";
import { isClientStatus, isDealType } from "@/features/clients/clientEnums";
import type { ClientSortBy, SortOrder } from "@/features/clients/clientApi.types";
import { isClientSortBy, isClientSortOrder } from "@/features/clients/getClientsQuery";
import {
  DEFAULT_DATABASE_LIST_SCOPE,
  parseDatabaseListScope,
  type DatabaseListScope,
} from "@/features/databaseList/databaseListScope";
import { resolveCreatedDateQuery } from "@/features/databaseList/createdDateRange";

export const CLIENT_LIST_DEFAULT_LIMIT = 20;
export const CLIENT_LIST_SEARCH_DEBOUNCE_MS = 300;

export type ClientListUrlState = {
  searchInput: string;
  district: string;
  budgetMinInput: string;
  budgetMaxInput: string;
  dealType: DealType | "";
  status: ClientStatus | "";
  createdFrom: string;
  createdTo: string;
  sortBy: ClientSortBy;
  order: SortOrder;
  page: number;
  listScope: DatabaseListScope;
};

export type ClientListDebouncedState = Pick<
  ClientListUrlState,
  "searchInput" | "district" | "budgetMinInput" | "budgetMaxInput"
>;

export const DEFAULT_CLIENT_LIST_URL_STATE: ClientListUrlState = {
  searchInput: "",
  district: "",
  budgetMinInput: "",
  budgetMaxInput: "",
  dealType: "",
  status: "",
  createdFrom: "",
  createdTo: "",
  sortBy: "createdAt",
  order: "desc",
  page: 1,
  listScope: DEFAULT_DATABASE_LIST_SCOPE,
};

export function pickClientListDebouncedState(
  state: ClientListUrlState,
): ClientListDebouncedState {
  return {
    searchInput: state.searchInput,
    district: state.district,
    budgetMinInput: state.budgetMinInput,
    budgetMaxInput: state.budgetMaxInput,
  };
}

export function areClientListDebouncedEqual(
  previous: ClientListDebouncedState,
  next: ClientListDebouncedState,
): boolean {
  return (
    previous.searchInput === next.searchInput &&
    previous.district === next.district &&
    previous.budgetMinInput === next.budgetMinInput &&
    previous.budgetMaxInput === next.budgetMaxInput
  );
}

function parsePositiveInt(raw: string | null, fallback: number): number {
  if (raw === null || raw === "") return fallback;
  const parsedInt = Number.parseInt(raw, 10);
  return Number.isFinite(parsedInt) && parsedInt > 0 ? parsedInt : fallback;
}

export function parseClientListUrl(
  searchParams: URLSearchParams,
): ClientListUrlState {
  const next = { ...DEFAULT_CLIENT_LIST_URL_STATE };

  const search = searchParams.get("search");
  if (search) next.searchInput = search;

  const district = searchParams.get("district");
  if (district) next.district = district;

  const budgetMin = searchParams.get("budgetMin");
  if (budgetMin) next.budgetMinInput = budgetMin;
  const budgetMax = searchParams.get("budgetMax");
  if (budgetMax) next.budgetMaxInput = budgetMax;

  const dealType = searchParams.get("dealType");
  if (dealType && isDealType(dealType)) next.dealType = dealType;

  const status = searchParams.get("status");
  if (status && isClientStatus(status)) next.status = status;

  const createdFrom = searchParams.get("createdFrom");
  if (createdFrom) next.createdFrom = createdFrom;
  const createdTo = searchParams.get("createdTo");
  if (createdTo) next.createdTo = createdTo;

  const sortBy = searchParams.get("sortBy");
  if (sortBy && isClientSortBy(sortBy)) next.sortBy = sortBy;

  const order = searchParams.get("order");
  if (order && isClientSortOrder(order)) next.order = order;

  next.page = parsePositiveInt(searchParams.get("page"), 1);
  next.listScope = parseDatabaseListScope(searchParams.get("scope"));

  return next;
}

export function clientListUrlStateToSearchParams(
  state: ClientListUrlState,
): URLSearchParams {
  const params = new URLSearchParams();
  const trimmedSearch = state.searchInput.trim();
  if (trimmedSearch) params.set("search", trimmedSearch);
  const trimmedDistrict = state.district.trim();
  if (trimmedDistrict) params.set("district", trimmedDistrict);
  if (state.budgetMinInput.trim()) params.set("budgetMin", state.budgetMinInput.trim());
  if (state.budgetMaxInput.trim()) params.set("budgetMax", state.budgetMaxInput.trim());
  if (state.dealType) params.set("dealType", state.dealType);
  if (state.status) params.set("status", state.status);
  const createdDates = resolveCreatedDateQuery(state.createdFrom, state.createdTo);
  if (!createdDates.error && createdDates.createdFrom) {
    params.set("createdFrom", createdDates.createdFrom);
  }
  if (!createdDates.error && createdDates.createdTo) {
    params.set("createdTo", createdDates.createdTo);
  }
  if (state.sortBy !== DEFAULT_CLIENT_LIST_URL_STATE.sortBy) {
    params.set("sortBy", state.sortBy);
  }
  if (state.order !== DEFAULT_CLIENT_LIST_URL_STATE.order) {
    params.set("order", state.order);
  }
  if (state.page > 1) params.set("page", String(state.page));
  if (state.listScope !== DEFAULT_DATABASE_LIST_SCOPE) {
    params.set("scope", state.listScope);
  }
  return params;
}

export function countClientAdvancedFilters(state: ClientListUrlState): number {
  return state.status ? 1 : 0;
}

export function hasClearableClientFilters(state: ClientListUrlState): boolean {
  if (state.searchInput.trim()) return true;
  if (state.district.trim()) return true;
  if (state.budgetMinInput.trim() || state.budgetMaxInput.trim()) return true;
  if (state.dealType) return true;
  if (state.createdFrom.trim() || state.createdTo.trim()) return true;
  return countClientAdvancedFilters(state) > 0;
}
