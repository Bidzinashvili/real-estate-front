import type { DealType } from "@/features/properties/dealType";
import type { Property, PropertyType } from "@/features/properties/types";

export type PropertiesListResult = {
  properties: Property[];
  total: number;
  page: number;
  limit: number;
};

export type PropertySortBy = "createdAt" | "pricePublic";

export type PropertyListSortOrder = "asc" | "desc";

export type GetPropertiesQuery = {
  search?: string;
  type?: PropertyType;
  dealType?: DealType;
  city?: string;
  district?: string;
  minPrice?: number;
  maxPrice?: number;
  rooms?: number;
  bedrooms?: number;
  minArea?: number;
  maxArea?: number;
  floor?: number;
  yardArea?: number;
  houseArea?: number;
  landArea?: number;
  area?: number;
  sortBy?: PropertySortBy;
  order?: PropertyListSortOrder;
  page?: number;
  limit?: number;
  myProperties?: boolean;
};

export function isPropertySortBy(s: string): s is PropertySortBy {
  return s === "createdAt" || s === "pricePublic";
}

export function isPropertyListSortOrder(s: string): s is PropertyListSortOrder {
  return s === "asc" || s === "desc";
}

const INT_FIELDS = [
  "minPrice",
  "maxPrice",
  "rooms",
  "bedrooms",
  "minArea",
  "maxArea",
  "floor",
  "yardArea",
  "houseArea",
  "landArea",
  "area",
  "page",
  "limit",
] as const satisfies ReadonlyArray<keyof GetPropertiesQuery>;

type IntFieldKey = (typeof INT_FIELDS)[number];

function appendString(
  out: Record<string, string>,
  key: string,
  value: string | undefined,
) {
  const trimmed = typeof value === "string" ? value.trim() : "";
  if (trimmed === "") return;
  out[key] = trimmed;
}

function appendNumber(
  out: Record<string, string>,
  key: string,
  value: number | undefined,
) {
  if (value === undefined || !Number.isFinite(value)) return;
  out[key] = String(value);
}

function appendNumericQueryField(
  out: Record<string, string>,
  query: GetPropertiesQuery,
  key: IntFieldKey,
) {
  appendNumber(out, key, query[key]);
}

export function toGetPropertiesSearchParams(
  query: GetPropertiesQuery | undefined,
): Record<string, string> {
  if (!query) return {};

  const out: Record<string, string> = {};

  appendString(out, "search", query.search);
  if (query.type) out.type = query.type;
  if (query.dealType) out.dealType = query.dealType;
  appendString(out, "city", query.city);
  appendString(out, "district", query.district);

  for (const key of INT_FIELDS) {
    appendNumericQueryField(out, query, key);
  }

  if (query.sortBy) out.sortBy = query.sortBy;
  if (query.order) out.order = query.order;
  if (query.myProperties === true) out.myProperties = "true";

  return out;
}
