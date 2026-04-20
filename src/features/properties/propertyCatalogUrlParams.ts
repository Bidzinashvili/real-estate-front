import type { DealType } from "@/features/properties/dealType";
import { isDealType } from "@/features/properties/dealType";
import type { PropertyStatus } from "@/features/properties/propertyStatus";
import { isPropertyStatus } from "@/features/properties/propertyStatus";
import {
  isPropertyListSortOrder,
  isPropertySortBy,
  toGetPropertiesSearchParams,
  type GetPropertiesQuery,
  type PropertyListSortOrder,
  type PropertySortBy,
} from "@/features/properties/getPropertiesQuery";
import { isPropertyType, type PropertyType } from "@/features/properties/types";
import {
  parseDecimalInput,
  parseIntegerInput,
} from "@/shared/lib/parseNumericInput";

export const CATALOG_LIMIT_OPTIONS = [10, 20, 50] as const;

export type PropertyCatalogUrlState = {
  searchInput: string;
  showMyProperties: boolean;
  selectedLabelIds: string[];
  selectedLabelNames: string[];
  dealType: DealType | "";
  lifecycleStatus: PropertyStatus | "";
  propertyType: PropertyType | "";
  city: string;
  district: string;
  minPrice: string;
  maxPrice: string;
  minArea: string;
  maxArea: string;
  rooms: string;
  bedrooms: string;
  floor: string;
  yardArea: string;
  houseArea: string;
  landArea: string;
  commercialArea: string;
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
  | "rooms"
  | "bedrooms"
  | "floor"
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
    rooms: s.rooms,
    bedrooms: s.bedrooms,
    floor: s.floor,
    yardArea: s.yardArea,
    houseArea: s.houseArea,
    landArea: s.landArea,
    commercialArea: s.commercialArea,
  };
}

export const DEFAULT_CATALOG_URL_STATE: PropertyCatalogUrlState = {
  searchInput: "",
  showMyProperties: false,
  selectedLabelIds: [],
  selectedLabelNames: [],
  dealType: "",
  lifecycleStatus: "",
  propertyType: "",
  city: "",
  district: "",
  minPrice: "",
  maxPrice: "",
  minArea: "",
  maxArea: "",
  rooms: "",
  bedrooms: "",
  floor: "",
  yardArea: "",
  houseArea: "",
  landArea: "",
  commercialArea: "",
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
  const rooms = searchParams.get("rooms");
  if (rooms) next.rooms = rooms;
  const bedrooms = searchParams.get("bedrooms");
  if (bedrooms) next.bedrooms = bedrooms;
  const floor = searchParams.get("floor");
  if (floor) next.floor = floor;
  const yardArea = searchParams.get("yardArea");
  if (yardArea) next.yardArea = yardArea;
  const houseArea = searchParams.get("houseArea");
  if (houseArea) next.houseArea = houseArea;
  const landArea = searchParams.get("landArea");
  if (landArea) next.landArea = landArea;
  const commercialArea = searchParams.get("area");
  if (commercialArea) next.commercialArea = commercialArea;

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
  const apiQuery = catalogStateToApiQuery(state);
  const flat = toGetPropertiesSearchParams(apiQuery);

  if (state.sortBy === DEFAULT_CATALOG_URL_STATE.sortBy) {
    flat.delete("sortBy");
  }
  if (state.order === DEFAULT_CATALOG_URL_STATE.order) {
    flat.delete("order");
  }
  if (state.page === 1) {
    flat.delete("page");
  }
  if (state.limit === DEFAULT_CATALOG_URL_STATE.limit) {
    flat.delete("limit");
  }
  if (!state.showMyProperties) {
    flat.delete("myProperties");
  }

  return flat;
}

export function catalogStateToApiQuery(
  state: PropertyCatalogUrlState,
  debouncedText?: CatalogDebouncedTextState,
): GetPropertiesQuery {
  const textFilters = debouncedText ?? pickCatalogDebouncedTextState(state);
  return {
    search: textFilters.searchInput.trim() || undefined,
    type: state.propertyType || undefined,
    dealType: state.dealType || undefined,
    status: state.lifecycleStatus || undefined,
    labelIds: state.selectedLabelIds.length > 0 ? state.selectedLabelIds : undefined,
    labelNames: state.selectedLabelNames.length > 0 ? state.selectedLabelNames : undefined,
    city: textFilters.city.trim() || undefined,
    district: textFilters.district.trim() || undefined,
    minPrice: parseDecimalInput(textFilters.minPrice),
    maxPrice: parseDecimalInput(textFilters.maxPrice),
    minArea: parseDecimalInput(textFilters.minArea),
    maxArea: parseDecimalInput(textFilters.maxArea),
    rooms: parseIntegerInput(textFilters.rooms),
    bedrooms: parseIntegerInput(textFilters.bedrooms),
    floor: parseIntegerInput(textFilters.floor),
    yardArea: parseDecimalInput(textFilters.yardArea),
    houseArea: parseDecimalInput(textFilters.houseArea),
    landArea: parseDecimalInput(textFilters.landArea),
    area: parseDecimalInput(textFilters.commercialArea),
    sortBy: state.sortBy,
    order: state.order,
    page: state.page,
    limit: state.limit,
    myProperties: state.showMyProperties ? true : undefined,
  };
}
