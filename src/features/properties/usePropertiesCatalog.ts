"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { getProperties } from "@/features/properties/api";
import type { DealType } from "@/features/properties/dealType";
import type {
  PropertyListSortOrder,
  PropertySortBy,
} from "@/features/properties/getPropertiesQuery";
import {
  countActiveCatalogFilters,
  createPropertiesCatalogFilterSetters,
} from "@/features/properties/propertiesCatalogFilterSetters";
import {
  catalogStateToApiQuery,
  DEFAULT_CATALOG_URL_STATE,
  parsePropertyCatalogUrl,
  pickCatalogDebouncedTextState,
  propertyCatalogUrlStateToSearchParams,
  type CatalogDebouncedTextState,
  type PropertyCatalogUrlState,
} from "@/features/properties/propertyCatalogUrlParams";
import type { Property, PropertyType } from "@/features/properties/types";
import { useUserStore } from "@/shared/stores";

type UsePropertiesCatalogOptions = {
  enabled?: boolean;
  syncUrl?: boolean;
};

const CATALOG_TEXT_FILTER_DEBOUNCE_MS = 300;

function urlStateSignature(s: PropertyCatalogUrlState): string {
  return propertyCatalogUrlStateToSearchParams(s).toString();
}

export type UsePropertiesCatalogResult = {
  properties: Property[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  state: PropertyCatalogUrlState;
  debouncedTextFilters: CatalogDebouncedTextState;
  setSearchInput: (value: string) => void;
  setDealType: (value: DealType | "") => void;
  setPropertyType: (value: PropertyType | "") => void;
  setCity: (value: string) => void;
  setDistrict: (value: string) => void;
  setMinPrice: (value: string) => void;
  setMaxPrice: (value: string) => void;
  setMinArea: (value: string) => void;
  setMaxArea: (value: string) => void;
  setRooms: (value: string) => void;
  setBedrooms: (value: string) => void;
  setFloor: (value: string) => void;
  setYardArea: (value: string) => void;
  setHouseArea: (value: string) => void;
  setLandArea: (value: string) => void;
  setCommercialArea: (value: string) => void;
  setShowMyProperties: (value: boolean) => void;
  setSortBy: (value: PropertySortBy) => void;
  setOrder: (value: PropertyListSortOrder) => void;
  setPage: (value: number) => void;
  setLimit: (value: number) => void;
  resetFilters: () => void;
  activeFilterCount: number;
};

export function usePropertiesCatalog(
  options?: UsePropertiesCatalogOptions,
): UsePropertiesCatalogResult {
  const { enabled = true, syncUrl = true } = options ?? {};
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentUser = useUserStore((userStore) => userStore.user);
  const isUserFetchLoading = useUserStore((userStore) => userStore.isLoading);

  const [state, setState] = useState<PropertyCatalogUrlState>(
    () => DEFAULT_CATALOG_URL_STATE,
  );
  const [debouncedTextFilters, setDebouncedTextFilters] =
    useState<CatalogDebouncedTextState>(() =>
      pickCatalogDebouncedTextState(DEFAULT_CATALOG_URL_STATE),
    );
  const [properties, setProperties] = useState<Property[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const allowUrlReplace = useRef(false);
  const urlChangeFromReplaceRef = useRef(false);

  useEffect(() => {
    if (!syncUrl) {
      allowUrlReplace.current = true;
      return;
    }
    const parsed = parsePropertyCatalogUrl(searchParams);
    const fromOurReplace = urlChangeFromReplaceRef.current;
    urlChangeFromReplaceRef.current = false;

    setState(parsed);
    if (!fromOurReplace) {
      setDebouncedTextFilters(pickCatalogDebouncedTextState(parsed));
    }
    allowUrlReplace.current = true;
  }, [searchParams, syncUrl]);

  useEffect(() => {
    const id = window.setTimeout(() => {
      setDebouncedTextFilters(pickCatalogDebouncedTextState(state));
    }, CATALOG_TEXT_FILTER_DEBOUNCE_MS);
    return () => window.clearTimeout(id);
  }, [
    state.searchInput,
    state.city,
    state.district,
    state.minPrice,
    state.maxPrice,
    state.minArea,
    state.maxArea,
    state.rooms,
    state.bedrooms,
    state.floor,
    state.yardArea,
    state.houseArea,
    state.landArea,
    state.commercialArea,
  ]);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      if (useUserStore.getState().isLoading) return;
      if (useUserStore.getState().user) return;
      setState((previous) => {
        if (!previous.showMyProperties) return previous;
        return { ...previous, showMyProperties: false, page: 1 };
      });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [currentUser, isUserFetchLoading]);

  useEffect(() => {
    if (!syncUrl || !allowUrlReplace.current) return;
    const nextQs = urlStateSignature(state);
    if (nextQs === searchParams.toString()) return;
    urlChangeFromReplaceRef.current = true;
    router.replace(nextQs ? `${pathname}?${nextQs}` : pathname, {
      scroll: false,
    });
  }, [state, syncUrl, pathname, router, searchParams]);

  const catalogQuery = useMemo(
    () => catalogStateToApiQuery(state, debouncedTextFilters),
    [
      debouncedTextFilters,
      state.dealType,
      state.propertyType,
      state.sortBy,
      state.order,
      state.page,
      state.limit,
      state.showMyProperties,
    ],
  );

  const apiQuery = useMemo(
    () => ({
      ...catalogQuery,
      myProperties:
        catalogQuery.myProperties === true && currentUser ? true : undefined,
    }),
    [catalogQuery, currentUser],
  );

  const load = useCallback(async () => {
    if (!enabled) return;

    setIsLoading(true);
    setError(null);
    try {
      const res = await getProperties(apiQuery);
      setProperties(res.properties);
      setTotal(res.total);

      const lastPage = Math.max(1, Math.ceil(res.total / res.limit) || 1);
      if (res.total > 0 && state.page > lastPage) {
        setState((s) => ({ ...s, page: lastPage }));
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Could not load properties right now.";
      setError(message);
      setProperties([]);
      setTotal(0);
    } finally {
      setIsLoading(false);
    }
  }, [apiQuery, enabled, state.page]);

  useEffect(() => {
    void load();
  }, [load]);

  const bumpPage = useCallback((patch: Partial<PropertyCatalogUrlState>) => {
    setState((s) => ({ ...s, ...patch, page: 1 }));
  }, []);

  const resetDebouncedTextFilters = useCallback(() => {
    setDebouncedTextFilters(pickCatalogDebouncedTextState(DEFAULT_CATALOG_URL_STATE));
  }, []);

  const setters = useMemo(
    () =>
      createPropertiesCatalogFilterSetters({
        bumpPage,
        setState,
        resetDebouncedTextFilters,
      }),
    [bumpPage, resetDebouncedTextFilters],
  );

  const activeFilterCount = useMemo(
    () => countActiveCatalogFilters(state),
    [state],
  );

  const limit = state.limit;
  const totalPages = Math.max(1, Math.ceil(total / limit) || 1);
  const page = Math.min(state.page, totalPages);

  return {
    properties,
    total,
    page,
    limit,
    totalPages,
    isLoading,
    error,
    refetch: load,
    state,
    debouncedTextFilters,
    ...setters,
    activeFilterCount,
  };
}
