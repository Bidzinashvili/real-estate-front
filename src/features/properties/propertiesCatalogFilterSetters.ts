import type { Dispatch, SetStateAction } from "react";
import type { DealType } from "@/features/properties/dealType";
import type { PropertyStatus } from "@/features/properties/propertyStatus";
import type {
  PropertyListSortOrder,
  PropertySortBy,
} from "@/features/properties/getPropertiesQuery";
import {
  DEFAULT_CATALOG_URL_STATE,
  type PropertyBalconyFilter,
  type PropertyCatalogUrlState,
} from "@/features/properties/propertyCatalogUrlParams";
import type { PropertyType } from "@/features/properties/types";
import type { DatabaseListScope } from "@/features/databaseList/databaseListScope";

const ADVANCED_FILTER_DEFAULTS: Pick<
  PropertyCatalogUrlState,
  | "lifecycleStatus"
  | "city"
  | "selectedLabelIds"
  | "selectedLabelNames"
  | "minArea"
  | "maxArea"
  | "roomsFrom"
  | "roomsTo"
  | "bedrooms"
  | "floorFrom"
  | "floorTo"
  | "totalFloors"
  | "balcony"
  | "yardArea"
  | "houseArea"
  | "landArea"
  | "commercialArea"
  | "lastOpenedFrom"
  | "lastOpenedTo"
  | "neverOpened"
> = {
  lifecycleStatus: DEFAULT_CATALOG_URL_STATE.lifecycleStatus,
  city: DEFAULT_CATALOG_URL_STATE.city,
  selectedLabelIds: DEFAULT_CATALOG_URL_STATE.selectedLabelIds,
  selectedLabelNames: DEFAULT_CATALOG_URL_STATE.selectedLabelNames,
  minArea: DEFAULT_CATALOG_URL_STATE.minArea,
  maxArea: DEFAULT_CATALOG_URL_STATE.maxArea,
  roomsFrom: DEFAULT_CATALOG_URL_STATE.roomsFrom,
  roomsTo: DEFAULT_CATALOG_URL_STATE.roomsTo,
  bedrooms: DEFAULT_CATALOG_URL_STATE.bedrooms,
  floorFrom: DEFAULT_CATALOG_URL_STATE.floorFrom,
  floorTo: DEFAULT_CATALOG_URL_STATE.floorTo,
  totalFloors: DEFAULT_CATALOG_URL_STATE.totalFloors,
  balcony: DEFAULT_CATALOG_URL_STATE.balcony,
  yardArea: DEFAULT_CATALOG_URL_STATE.yardArea,
  houseArea: DEFAULT_CATALOG_URL_STATE.houseArea,
  landArea: DEFAULT_CATALOG_URL_STATE.landArea,
  commercialArea: DEFAULT_CATALOG_URL_STATE.commercialArea,
  lastOpenedFrom: DEFAULT_CATALOG_URL_STATE.lastOpenedFrom,
  lastOpenedTo: DEFAULT_CATALOG_URL_STATE.lastOpenedTo,
  neverOpened: DEFAULT_CATALOG_URL_STATE.neverOpened,
};

