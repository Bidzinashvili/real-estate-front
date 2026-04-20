import type { Dispatch, SetStateAction } from "react";
import type { DealType } from "@/features/properties/dealType";
import type { PropertyStatus } from "@/features/properties/propertyStatus";
import type {
  PropertyListSortOrder,
  PropertySortBy,
} from "@/features/properties/getPropertiesQuery";
import {
  DEFAULT_CATALOG_URL_STATE,
  type PropertyCatalogUrlState,
} from "@/features/properties/propertyCatalogUrlParams";
import type { PropertyType } from "@/features/properties/types";

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
    setRooms: (value: string) => bumpPage({ rooms: value }),
    setBedrooms: (value: string) => bumpPage({ bedrooms: value }),
    setFloor: (value: string) => bumpPage({ floor: value }),
    setYardArea: (value: string) => bumpPage({ yardArea: value }),
    setHouseArea: (value: string) => bumpPage({ houseArea: value }),
    setLandArea: (value: string) => bumpPage({ landArea: value }),
    setCommercialArea: (value: string) => bumpPage({ commercialArea: value }),
    setShowMyProperties: (value: boolean) =>
      bumpPage({ showMyProperties: value }),
    setSortBy: (value: PropertySortBy) => bumpPage({ sortBy: value }),
    setOrder: (value: PropertyListSortOrder) => bumpPage({ order: value }),
    setPage: (value: number) => {
      setState((previousState) => ({ ...previousState, page: Math.max(1, value) }));
    },
    setLimit: (value: number) => {
      setState((previousState) => ({ ...previousState, limit: value, page: 1 }));
    },
    resetFilters: () => {
      setState({ ...DEFAULT_CATALOG_URL_STATE });
      resetDebouncedTextFilters();
    },
  };
}

export function countActiveCatalogFilters(
  state: PropertyCatalogUrlState,
): number {
  let activeFilterCount = 0;
  if (state.searchInput.trim()) activeFilterCount += 1;
  if (state.selectedLabelIds.length > 0 || state.selectedLabelNames.length > 0) activeFilterCount += 1;
  if (state.dealType) activeFilterCount += 1;
  if (state.lifecycleStatus) activeFilterCount += 1;
  if (state.propertyType) activeFilterCount += 1;
  if (state.city.trim()) activeFilterCount += 1;
  if (state.district.trim()) activeFilterCount += 1;
  if (state.minPrice.trim()) activeFilterCount += 1;
  if (state.maxPrice.trim()) activeFilterCount += 1;
  if (state.minArea.trim()) activeFilterCount += 1;
  if (state.maxArea.trim()) activeFilterCount += 1;
  if (state.rooms.trim()) activeFilterCount += 1;
  if (state.bedrooms.trim()) activeFilterCount += 1;
  if (state.floor.trim()) activeFilterCount += 1;
  if (state.yardArea.trim()) activeFilterCount += 1;
  if (state.houseArea.trim()) activeFilterCount += 1;
  if (state.landArea.trim()) activeFilterCount += 1;
  if (state.commercialArea.trim()) activeFilterCount += 1;
  if (state.showMyProperties) activeFilterCount += 1;
  return activeFilterCount;
}
