import type { ClientStatus } from "@/features/clients/clientEnums";
import { isClientStatus } from "@/features/clients/clientEnums";
import type { ClientsListResponse } from "@/features/clients/types";
import type {
  GetClientsQuery,
  ClientSortBy,
  SortOrder,
} from "@/features/clients/clientApi.types";
import { DEFAULT_CLIENT_LIST_FILTER_LOCK } from "@/features/clients/clientApi.types";
import {
  appendRecordColorsToSearchParams,
  normalizeRecordColors,
} from "@/features/recordColor/recordColorQuery";

export type { GetClientsQuery, ClientSortBy, SortOrder };

export type ClientSortOrder = SortOrder;

export type ClientsListResult = ClientsListResponse;

export const DISTRICT_FILTER_MIN_LENGTH = 3;

export const DISTRICT_FILTER_DEBOUNCE_MS = 400;

export function isClientSortBy(value: string): value is ClientSortBy {
  return (
    value === "createdAt" ||
    value === "updatedAt" ||
    value === "name" ||
    value === "noteLastOpenedAt"
  );
}

export function isClientSortOrder(value: string): value is SortOrder {
  return value === "asc" || value === "desc";
}

function toLockedQueryJson(value: { value?: unknown; lock: string }): string {
  return JSON.stringify(value);
}

export function toGetClientsSearchParams(
  query: GetClientsQuery | undefined,
): URLSearchParams {
  const out = new URLSearchParams();
  if (!query) return out;

  const trimmedSearch = query.search?.trim() ?? "";
  if (trimmedSearch !== "") {
    out.set("search", trimmedSearch);
  }
  if (query.createdFrom) {
    out.set("createdFrom", query.createdFrom);
  }
  if (query.createdTo) {
    out.set("createdTo", query.createdTo);
  }
  if (query.neverOpened === true) {
    out.set("neverOpened", "true");
  } else {
    if (query.lastOpenedFrom) {
      out.set("lastOpenedFrom", query.lastOpenedFrom);
    }
    if (query.lastOpenedTo) {
      out.set("lastOpenedTo", query.lastOpenedTo);
    }
  }
  if (query.district !== undefined) {
    out.set("district", toLockedQueryJson(query.district));
  }
  if (query.budgetMin !== undefined) {
    out.set("budgetMin", toLockedQueryJson(query.budgetMin));
  }
  if (query.budgetMax !== undefined) {
    out.set("budgetMax", toLockedQueryJson(query.budgetMax));
  }
  if (query.dealType) {
    out.set("dealType", query.dealType);
  }
  if (query.status !== undefined) {
    out.set("status", toLockedQueryJson(query.status));
  }
  if (query.sortBy) {
    out.set("sortBy", query.sortBy);
  }
  if (query.order) {
    out.set("order", query.order);
  }
  if (query.page !== undefined && Number.isFinite(query.page)) {
    out.set("page", String(query.page));
  }
  if (query.limit !== undefined && Number.isFinite(query.limit)) {
    out.set("limit", String(query.limit));
  }
  if (query.archived === true) {
    out.set("archived", "true");
  } else if (query.archived === false) {
    out.set("archived", "false");
  }
  if (query.scope) {
    out.set("scope", query.scope);
  }
  appendRecordColorsToSearchParams(out, normalizeRecordColors(query.color));
  if (query.adminMode === true) {
    out.set("adminMode", "true");
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
