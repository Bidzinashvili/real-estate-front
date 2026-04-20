import type { DealType } from "@/features/properties/dealType";
import type { PropertyStatus } from "@/features/properties/propertyStatus";
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
  status?: PropertyStatus;
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
  labelIds?: string[];
  labelNames?: string[];
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
  out: URLSearchParams,
  key: string,
  value: string | undefined,
) {
  const trimmed = typeof value === "string" ? value.trim() : "";
  if (trimmed === "") return;
  out.set(key, trimmed);
}

function appendNumber(
  out: URLSearchParams,
  key: string,
  value: number | undefined,
) {
  if (value === undefined || !Number.isFinite(value)) return;
  out.set(key, String(value));
}

function appendNumericQueryField(
  out: URLSearchParams,
  query: GetPropertiesQuery,
  key: IntFieldKey,
) {
  appendNumber(out, key, query[key]);
}

function appendArray(
  out: URLSearchParams,
  key: string,
  values: string[] | undefined,
) {
  if (!Array.isArray(values)) {
    return;
  }

  for (const rawValue of values) {
    const trimmedValue = typeof rawValue === "string" ? rawValue.trim() : "";
    if (trimmedValue === "") {
      continue;
    }

    out.append(key, trimmedValue);
  }
}

export function toGetPropertiesSearchParams(
  query: GetPropertiesQuery | undefined,
): URLSearchParams {
  if (!query) return new URLSearchParams();

  const out = new URLSearchParams();

  appendString(out, "search", query.search);
  if (query.type) out.set("type", query.type);
  if (query.dealType) out.set("dealType", query.dealType);
  if (query.status) out.set("status", query.status);
  appendString(out, "city", query.city);
  appendString(out, "district", query.district);

  for (const key of INT_FIELDS) {
    appendNumericQueryField(out, query, key);
  }

  if (query.sortBy) out.set("sortBy", query.sortBy);
  if (query.order) out.set("order", query.order);
  if (query.myProperties === true) out.set("myProperties", "true");
  appendArray(out, "labelIds", query.labelIds);
  appendArray(out, "labelNames", query.labelNames);

  return out;
}
