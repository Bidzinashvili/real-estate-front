import type { DealType } from "@/features/properties/dealType";
import { isDealType } from "@/features/properties/dealType";
import type { PropertyStatus } from "@/features/properties/propertyStatus";
import { isPropertyStatus } from "@/features/properties/propertyStatus";
import {
  isPropertyListSortOrder,
  isPropertySortBy,
  type GetPropertiesQuery,
  type PropertyListSortOrder,
  type PropertySortBy,
} from "@/features/properties/getPropertiesQuery";
import { isPropertyType, type PropertyType } from "@/features/properties/types";
import {
  parseDecimalInput,
  parseIntegerInput,
} from "@/shared/lib/parseNumericInput";
import {
  DEFAULT_DATABASE_LIST_SCOPE,
  parseDatabaseListScope,
  type DatabaseListScope,
} from "@/features/databaseList/databaseListScope";
import { resolveCreatedDateQuery, resolveLastOpenedDateQuery } from "@/features/databaseList/createdDateRange";
import {
  parseNumericRangeFilter,
  serializeNumericRangeFilter,
  toNumericRangeFilter,
} from "@/features/databaseList/numericRangeFilter";
import type { RecordColor } from "@/features/recordColor/recordColor";
import {
  appendRecordColorsToSearchParams,
  parseRecordColorsFromSearchParams,
} from "@/features/recordColor/recordColorQuery";

export const CATALOG_LIMIT_OPTIONS = [10, 20, 50] as const;

export type PropertyBalconyFilter = "" | "true" | "false";

export type PropertyCatalogUrlState = {
  searchInput: string;
  showMyProperties: boolean;
  listScope: DatabaseListScope;
  showArchived: boolean;
  selectedLabelIds: string[];
  selectedLabelNames: string[];
  selectedColors: RecordColor[];
  dealType: DealType | "";
  lifecycleStatus: PropertyStatus | "";
  propertyType: PropertyType | "";
  city: string;
  district: string;
  minPrice: string;
  maxPrice: string;
  minArea: string;
  maxArea: string;
  roomsFrom: string;
  roomsTo: string;
  bedrooms: string;
  floorFrom: string;
  floorTo: string;
  totalFloors: string;
  balcony: PropertyBalconyFilter;
  yardArea: string;
  houseArea: string;
  landArea: string;
  commercialArea: string;
  createdFrom: string;
  createdTo: string;
  lastOpenedFrom: string;
  lastOpenedTo: string;
  neverOpened: boolean;
  readyToUpload: boolean;
  sortBy: PropertySortBy;
  order: PropertyListSortOrder;
  page: number;
  limit: number;
};

export type CatalogDebouncedTextState = Pick<
  PropertyCatalogUrlState,
  | "searchInput"
  | "city"
  | "district"
  | "minPrice"
  | "maxPrice"
  | "minArea"
  | "maxArea"
  | "roomsFrom"
  | "roomsTo"
  | "bedrooms"
  | "floorFrom"
  | "floorTo"
  | "totalFloors"
  | "yardArea"
  | "houseArea"
  | "landArea"
  | "commercialArea"
>;

export function pickCatalogDebouncedTextState(
  s: PropertyCatalogUrlState,
): CatalogDebouncedTextState {
  return {
    searchInput: s.searchInput,
    city: s.city,
    district: s.district,
    minPrice: s.minPrice,
    maxPrice: s.maxPrice,
    minArea: s.minArea,
    maxArea: s.maxArea,
    roomsFrom: s.roomsFrom,
    roomsTo: s.roomsTo,
    bedrooms: s.bedrooms,
    floorFrom: s.floorFrom,
    floorTo: s.floorTo,
    totalFloors: s.totalFloors,
    yardArea: s.yardArea,
    houseArea: s.houseArea,
    landArea: s.landArea,
    commercialArea: s.commercialArea,
  };
}

export const DEFAULT_CATALOG_URL_STATE: PropertyCatalogUrlState = {
  searchInput: "",
  showMyProperties: false,
  listScope: DEFAULT_DATABASE_LIST_SCOPE,
  showArchived: false,
  selectedLabelIds: [],
  selectedLabelNames: [],
  selectedColors: [],
  dealType: "",
  lifecycleStatus: "",
  propertyType: "",
  city: "",
  district: "",
  minPrice: "",
  maxPrice: "",
  minArea: "",
  maxArea: "",
  roomsFrom: "",
  roomsTo: "",
  bedrooms: "",
  floorFrom: "",
  floorTo: "",
  totalFloors: "",
  balcony: "",
  yardArea: "",
  houseArea: "",
  landArea: "",
  commercialArea: "",
  createdFrom: "",
  createdTo: "",
  lastOpenedFrom: "",
  lastOpenedTo: "",
  neverOpened: false,
  readyToUpload: false,
  sortBy: "createdAt",
  order: "desc",
  page: 1,
  limit: CATALOG_LIMIT_OPTIONS[0],
};

