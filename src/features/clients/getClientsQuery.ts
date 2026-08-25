import type { ClientStatus } from "@/features/clients/clientEnums";
import { isClientStatus } from "@/features/clients/clientEnums";
import type { ClientsListResponse } from "@/features/clients/types";
import type {
  GetClientsQuery,
  ClientSortBy,
  SortOrder,
} from "@/features/clients/clientApi.types";
import { DEFAULT_CLIENT_LIST_FILTER_LOCK } from "@/features/clients/clientApi.types";

export type { GetClientsQuery, ClientSortBy, SortOrder };

export type ClientSortOrder = SortOrder;

export type ClientsListResult = ClientsListResponse;

export const DISTRICT_FILTER_MIN_LENGTH = 3;

export const DISTRICT_FILTER_DEBOUNCE_MS = 400;

export function isClientSortBy(value: string): value is ClientSortBy {
  return value === "createdAt" || value === "updatedAt" || value === "name";
}

export function isClientSortOrder(value: string): value is SortOrder {
  return value === "asc" || value === "desc";
}

function toLockedQueryJson(value: { value?: unknown; lock: string }): string {
  return JSON.stringify(value);
}

export function toGetClientsSearchParams(
  query: GetClientsQuery | undefined,
): Record<string, string> {
  if (!query) return {};

  const out: Record<string, string> = {};

  if (query.district !== undefined) {
    out.district = toLockedQueryJson(query.district);
  }
  if (query.budgetMin !== undefined) {
    out.budgetMin = toLockedQueryJson(query.budgetMin);
  }
  if (query.budgetMax !== undefined) {
    out.budgetMax = toLockedQueryJson(query.budgetMax);
  }
  if (query.dealType) {
    out.dealType = query.dealType;
  }
  if (query.status !== undefined) {
    out.status = toLockedQueryJson(query.status);
  }
  if (query.sortBy) {
    out.sortBy = query.sortBy;
  }
  if (query.order) {
    out.order = query.order;
  }
  if (query.page !== undefined && Number.isFinite(query.page)) {
    out.page = String(query.page);
  }
  if (query.limit !== undefined && Number.isFinite(query.limit)) {
    out.limit = String(query.limit);
  }
  if (query.archived === true) {
    out.archived = "true";
  } else if (query.archived === false) {
    out.archived = "false";
  }

  return out;
}

export function buildDistrictFilterParam(value: string): GetClientsQuery["district"] {
  const trimmed = value.trim();
  if (Array.from(trimmed).length < DISTRICT_FILTER_MIN_LENGTH) {
    return undefined;
  }
  return {
    value: trimmed,
    lock: DEFAULT_CLIENT_LIST_FILTER_LOCK,
  };
}

export function buildBudgetFilterParam(raw: string): GetClientsQuery["budgetMin"] {
  const trimmed = raw.trim();
  if (trimmed === "") {
    return undefined;
  }
  const parsedNumber = Number(trimmed);
  if (!Number.isFinite(parsedNumber)) {
    return undefined;
  }
  return {
    value: parsedNumber,
    lock: DEFAULT_CLIENT_LIST_FILTER_LOCK,
  };
}

export function buildStatusFilterParam(
  status: ClientStatus | "",
): GetClientsQuery["status"] {
  if (status === "" || !isClientStatus(status)) {
    return undefined;
  }
  return {
    value: status,
    lock: DEFAULT_CLIENT_LIST_FILTER_LOCK,
  };
}
