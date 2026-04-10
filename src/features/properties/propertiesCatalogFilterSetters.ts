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
      setState((s) => ({ ...s, searchInput: value, page: 1 }));
    },
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
      setState((s) => ({ ...s, page: Math.max(1, value) }));
    },
    setLimit: (value: number) => {
      setState((s) => ({ ...s, limit: value, page: 1 }));
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
  let n = 0;
  if (state.searchInput.trim()) n += 1;
  if (state.dealType) n += 1;
  if (state.lifecycleStatus) n += 1;
  if (state.propertyType) n += 1;
  if (state.city.trim()) n += 1;
  if (state.district.trim()) n += 1;
  if (state.minPrice.trim()) n += 1;
  if (state.maxPrice.trim()) n += 1;
  if (state.minArea.trim()) n += 1;
  if (state.maxArea.trim()) n += 1;
  if (state.rooms.trim()) n += 1;
  if (state.bedrooms.trim()) n += 1;
  if (state.floor.trim()) n += 1;
  if (state.yardArea.trim()) n += 1;
  if (state.houseArea.trim()) n += 1;
  if (state.landArea.trim()) n += 1;
  if (state.commercialArea.trim()) n += 1;
  if (state.showMyProperties) n += 1;
  return n;
}
