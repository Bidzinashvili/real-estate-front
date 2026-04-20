"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { LabelSelection } from "@/features/labels/labelTypes";
import { getProperties } from "@/features/properties/api";
import type { DealType } from "@/features/properties/dealType";
import type { PropertyStatus } from "@/features/properties/propertyStatus";
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

function areCatalogDebouncedTextFiltersEqual(
  previous: CatalogDebouncedTextState,
  next: CatalogDebouncedTextState,
): boolean {
  return (
    previous.searchInput === next.searchInput &&
    previous.city === next.city &&
    previous.district === next.district &&
    previous.minPrice === next.minPrice &&
    previous.maxPrice === next.maxPrice &&
    previous.minArea === next.minArea &&
    previous.maxArea === next.maxArea &&
    previous.rooms === next.rooms &&
    previous.bedrooms === next.bedrooms &&
    previous.floor === next.floor &&
    previous.yardArea === next.yardArea &&
    previous.houseArea === next.houseArea &&
    previous.landArea === next.landArea &&
    previous.commercialArea === next.commercialArea
  );
}

function urlStateSignature(state: PropertyCatalogUrlState): string {
  return propertyCatalogUrlStateToSearchParams(state).toString();
}

function isCanceledRequestError(error: unknown): boolean {
  return axios.isAxiosError(error) && error.code === "ERR_CANCELED";
}

function getLabelSelectionKey(label: LabelSelection): string {
  if (label.id) {
    return `id:${label.id}`;
  }

  return `name:${label.name.toLocaleLowerCase()}`;
}

