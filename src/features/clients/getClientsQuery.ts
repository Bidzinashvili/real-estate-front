import type { DealType, ClientStatus } from "@/features/clients/clientEnums";
import type { ClientsListResponse } from "@/features/clients/types";

export type ClientSortBy = "createdAt" | "updatedAt" | "name";
export type ClientSortOrder = "asc" | "desc";

export type GetClientsQuery = {
  district?: string;
  budgetMin?: number;
  budgetMax?: number;
  dealType?: DealType;
  status?: ClientStatus;
  sortBy?: ClientSortBy;
  order?: ClientSortOrder;
  page?: number;
  limit?: number;
};

export type ClientsListResult = ClientsListResponse;

export function isClientSortBy(value: string): value is ClientSortBy {
  return value === "createdAt" || value === "updatedAt" || value === "name";
}

export function isClientSortOrder(value: string): value is ClientSortOrder {
  return value === "asc" || value === "desc";
}

export function toGetClientsSearchParams(
  query: GetClientsQuery | undefined,
): Record<string, string> {
  if (!query) return {};

  const out: Record<string, string> = {};

  if (query.district?.trim()) out.district = query.district.trim();
  if (query.dealType) out.dealType = query.dealType;
  if (query.status) out.status = query.status;
  if (query.sortBy) out.sortBy = query.sortBy;
  if (query.order) out.order = query.order;

  if (query.budgetMin !== undefined && Number.isFinite(query.budgetMin)) {
    out.budgetMin = String(query.budgetMin);
  }
  if (query.budgetMax !== undefined && Number.isFinite(query.budgetMax)) {
    out.budgetMax = String(query.budgetMax);
  }
  if (query.page !== undefined && Number.isFinite(query.page)) {
    out.page = String(query.page);
  }
  if (query.limit !== undefined && Number.isFinite(query.limit)) {
    out.limit = String(query.limit);
  }

  return out;
}