function parsePositiveInt(raw: string | null, fallback: number): number {
  if (raw === null || raw === "") return fallback;
  const parsedInt = Number.parseInt(raw, 10);
  return Number.isFinite(parsedInt) && parsedInt > 0 ? parsedInt : fallback;
}

function parseBalconyFilter(raw: string | null): PropertyBalconyFilter {
  if (raw === "true" || raw === "false") {
    return raw;
  }
  return "";
}

export function parsePropertyCatalogUrl(
  searchParams: URLSearchParams,
): PropertyCatalogUrlState {
  const next = { ...DEFAULT_CATALOG_URL_STATE };

  const search = searchParams.get("search");
  if (search) next.searchInput = search;

  const myPropertiesRaw = searchParams.get("myProperties");
  if (myPropertiesRaw === "true" || myPropertiesRaw === "1") {
    next.showMyProperties = true;
  }

  next.listScope = parseDatabaseListScope(searchParams.get("scope"));

  const archivedRaw = searchParams.get("archived");
  if (archivedRaw === "true" || archivedRaw === "1") {
    next.showArchived = true;
  }

  const labelIds = searchParams
    .getAll("labelIds")
    .map((labelId) => labelId.trim())
    .filter(Boolean);
  if (labelIds.length > 0) {
    next.selectedLabelIds = labelIds;
  }

  const labelNames = searchParams
    .getAll("labelNames")
    .map((labelName) => labelName.trim())
    .filter(Boolean);
  if (labelNames.length > 0) {
    next.selectedLabelNames = labelNames;
  }

  next.selectedColors = parseRecordColorsFromSearchParams(searchParams);

  const type = searchParams.get("type");
  if (type && isPropertyType(type)) next.propertyType = type;

  const deal = searchParams.get("dealType");
  if (deal && isDealType(deal)) next.dealType = deal;

  const status = searchParams.get("status");
  if (status && isPropertyStatus(status)) next.lifecycleStatus = status;

  const city = searchParams.get("city");
  if (city) next.city = city;

  const district = searchParams.get("district");
  if (district) next.district = district;

  const minPrice = searchParams.get("minPrice");
  if (minPrice) next.minPrice = minPrice;
  const maxPrice = searchParams.get("maxPrice");
  if (maxPrice) next.maxPrice = maxPrice;
  const minArea = searchParams.get("minArea");
  if (minArea) next.minArea = minArea;
  const maxArea = searchParams.get("maxArea");
  if (maxArea) next.maxArea = maxArea;

  const roomsRange = parseNumericRangeFilter(searchParams.get("roomsRange"));
  const roomsExact = searchParams.get("rooms");
  if (roomsRange.from || roomsRange.to) {
    next.roomsFrom = roomsRange.from;
    next.roomsTo = roomsRange.to;
  } else if (roomsExact) {
    next.roomsFrom = roomsExact;
    next.roomsTo = roomsExact;
  }

  const bedrooms = searchParams.get("bedrooms");
  if (bedrooms) next.bedrooms = bedrooms;

  const floorRange = parseNumericRangeFilter(searchParams.get("floorRange"));
  const floorExact = searchParams.get("floor");
  if (floorRange.from || floorRange.to) {
    next.floorFrom = floorRange.from;
    next.floorTo = floorRange.to;
  } else if (floorExact) {
    next.floorFrom = floorExact;
    next.floorTo = floorExact;
  }

  const totalFloors = searchParams.get("totalFloors");
  if (totalFloors) next.totalFloors = totalFloors;

  next.balcony = parseBalconyFilter(searchParams.get("balcony"));

  const yardArea = searchParams.get("yardArea");
  if (yardArea) next.yardArea = yardArea;
  const houseArea = searchParams.get("houseArea");
  if (houseArea) next.houseArea = houseArea;
  const landArea = searchParams.get("landArea");
  if (landArea) next.landArea = landArea;
  const commercialArea = searchParams.get("area");
  if (commercialArea) next.commercialArea = commercialArea;

  const createdFrom = searchParams.get("createdFrom");
  if (createdFrom) next.createdFrom = createdFrom;
  const createdTo = searchParams.get("createdTo");
  if (createdTo) next.createdTo = createdTo;

  const lastOpenedFrom = searchParams.get("lastOpenedFrom");
  if (lastOpenedFrom) next.lastOpenedFrom = lastOpenedFrom;
  const lastOpenedTo = searchParams.get("lastOpenedTo");
  if (lastOpenedTo) next.lastOpenedTo = lastOpenedTo;
  const neverOpenedRaw = searchParams.get("neverOpened");
  if (neverOpenedRaw === "true" || neverOpenedRaw === "1") {
    next.neverOpened = true;
    next.lastOpenedFrom = "";
    next.lastOpenedTo = "";
  }
  const readyToUploadRaw = searchParams.get("readyToUpload");
  if (readyToUploadRaw === "true" || readyToUploadRaw === "1") {
    next.readyToUpload = true;
  }

  const sortBy = searchParams.get("sortBy");
  if (sortBy && isPropertySortBy(sortBy)) next.sortBy = sortBy;

  const order = searchParams.get("order");
  if (order && isPropertyListSortOrder(order)) next.order = order;

  next.page = parsePositiveInt(searchParams.get("page"), 1);
  const limit = parsePositiveInt(searchParams.get("limit"), CATALOG_LIMIT_OPTIONS[0]);
  next.limit = (CATALOG_LIMIT_OPTIONS as readonly number[]).includes(limit)
    ? limit
    : CATALOG_LIMIT_OPTIONS[0];

  return next;
}

