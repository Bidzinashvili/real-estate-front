"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { recordsChangedEventName } from "@/features/lifecycle/recordsChangedEvent";
import { noteOpenedEventName } from "@/features/noteLastOpened/noteOpenedEvent";
import { remindersChangedEventName } from "@/features/reminders/reminderEvents";
import type { LabelSelection } from "@/features/labels/labelTypes";
import { getProperties } from "@/features/properties/api";
import type { DealType } from "@/features/properties/dealType";
import type { PropertyStatus } from "@/features/properties/propertyStatus";
import type {
  PropertyListSortOrder,
  PropertySortBy,
} from "@/features/properties/getPropertiesQuery";
import {
  countAdvancedCatalogFilters,
  countActiveCatalogFilters,
  createPropertiesCatalogFilterSetters,
  hasClearableCatalogFilters,
} from "@/features/properties/propertiesCatalogFilterSetters";
import {
  catalogStateToApiQuery,
  DEFAULT_CATALOG_URL_STATE,
  parsePropertyCatalogUrl,
  pickCatalogDebouncedTextState,
  propertyCatalogUrlStateToSearchParams,
  type CatalogDebouncedTextState,
  type PropertyBalconyFilter,
  type PropertyCatalogUrlState,
} from "@/features/properties/propertyCatalogUrlParams";
import type { Property, PropertyType } from "@/features/properties/types";
import { useUserStore } from "@/shared/stores";
import { useAdminModeStore } from "@/features/adminMode/adminModeStore";
import type { DatabaseListScope } from "@/features/databaseList/databaseListScope";
import { parseDatabaseListScope } from "@/features/databaseList/databaseListScope";
import type { RecordColor } from "@/features/recordColor/recordColor";

type UsePropertiesCatalogOptions = {
  enabled?: boolean;
  syncUrl?: boolean;
  archivedFilter?: boolean;
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
    previous.roomsFrom === next.roomsFrom &&
    previous.roomsTo === next.roomsTo &&
    previous.bedrooms === next.bedrooms &&
    previous.floorFrom === next.floorFrom &&
    previous.floorTo === next.floorTo &&
    previous.totalFloors === next.totalFloors &&
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
  activeCount: number;
  appliedScope: DatabaseListScope;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  state: PropertyCatalogUrlState;
  selectedLabels: LabelSelection[];
  debouncedTextFilters: CatalogDebouncedTextState;
  setSearchInput: (value: string) => void;
  setSelectedColors: (value: RecordColor[]) => void;
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
  setRoomsFrom: (value: string) => void;
  setRoomsTo: (value: string) => void;
  setBedrooms: (value: string) => void;
  setFloorFrom: (value: string) => void;
  setFloorTo: (value: string) => void;
  setTotalFloors: (value: string) => void;
  setBalcony: (value: PropertyBalconyFilter) => void;
  setYardArea: (value: string) => void;
  setHouseArea: (value: string) => void;
  setLandArea: (value: string) => void;
  setCommercialArea: (value: string) => void;
  setCreatedFrom: (value: string) => void;
  setCreatedTo: (value: string) => void;
  setCreatedDateRange: (value: { createdFrom: string; createdTo: string }) => void;
  setLastOpenedDateRange: (value: {
    lastOpenedFrom: string;
    lastOpenedTo: string;
  }) => void;
  setNeverOpened: (value: boolean) => void;
  setReadyToUpload: (value: boolean) => void;
  setShowMyProperties: (value: boolean) => void;
  setListScope: (value: DatabaseListScope) => void;
  setShowArchived: (value: boolean) => void;
  setSortBy: (value: PropertySortBy) => void;
  setOrder: (value: PropertyListSortOrder) => void;
  setPage: (value: number) => void;
  setLimit: (value: number) => void;
  resetAdvancedFilters: () => void;
  resetFilters: () => void;
  activeFilterCount: number;
  advancedFilterCount: number;
  hasClearableFilters: boolean;
};

