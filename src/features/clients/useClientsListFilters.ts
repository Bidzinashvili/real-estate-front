"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { ClientStatus, DealType } from "@/features/clients/clientEnums";
import type { ClientSortBy, SortOrder } from "@/features/clients/clientApi.types";
import type { RecordColor } from "@/features/recordColor/recordColor";
import {
  toggleDatabaseListScope,
  type DatabaseListScope,
} from "@/features/databaseList/databaseListScope";
import {
  areClientListDebouncedEqual,
  clientListUrlStateToSearchParams,
  CLIENT_LIST_SEARCH_DEBOUNCE_MS,
  countClientAdvancedFilters,
  DEFAULT_CLIENT_LIST_URL_STATE,
  hasClearableClientFilters,
  parseClientListUrl,
  pickClientListDebouncedState,
  type ClientListDebouncedState,
  type ClientListUrlState,
} from "@/features/clients/clientListUrlParams";

type UseClientsListFiltersOptions = {
  syncUrl?: boolean;
};

function urlStateSignature(state: ClientListUrlState): string {
  return clientListUrlStateToSearchParams(state).toString();
}

export function useClientsListFilters(options?: UseClientsListFiltersOptions) {
  const { syncUrl = true } = options ?? {};
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [state, setState] = useState<ClientListUrlState>(
    () => DEFAULT_CLIENT_LIST_URL_STATE,
  );
  const [debouncedState, setDebouncedState] = useState<ClientListDebouncedState>(
    () => pickClientListDebouncedState(DEFAULT_CLIENT_LIST_URL_STATE),
  );

  const allowUrlReplace = useRef(false);
  const urlChangeFromReplaceRef = useRef(false);

  useEffect(() => {
    if (!syncUrl) {
      allowUrlReplace.current = true;
      const parsedScope = parseClientListUrl(searchParams).listScope;
      setState((previous) => {
        if (previous.listScope === parsedScope) {
          return previous;
        }
        return { ...previous, listScope: parsedScope, page: 1 };
      });
      return;
    }

    const parsed = parseClientListUrl(searchParams);
    const fromOurReplace = urlChangeFromReplaceRef.current;
    urlChangeFromReplaceRef.current = false;

    setState((previous) => {
      if (urlStateSignature(previous) === urlStateSignature(parsed)) {
        return previous;
      }
      return parsed;
    });
    if (!fromOurReplace) {
      setDebouncedState((previousDebounced) => {
        const nextDebounced = pickClientListDebouncedState(parsed);
        if (areClientListDebouncedEqual(previousDebounced, nextDebounced)) {
          return previousDebounced;
        }
        return nextDebounced;
      });
    }
    allowUrlReplace.current = true;
  }, [searchParams, syncUrl]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedState((previousDebounced) => {
        const nextDebounced = pickClientListDebouncedState(state);
        if (areClientListDebouncedEqual(previousDebounced, nextDebounced)) {
          return previousDebounced;
        }
        return nextDebounced;
      });
    }, CLIENT_LIST_SEARCH_DEBOUNCE_MS);
    return () => window.clearTimeout(timeoutId);
  }, [
    state.searchInput,
    state.district,
    state.budgetMinInput,
    state.budgetMaxInput,
  ]);

  useEffect(() => {
    if (syncUrl || !allowUrlReplace.current) return;
    const currentScope = parseClientListUrl(searchParams).listScope;
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
    if (!syncUrl || !allowUrlReplace.current) return;
    const nextQuery = urlStateSignature(state);
    if (nextQuery === searchParams.toString()) return;
    urlChangeFromReplaceRef.current = true;
    router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, {
      scroll: false,
    });
  }, [state, syncUrl, pathname, router, searchParams]);

  const bumpPage = useCallback((patch: Partial<ClientListUrlState>) => {
    setState((previousState) => ({ ...previousState, ...patch, page: 1 }));
  }, []);

  const setSearchInput = useCallback((value: string) => {
    setState((previousState) => ({
      ...previousState,
      searchInput: value,
      page: 1,
    }));
  }, []);

  const setSelectedColors = useCallback(
    (value: RecordColor[]) => bumpPage({ selectedColors: value }),
    [bumpPage],
  );

  const setDistrict = useCallback(
    (value: string) => bumpPage({ district: value }),
    [bumpPage],
  );
  const setBudgetMinInput = useCallback(
    (value: string) => bumpPage({ budgetMinInput: value }),
    [bumpPage],
  );
  const setBudgetMaxInput = useCallback(
    (value: string) => bumpPage({ budgetMaxInput: value }),
    [bumpPage],
  );
  const setDealType = useCallback(
    (value: DealType | "") => bumpPage({ dealType: value }),
    [bumpPage],
  );
  const setStatus = useCallback(
    (value: ClientStatus | "") => bumpPage({ status: value }),
    [bumpPage],
  );
  const setCreatedDateRange = useCallback(
    (value: { createdFrom: string; createdTo: string }) => bumpPage(value),
    [bumpPage],
  );
  const setLastOpenedDateRange = useCallback(
    (value: { lastOpenedFrom: string; lastOpenedTo: string }) =>
      bumpPage({ ...value, neverOpened: false }),
    [bumpPage],
  );
  const setNeverOpened = useCallback(
    (value: boolean) =>
      bumpPage(
        value
          ? { neverOpened: true, lastOpenedFrom: "", lastOpenedTo: "" }
          : { neverOpened: false },
      ),
    [bumpPage],
  );
  const setSortBy = useCallback(
    (value: ClientSortBy) => bumpPage({ sortBy: value }),
    [bumpPage],
  );
  const setOrder = useCallback(
    (value: SortOrder) => bumpPage({ order: value }),
    [bumpPage],
  );
  const setPage = useCallback((value: number) => {
    setState((previousState) => ({
      ...previousState,
      page: Math.max(1, value),
    }));
  }, []);
  const setListScope = useCallback(
    (value: DatabaseListScope) => bumpPage({ listScope: value }),
    [bumpPage],
  );
  const toggleOnlyMine = useCallback(() => {
    setListScope(toggleDatabaseListScope(state.listScope));
  }, [setListScope, state.listScope]);

  const resetAdvancedFilters = useCallback(() => {
    bumpPage({
      status: "",
      lastOpenedFrom: "",
      lastOpenedTo: "",
      neverOpened: false,
    });
  }, [bumpPage]);

  const resetFilters = useCallback(() => {
    setState((previousState) => ({
      ...DEFAULT_CLIENT_LIST_URL_STATE,
      listScope: previousState.listScope,
      sortBy: previousState.sortBy,
      order: previousState.order,
    }));
    setDebouncedState(
      pickClientListDebouncedState({
        ...DEFAULT_CLIENT_LIST_URL_STATE,
        listScope: state.listScope,
        sortBy: state.sortBy,
        order: state.order,
      }),
    );
  }, [state.listScope, state.sortBy, state.order]);

  const advancedFilterCount = useMemo(
    () => countClientAdvancedFilters(state),
    [state],
  );
  const hasClearableFilters = useMemo(
    () => hasClearableClientFilters(state),
    [state],
  );

  return {
    state,
    debouncedState,
    setSearchInput,
    setSelectedColors,
    setDistrict,
    setBudgetMinInput,
    setBudgetMaxInput,
    setDealType,
    setStatus,
    setCreatedDateRange,
    setLastOpenedDateRange,
    setNeverOpened,
    setSortBy,
    setOrder,
    setPage,
    setListScope,
    toggleOnlyMine,
    resetAdvancedFilters,
    resetFilters,
    advancedFilterCount,
    hasClearableFilters,
  };
}