function syncSelectedLabelsFromUrlState(
  state: PropertyCatalogUrlState,
  previousLabels: LabelSelection[],
): LabelSelection[] {
  const previousLabelsById = new Map<string, LabelSelection>();
  const previousLabelsByName = new Map<string, LabelSelection>();

  for (const previousLabel of previousLabels) {
    if (previousLabel.id) {
      previousLabelsById.set(previousLabel.id, previousLabel);
    }

    previousLabelsByName.set(previousLabel.name.toLocaleLowerCase(), previousLabel);
  }

  const nextLabels: LabelSelection[] = [];
  const seenKeys = new Set<string>();

  for (const labelId of state.selectedLabelIds) {
    const previousLabel = previousLabelsById.get(labelId);
    const nextLabel =
      previousLabel ??
      ({
        id: labelId,
        name: labelId,
        type: null,
      } satisfies LabelSelection);
    const selectionKey = getLabelSelectionKey(nextLabel);

    if (!seenKeys.has(selectionKey)) {
      seenKeys.add(selectionKey);
      nextLabels.push(nextLabel);
    }
  }

  for (const labelName of state.selectedLabelNames) {
    const previousLabel = previousLabelsByName.get(labelName.toLocaleLowerCase());
    const nextLabel =
      previousLabel && previousLabel.id === null
        ? previousLabel
        : ({
            id: null,
            name: labelName,
            type: "CUSTOM",
          } satisfies LabelSelection);
    const selectionKey = getLabelSelectionKey(nextLabel);

    if (!seenKeys.has(selectionKey)) {
      seenKeys.add(selectionKey);
      nextLabels.push(nextLabel);
    }
  }

  return nextLabels;
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
  selectedLabels: LabelSelection[];
  debouncedTextFilters: CatalogDebouncedTextState;
  setSearchInput: (value: string) => void;
  setSelectedLabels: (value: LabelSelection[]) => void;
  setDealType: (value: DealType | "") => void;
  setLifecycleStatus: (value: PropertyStatus | "") => void;
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
  const [selectedLabels, setSelectedLabelsState] = useState<LabelSelection[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refetchTick, setRefetchTick] = useState(0);

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

    setState((previous) => {
      if (urlStateSignature(previous) === urlStateSignature(parsed)) {
        return previous;
      }
      return parsed;
    });
    setSelectedLabelsState((previousLabels) =>
      syncSelectedLabelsFromUrlState(parsed, previousLabels),
    );
    if (!fromOurReplace) {
      setDebouncedTextFilters((previousDebounced) => {
        const nextDebounced = pickCatalogDebouncedTextState(parsed);
        if (areCatalogDebouncedTextFiltersEqual(previousDebounced, nextDebounced)) {
          return previousDebounced;
        }
        return nextDebounced;
      });
    }
    allowUrlReplace.current = true;
  }, [searchParams, syncUrl]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedTextFilters((previousDebounced) => {
        const nextDebounced = pickCatalogDebouncedTextState(state);
        if (areCatalogDebouncedTextFiltersEqual(previousDebounced, nextDebounced)) {
          return previousDebounced;
        }
        return nextDebounced;
      });
    }, CATALOG_TEXT_FILTER_DEBOUNCE_MS);
    return () => window.clearTimeout(timeoutId);
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
      state.lifecycleStatus,
      state.propertyType,
      state.selectedLabelIds,
      state.selectedLabelNames,
      state.sortBy,
      state.order,
      state.page,
      state.limit,
      state.showMyProperties,
    ],
  );

  const wantsMyPropertiesFilter = state.showMyProperties === true;
  const myPropertiesCatalogDependency: string | false | null = wantsMyPropertiesFilter
    ? (currentUser?.id ?? false)
    : null;

  const apiQuery = useMemo(
    () => ({
      ...catalogQuery,
      myProperties:
        catalogQuery.myProperties === true && currentUser ? true : undefined,
    }),
    [catalogQuery, myPropertiesCatalogDependency],
  );

  const canFetchCatalog =
    enabled &&
    (!wantsMyPropertiesFilter ||
      (!isUserFetchLoading && currentUser !== null));

  useEffect(() => {
    if (!canFetchCatalog) {
      return;
    }

    const controller = new AbortController();
    let effectCommitted = true;

    setIsLoading(true);
    setError(null);

    void (async () => {
      try {
        const res = await getProperties(apiQuery, { signal: controller.signal });
        if (!effectCommitted) {
          return;
        }
        setProperties(res.properties);
        setTotal(res.total);

        const lastPage = Math.max(1, Math.ceil(res.total / res.limit) || 1);
        if (res.total > 0 && state.page > lastPage) {
          setState((previousState) => ({ ...previousState, page: lastPage }));
        }
      } catch (error) {
        if (!effectCommitted || isCanceledRequestError(error)) {
          return;
        }
        const message =
          error instanceof Error ? error.message : "Could not load properties right now.";
        setError(message);
        setProperties([]);
        setTotal(0);
      } finally {
        if (effectCommitted) {
          setIsLoading(false);
        }
      }
    })();

    return () => {
      effectCommitted = false;
      controller.abort();
    };
  }, [apiQuery, canFetchCatalog, refetchTick, state.page]);

  const refetch = useCallback(() => {
    setRefetchTick((previousTick) => previousTick + 1);
    return Promise.resolve();
  }, []);

  const bumpPage = useCallback((patch: Partial<PropertyCatalogUrlState>) => {
    setState((previousState) => ({ ...previousState, ...patch, page: 1 }));
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

  const setSelectedLabels = useCallback((value: LabelSelection[]) => {
    setSelectedLabelsState(value);
    setters.setSelectedLabelIds(
      value
        .map((label) => label.id)
        .filter((labelId): labelId is string => typeof labelId === "string" && labelId !== ""),
    );
    setters.setSelectedLabelNames(
      value
        .filter((label) => label.id === null)
        .map((label) => label.name.trim())
        .filter((labelName) => labelName !== ""),
    );
  }, [setters]);

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
    refetch,
    state,
    selectedLabels,
    debouncedTextFilters,
    ...setters,
    setSelectedLabels,
    activeFilterCount,
  };
}