export function propertyCatalogUrlStateToSearchParams(
  state: PropertyCatalogUrlState,
): URLSearchParams {
  const params = new URLSearchParams();
  const textFilters = pickCatalogDebouncedTextState(state);

  if (textFilters.searchInput.trim()) {
    params.set("search", textFilters.searchInput.trim());
  }
  if (state.propertyType) params.set("type", state.propertyType);
  if (state.dealType) params.set("dealType", state.dealType);
  if (state.lifecycleStatus) params.set("status", state.lifecycleStatus);
  if (textFilters.city.trim()) params.set("city", textFilters.city.trim());
  if (textFilters.district.trim()) params.set("district", textFilters.district.trim());
  if (textFilters.minPrice.trim()) params.set("minPrice", textFilters.minPrice.trim());
  if (textFilters.maxPrice.trim()) params.set("maxPrice", textFilters.maxPrice.trim());
  if (textFilters.minArea.trim()) params.set("minArea", textFilters.minArea.trim());
  if (textFilters.maxArea.trim()) params.set("maxArea", textFilters.maxArea.trim());
  if (textFilters.bedrooms.trim()) params.set("bedrooms", textFilters.bedrooms.trim());
  if (textFilters.totalFloors.trim()) {
    params.set("totalFloors", textFilters.totalFloors.trim());
  }
  if (textFilters.yardArea.trim()) params.set("yardArea", textFilters.yardArea.trim());
  if (textFilters.houseArea.trim()) params.set("houseArea", textFilters.houseArea.trim());
  if (textFilters.landArea.trim()) params.set("landArea", textFilters.landArea.trim());
  if (textFilters.commercialArea.trim()) {
    params.set("area", textFilters.commercialArea.trim());
  }

  const roomsRange = serializeNumericRangeFilter(
    toNumericRangeFilter(
      parseIntegerInput(textFilters.roomsFrom),
      parseIntegerInput(textFilters.roomsTo),
    ),
  );
  if (roomsRange) params.set("roomsRange", roomsRange);

  const floorRange = serializeNumericRangeFilter(
    toNumericRangeFilter(
      parseIntegerInput(textFilters.floorFrom),
      parseIntegerInput(textFilters.floorTo),
    ),
  );
  if (floorRange) params.set("floorRange", floorRange);

  if (state.balcony) params.set("balcony", state.balcony);

  const createdDates = resolveCreatedDateQuery(state.createdFrom, state.createdTo);
  if (!createdDates.error && createdDates.createdFrom) {
    params.set("createdFrom", createdDates.createdFrom);
  }
  if (!createdDates.error && createdDates.createdTo) {
    params.set("createdTo", createdDates.createdTo);
  }
  if (state.neverOpened) {
    params.set("neverOpened", "true");
  } else {
    const lastOpenedDates = resolveLastOpenedDateQuery(
      state.lastOpenedFrom,
      state.lastOpenedTo,
    );
    if (!lastOpenedDates.error && lastOpenedDates.lastOpenedFrom) {
      params.set("lastOpenedFrom", lastOpenedDates.lastOpenedFrom);
    }
    if (!lastOpenedDates.error && lastOpenedDates.lastOpenedTo) {
      params.set("lastOpenedTo", lastOpenedDates.lastOpenedTo);
    }
  }
  if (state.readyToUpload) {
    params.set("readyToUpload", "true");
  }

  if (state.sortBy !== DEFAULT_CATALOG_URL_STATE.sortBy) {
    params.set("sortBy", state.sortBy);
  }
  if (state.order !== DEFAULT_CATALOG_URL_STATE.order) {
    params.set("order", state.order);
  }
  if (state.page > 1) params.set("page", String(state.page));
  if (state.limit !== DEFAULT_CATALOG_URL_STATE.limit) {
    params.set("limit", String(state.limit));
  }
  if (state.showMyProperties) params.set("myProperties", "true");
  if (state.listScope !== DEFAULT_DATABASE_LIST_SCOPE) {
    params.set("scope", state.listScope);
  }
  if (state.showArchived) params.set("archived", "true");

  for (const labelId of state.selectedLabelIds) {
    const trimmedLabelId = labelId.trim();
    if (trimmedLabelId) params.append("labelIds", trimmedLabelId);
  }
  for (const labelName of state.selectedLabelNames) {
    const trimmedLabelName = labelName.trim();
    if (trimmedLabelName) params.append("labelNames", trimmedLabelName);
  }
  appendRecordColorsToSearchParams(params, state.selectedColors);

  return params;
}

