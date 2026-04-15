import type { DealType, ClientStatus } from "@/features/clients/clientEnums";
import type { ClientsListResponse } from "@/features/clients/types";
import type { JsonValue } from "@/shared/lib/jsonValue";
import type {
  GetClientsQuery,
  ClientSortBy,
  SortOrder,
} from "@/features/clients/clientApi.types";
import { DEFAULT_CLIENT_LIST_FILTER_LOCK } from "@/features/clients/clientApi.types";

export type { GetClientsQuery, ClientSortBy, SortOrder };

export type ClientSortOrder = SortOrder;

export type ClientsListResult = ClientsListResponse;

export function isClientSortBy(value: string): value is ClientSortBy {
  return value === "createdAt" || value === "updatedAt" || value === "name";
}

export function isClientSortOrder(value: string): value is SortOrder {
  return value === "asc" || value === "desc";
}

function encodeJsonParam(value: JsonValue): string {
  return encodeURIComponent(JSON.stringify(value));
}

export function toGetClientsSearchParams(
  query: GetClientsQuery | undefined,
): Record<string, string> {
  if (!query) return {};

  const out: Record<string, string> = {};

  if (query.district !== undefined) {
    out.district = encodeJsonParam(query.district);
  }
  if (query.budgetMin !== undefined) {
    out.budgetMin = encodeJsonParam(query.budgetMin);
  }
  if (query.budgetMax !== undefined) {
    out.budgetMax = encodeJsonParam(query.budgetMax);
  }
  if (query.dealType) {
    out.dealType = query.dealType;
  }
  if (query.status !== undefined) {
    out.status = encodeJsonParam(query.status);
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

  return out;
}

export function buildDistrictFilterParam(value: string): GetClientsQuery["district"] {
  const trimmed = value.trim();
  if (!trimmed) {
    return undefined;
  }
  return {
    value: trimmed,
    lock: DEFAULT_CLIENT_LIST_FILTER_LOCK,
  };
}

export function buildBudgetFilterParam(
  raw: string,
): GetClientsQuery["budgetMin"] | GetClientsQuery["budgetMax"] {
  const trimmed = raw.trim();
  if (trimmed === "") {
    return undefined;
  }
  const parsed = Number(trimmed);
  if (!Number.isFinite(parsed)) {
    return undefined;
  }
  return {
    value: parsed,
    lock: DEFAULT_CLIENT_LIST_FILTER_LOCK,
  };
}

export function buildStatusFilterParam(
  status: ClientStatus | "",
): GetClientsQuery["status"] {
  if (status === "") {
    return undefined;
  }
  return {
    value: status,
    lock: DEFAULT_CLIENT_LIST_FILTER_LOCK,
  };
}
