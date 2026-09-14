import type { DatabaseListScope } from "@/features/databaseList/databaseListScope";
import {
  serializeNumericRangeFilter,
  type NumericRangeFilter,
} from "@/features/databaseList/numericRangeFilter";
import type { DealType } from "@/features/properties/dealType";
import type { PropertyStatus } from "@/features/properties/propertyStatus";
import type { Property, PropertyType } from "@/features/properties/types";
import type { LockState } from "@/features/matching/matchingEnums";
import type { RecordColor } from "@/features/recordColor/recordColor";
import {
  appendRecordColorsToSearchParams,
  normalizeRecordColors,
} from "@/features/recordColor/recordColorQuery";

export type PropertiesListResult = {
  properties: Property[];
  total: number;
  page: number;
  limit: number;
  activeCount: number;
  scope: DatabaseListScope | null;
};

export type PropertySortBy = "createdAt" | "pricePublic" | "noteLastOpenedAt";

export type PropertyListSortOrder = "asc" | "desc";

const LIST_FILTER_LOCK: LockState = "locked";

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
  roomsRange?: NumericRangeFilter;
  bedrooms?: number;
  minArea?: number;
  maxArea?: number;
  floor?: number;
  floorRange?: NumericRangeFilter;
  totalFloors?: number;
  balcony?: boolean;
  yardArea?: number;
  houseArea?: number;
  landArea?: number;
  area?: number;
  sortBy?: PropertySortBy;
  order?: PropertyListSortOrder;
  page?: number;
  limit?: number;
  myProperties?: boolean;
  scope?: DatabaseListScope;
  archived?: boolean;
  createdFrom?: string;
  createdTo?: string;
  lastOpenedFrom?: string;
  lastOpenedTo?: string;
  neverOpened?: boolean;
  readyToUpload?: boolean;
  labelIds?: string[];
  labelNames?: string[];
  color?: RecordColor[];
  adminMode?: boolean;
};

export function isPropertySortBy(s: string): s is PropertySortBy {
  return s === "createdAt" || s === "pricePublic" || s === "noteLastOpenedAt";
}

export function isPropertyListSortOrder(s: string): s is PropertyListSortOrder {
  return s === "asc" || s === "desc";
}

const INT_FIELDS = [
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

function appendLockedValue(
  out: URLSearchParams,
  key: string,
  value: string | number | boolean | undefined,
) {
  if (value === undefined) {
    return;
  }
  if (typeof value === "string" && value.trim() === "") {
    return;
  }
  if (typeof value === "number" && !Number.isFinite(value)) {
    return;
  }
  out.set(key, JSON.stringify({ value, lock: LIST_FILTER_LOCK }));
}

function appendRangeParam(
  out: URLSearchParams,
  key: string,
  range: NumericRangeFilter | undefined,
) {
  const serialized = serializeNumericRangeFilter(range);
  if (!serialized) {
    return;
  }
  out.set(key, serialized);
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
  appendLockedValue(out, "type", query.type);
  appendLockedValue(out, "dealType", query.dealType);
  appendLockedValue(out, "status", query.status);
  appendLockedValue(out, "city", query.city);
  appendLockedValue(out, "district", query.district);
  appendString(out, "createdFrom", query.createdFrom);
  appendString(out, "createdTo", query.createdTo);
  if (query.neverOpened === true) {
    out.set("neverOpened", "true");
  } else {
    appendString(out, "lastOpenedFrom", query.lastOpenedFrom);
    appendString(out, "lastOpenedTo", query.lastOpenedTo);
  }

  appendLockedValue(out, "minPrice", query.minPrice);
  appendLockedValue(out, "maxPrice", query.maxPrice);
  appendLockedValue(out, "rooms", query.rooms);
  appendLockedValue(out, "bedrooms", query.bedrooms);
  appendLockedValue(out, "minArea", query.minArea);
  appendLockedValue(out, "maxArea", query.maxArea);
  appendLockedValue(out, "floor", query.floor);
  appendLockedValue(out, "totalFloors", query.totalFloors);
  appendLockedValue(out, "yardArea", query.yardArea);
  appendLockedValue(out, "houseArea", query.houseArea);
  appendLockedValue(out, "landArea", query.landArea);
  appendLockedValue(out, "area", query.area);

  for (const key of INT_FIELDS) {
    appendNumericQueryField(out, query, key);
  }

  appendRangeParam(out, "roomsRange", query.roomsRange);
  appendRangeParam(out, "floorRange", query.floorRange);

  if (query.balcony === true) {
    out.set("balcony", "true");
  } else if (query.balcony === false) {
    out.set("balcony", "false");
  }

  if (query.sortBy) out.set("sortBy", query.sortBy);
  if (query.order) out.set("order", query.order);
  if (query.myProperties === true) out.set("myProperties", "true");
  if (query.scope) out.set("scope", query.scope);
  if (query.archived === true) {
    out.set("archived", "true");
  } else if (query.archived === false) {
    out.set("archived", "false");
  }
  appendArray(out, "labelIds", query.labelIds);
  appendArray(out, "labelNames", query.labelNames);
  appendRecordColorsToSearchParams(out, normalizeRecordColors(query.color));
  if (query.adminMode === true) {
    out.set("adminMode", "true");
  }
  if (query.readyToUpload === true) {
    out.set("readyToUpload", "true");
  }

  return out;
}