export function catalogStateToApiQuery(
  state: PropertyCatalogUrlState,
  debouncedText?: CatalogDebouncedTextState,
): GetPropertiesQuery {
  const textFilters = debouncedText ?? pickCatalogDebouncedTextState(state);
  const createdDates = resolveCreatedDateQuery(state.createdFrom, state.createdTo);
  const lastOpenedDates = resolveLastOpenedDateQuery(
    state.lastOpenedFrom,
    state.lastOpenedTo,
  );
  const roomsRange = toNumericRangeFilter(
    parseIntegerInput(textFilters.roomsFrom),
    parseIntegerInput(textFilters.roomsTo),
  );
  const floorRange = toNumericRangeFilter(
    parseIntegerInput(textFilters.floorFrom),
    parseIntegerInput(textFilters.floorTo),
  );

  return {
    search: textFilters.searchInput.trim() || undefined,
    type: state.propertyType || undefined,
    dealType: state.dealType || undefined,
    status: state.lifecycleStatus || undefined,
    labelIds: state.selectedLabelIds.length > 0 ? state.selectedLabelIds : undefined,
    labelNames: state.selectedLabelNames.length > 0 ? state.selectedLabelNames : undefined,
    color: state.selectedColors.length > 0 ? state.selectedColors : undefined,
    city: textFilters.city.trim() || undefined,
    district: textFilters.district.trim() || undefined,
    minPrice: parseDecimalInput(textFilters.minPrice),
    maxPrice: parseDecimalInput(textFilters.maxPrice),
    minArea: parseDecimalInput(textFilters.minArea),
    maxArea: parseDecimalInput(textFilters.maxArea),
    roomsRange,
    bedrooms: parseIntegerInput(textFilters.bedrooms),
    floorRange,
    totalFloors: parseIntegerInput(textFilters.totalFloors),
    balcony:
      state.balcony === "true" ? true : state.balcony === "false" ? false : undefined,
    yardArea: parseDecimalInput(textFilters.yardArea),
    houseArea: parseDecimalInput(textFilters.houseArea),
    landArea: parseDecimalInput(textFilters.landArea),
    area: parseDecimalInput(textFilters.commercialArea),
    createdFrom: createdDates.error ? undefined : createdDates.createdFrom,
    createdTo: createdDates.error ? undefined : createdDates.createdTo,
    lastOpenedFrom:
      state.neverOpened || lastOpenedDates.error
        ? undefined
        : lastOpenedDates.lastOpenedFrom,
    lastOpenedTo:
      state.neverOpened || lastOpenedDates.error
        ? undefined
        : lastOpenedDates.lastOpenedTo,
    neverOpened: state.neverOpened ? true : undefined,
    readyToUpload: state.readyToUpload ? true : undefined,
    sortBy: state.sortBy,
    order: state.order,
    page: state.page,
    limit: state.limit,
    myProperties:
      state.showMyProperties && state.listScope !== "MINE" ? true : undefined,
    scope: state.listScope,
    archived: state.showArchived ? true : false,
  };
}