export function createPropertiesCatalogFilterSetters(args: {
  bumpPage: (patch: Partial<PropertyCatalogUrlState>) => void;
  setState: Dispatch<SetStateAction<PropertyCatalogUrlState>>;
  resetDebouncedTextFilters: () => void;
}) {
  const { bumpPage, setState, resetDebouncedTextFilters } = args;

  return {
    setSearchInput: (value: string) => {
      setState((previousState) => ({ ...previousState, searchInput: value, page: 1 }));
    },
    setSelectedLabelIds: (value: string[]) => bumpPage({ selectedLabelIds: value }),
    setSelectedLabelNames: (value: string[]) => bumpPage({ selectedLabelNames: value }),
    setDealType: (value: DealType | "") => bumpPage({ dealType: value }),
    setLifecycleStatus: (value: PropertyStatus | "") =>
      bumpPage({ lifecycleStatus: value }),
    setPropertyType: (value: PropertyType | "") =>
      bumpPage({ propertyType: value }),
    setCity: (value: string) => bumpPage({ city: value }),
    setDistrict: (value: string) => bumpPage({ district: value }),
    setMinPrice: (value: string) => bumpPage({ minPrice: value }),
    setMaxPrice: (value: string) => bumpPage({ maxPrice: value }),
    setMinArea: (value: string) => bumpPage({ minArea: value }),
    setMaxArea: (value: string) => bumpPage({ maxArea: value }),
    setRoomsFrom: (value: string) => bumpPage({ roomsFrom: value }),
    setRoomsTo: (value: string) => bumpPage({ roomsTo: value }),
    setBedrooms: (value: string) => bumpPage({ bedrooms: value }),
    setFloorFrom: (value: string) => bumpPage({ floorFrom: value }),
    setFloorTo: (value: string) => bumpPage({ floorTo: value }),
    setTotalFloors: (value: string) => bumpPage({ totalFloors: value }),
    setBalcony: (value: PropertyBalconyFilter) => bumpPage({ balcony: value }),
    setYardArea: (value: string) => bumpPage({ yardArea: value }),
    setHouseArea: (value: string) => bumpPage({ houseArea: value }),
    setLandArea: (value: string) => bumpPage({ landArea: value }),
    setCommercialArea: (value: string) => bumpPage({ commercialArea: value }),
    setCreatedFrom: (value: string) => bumpPage({ createdFrom: value }),
    setCreatedTo: (value: string) => bumpPage({ createdTo: value }),
    setCreatedDateRange: (value: { createdFrom: string; createdTo: string }) =>
      bumpPage(value),
    setLastOpenedDateRange: (value: {
      lastOpenedFrom: string;
      lastOpenedTo: string;
    }) =>
      bumpPage({
        ...value,
        neverOpened: false,
      }),
    setNeverOpened: (value: boolean) =>
      bumpPage(
        value
          ? { neverOpened: true, lastOpenedFrom: "", lastOpenedTo: "" }
          : { neverOpened: false },
      ),
    setReadyToUpload: (value: boolean) => bumpPage({ readyToUpload: value }),
    setShowMyProperties: (value: boolean) =>
      bumpPage({ showMyProperties: value }),
    setListScope: (value: DatabaseListScope) => bumpPage({ listScope: value }),
    setShowArchived: (value: boolean) => bumpPage({ showArchived: value }),
    setSortBy: (value: PropertySortBy) => bumpPage({ sortBy: value }),
    setOrder: (value: PropertyListSortOrder) => bumpPage({ order: value }),
    setPage: (value: number) => {
      setState((previousState) => ({ ...previousState, page: Math.max(1, value) }));
    },
    setLimit: (value: number) => {
      setState((previousState) => ({ ...previousState, limit: value, page: 1 }));
    },
    resetAdvancedFilters: () => {
      bumpPage({ ...ADVANCED_FILTER_DEFAULTS });
    },
    resetFilters: () => {
      setState((previousState) => ({
        ...DEFAULT_CATALOG_URL_STATE,
        listScope: previousState.listScope,
        sortBy: previousState.sortBy,
        order: previousState.order,
        limit: previousState.limit,
      }));
      resetDebouncedTextFilters();
    },
  };
}

export function countAdvancedCatalogFilters(
  state: PropertyCatalogUrlState,
): number {
  let advancedFilterCount = 0;
  if (state.selectedLabelIds.length > 0 || state.selectedLabelNames.length > 0) {
    advancedFilterCount += 1;
  }
  if (state.lifecycleStatus) advancedFilterCount += 1;
  if (state.city.trim()) advancedFilterCount += 1;
  if (state.minArea.trim()) advancedFilterCount += 1;
  if (state.maxArea.trim()) advancedFilterCount += 1;
  if (state.roomsFrom.trim() || state.roomsTo.trim()) advancedFilterCount += 1;
  if (state.bedrooms.trim()) advancedFilterCount += 1;
  if (state.floorFrom.trim() || state.floorTo.trim()) advancedFilterCount += 1;
  if (state.totalFloors.trim()) advancedFilterCount += 1;
  if (state.balcony) advancedFilterCount += 1;
  if (state.yardArea.trim()) advancedFilterCount += 1;
  if (state.houseArea.trim()) advancedFilterCount += 1;
  if (state.landArea.trim()) advancedFilterCount += 1;
  if (state.commercialArea.trim()) advancedFilterCount += 1;
  if (state.lastOpenedFrom.trim() || state.lastOpenedTo.trim()) {
    advancedFilterCount += 1;
  }
  if (state.neverOpened) advancedFilterCount += 1;
  return advancedFilterCount;
}

export function hasClearableCatalogFilters(
  state: PropertyCatalogUrlState,
): boolean {
  if (state.searchInput.trim()) return true;
  if (state.dealType) return true;
  if (state.propertyType) return true;
  if (state.district.trim()) return true;
  if (state.minPrice.trim() || state.maxPrice.trim()) return true;
  if (state.createdFrom.trim() || state.createdTo.trim()) return true;
  if (state.lastOpenedFrom.trim() || state.lastOpenedTo.trim()) return true;
  if (state.neverOpened) return true;
  if (state.readyToUpload) return true;
  return countAdvancedCatalogFilters(state) > 0;
}

export function countActiveCatalogFilters(
  state: PropertyCatalogUrlState,
): number {
  return countAdvancedCatalogFilters(state);
}