export function usePropertiesCatalog(
  options?: UsePropertiesCatalogOptions,
): UsePropertiesCatalogResult {
  const { enabled = true, syncUrl = true, archivedFilter } = options ?? {};
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentUser = useUserStore((userStore) => userStore.user);
  const isUserFetchLoading = useUserStore((userStore) => userStore.isLoading);
  const isAdminMode = useAdminModeStore((state) => state.isAdminMode);

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
  const [activeCount, setActiveCount] = useState(0);
  const [appliedScope, setAppliedScope] = useState<DatabaseListScope>(
    DEFAULT_CATALOG_URL_STATE.listScope,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refetchTick, setRefetchTick] = useState(0);

  const allowUrlReplace = useRef(false);
  const urlChangeFromReplaceRef = useRef(false);

  useEffect(() => {
    if (!syncUrl) {
      allowUrlReplace.current = true;
      const parsedScope = parseDatabaseListScope(searchParams.get("scope"));
      setState((previous) => {
        if (previous.listScope === parsedScope) {
          return previous;
        }
        return { ...previous, listScope: parsedScope };
      });
      return;
    }
    const parsed = parsePropertyCatalogUrl(searchParams);
    if (archivedFilter !== undefined) {
      parsed.showArchived = archivedFilter;
    }
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
  }, [searchParams, syncUrl, archivedFilter]);

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
    state.roomsFrom,
    state.roomsTo,
    state.bedrooms,
    state.floorFrom,
    state.floorTo,
    state.totalFloors,
    state.yardArea,
    state.houseArea,
    state.landArea,
    state.commercialArea,
  ]);

  useEffect(() => {
    if (syncUrl || !allowUrlReplace.current) return;
    const currentScope = parseDatabaseListScope(searchParams.get("scope"));
    if (currentScope === state.listScope) return;
    const params = new URLSearchParams(searchParams.toString());
    if (state.listScope === "ALL") {
      params.delete("scope");
    } else {
      params.set("scope", "MINE");
    }
    const queryString = params.toString();
    router.replace(queryString ? `${pathname}?${queryString}` : pathname, {
      scroll: false,
    });
  }, [state.listScope, syncUrl, pathname, router, searchParams]);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      if (useUserStore.getState().isLoading) return;
      if (useUserStore.getState().user) return;
      setState((previous) => {
        if (!previous.showMyProperties && previous.listScope === "ALL") return previous;
        return { ...previous, showMyProperties: false, listScope: "ALL", page: 1 };
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

  const catalogQuery = useMemo(() => {
    const query = catalogStateToApiQuery(state, debouncedTextFilters);
    if (archivedFilter === undefined) {
      return query;
    }
    return { ...query, archived: archivedFilter };
  }, [
    debouncedTextFilters,
    state.dealType,
    state.lifecycleStatus,
    state.propertyType,
    state.selectedLabelIds,
    state.selectedLabelNames,
    state.selectedColors,
    state.sortBy,
    state.order,
    state.page,
    state.limit,
    state.showMyProperties,
    state.listScope,
    state.showArchived,
    state.createdFrom,
    state.createdTo,
    state.lastOpenedFrom,
    state.lastOpenedTo,
    state.neverOpened,
    state.readyToUpload,
    state.balcony,
    archivedFilter,
  ]);

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
        setActiveCount(res.activeCount);
        if (res.scope) {
          const echoedScope = res.scope;
          setAppliedScope(echoedScope);
          if (echoedScope !== state.listScope) {
            setState((previousState) =>
              previousState.listScope === echoedScope
                ? previousState
                : { ...previousState, listScope: echoedScope },
            );
          }
        } else {
          setAppliedScope(state.listScope);
        }

        const lastPage = Math.max(1, Math.ceil(res.total / res.limit) || 1);
        if (res.total > 0 && state.page > lastPage) {
          setState((previousState) => ({ ...previousState, page: lastPage }));
        }
      } catch (error) {
        if (!effectCommitted || isCanceledRequestError(error)) {
          return;
        }
        const message =
          error instanceof Error ? error.message : "განცხადებების ჩატვირთვა ვერ მოხერხდა.";
        setError(message);
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
  }, [apiQuery, canFetchCatalog, isAdminMode, refetchTick, state.page]);

  const refetch = useCallback(() => {
    setRefetchTick((previousTick) => previousTick + 1);
    return Promise.resolve();
  }, []);

  useEffect(() => {
    const handleRecordsChanged = () => {
      setRefetchTick((previousTick) => previousTick + 1);
    };
    window.addEventListener(recordsChangedEventName, handleRecordsChanged);
    window.addEventListener(remindersChangedEventName, handleRecordsChanged);
    window.addEventListener(noteOpenedEventName, handleRecordsChanged);
    return () => {
      window.removeEventListener(recordsChangedEventName, handleRecordsChanged);
      window.removeEventListener(remindersChangedEventName, handleRecordsChanged);
      window.removeEventListener(noteOpenedEventName, handleRecordsChanged);
    };
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
  const advancedFilterCount = useMemo(
    () => countAdvancedCatalogFilters(state),
    [state],
  );
  const hasClearableFilters = useMemo(
    () => hasClearableCatalogFilters(state),
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
    activeCount,
    appliedScope,
    isLoading,
    error,
    refetch,
    state,
    selectedLabels,
    debouncedTextFilters,
    ...setters,
    setSelectedLabels,
    resetAdvancedFilters: () => {
      setters.resetAdvancedFilters();
      setSelectedLabelsState([]);
    },
    resetFilters: () => {
      setters.resetFilters();
      setSelectedLabelsState([]);
    },
    activeFilterCount,
    advancedFilterCount,
    hasClearableFilters,
  };
}
