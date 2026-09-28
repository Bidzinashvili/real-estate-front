"use client";

import { useCallback, useEffect, useState } from "react";
import { getClients } from "@/features/clients/api";
import type { GetClientsQuery } from "@/features/clients/getClientsQuery";
import type { Client } from "@/features/clients/types";
import { isRecordColor, type RecordColor } from "@/features/recordColor/recordColor";
import { recordsChangedEventName } from "@/features/lifecycle/recordsChangedEvent";
import { noteOpenedEventName } from "@/features/noteLastOpened/noteOpenedEvent";
import { remindersChangedEventName } from "@/features/reminders/reminderEvents";
import type { DatabaseListScope } from "@/features/databaseList/databaseListScope";
import { hasActiveAdminPrivileges } from "@/features/adminMode/effectiveAccessViewer";
import { useAdminModeStore } from "@/features/adminMode/adminModeStore";
import { useUserStore } from "@/shared/stores/userStore";

type UseClientsListResult = {
  clients: Client[];
  total: number;
  page: number;
  limit: number;
  activeCount: number;
  appliedScope: DatabaseListScope | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
};

function lockedFieldKey(field: { value?: unknown; lock: string } | undefined): string {
  return field === undefined ? "" : JSON.stringify(field);
}

function parseColorQueryKey(colorKey: string): RecordColor[] | undefined {
  if (colorKey === "") {
    return undefined;
  }
  const parsedColors: RecordColor[] = [];
  for (const piece of colorKey.split(",")) {
    if (isRecordColor(piece)) {
      parsedColors.push(piece);
    }
  }
  return parsedColors.length > 0 ? parsedColors : undefined;
}

export function useClientsList(query?: GetClientsQuery): UseClientsListResult {
  const user = useUserStore((state) => state.user);
  const isAdminMode = useAdminModeStore((state) => state.isAdminMode);
  const requestsArchiveAdminMode =
    query?.archived === true && hasActiveAdminPrivileges(user, isAdminMode);
  const [clients, setClients] = useState<Client[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [activeCount, setActiveCount] = useState(0);
  const [appliedScope, setAppliedScope] = useState<DatabaseListScope | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refetchTick, setRefetchTick] = useState(0);
  const [trackedAdminMode, setTrackedAdminMode] = useState(isAdminMode);

  if (trackedAdminMode !== isAdminMode) {
    setTrackedAdminMode(isAdminMode);
    if (query?.archived === true) {
      setClients([]);
      setTotal(0);
      setActiveCount(0);
      setError(null);
      setIsLoading(true);
    }
  }

  const districtKey = lockedFieldKey(query?.district);
  const budgetMinKey = lockedFieldKey(query?.budgetMin);
  const budgetMaxKey = lockedFieldKey(query?.budgetMax);
  const statusKey = lockedFieldKey(query?.status);
  const search = query?.search;
  const createdFrom = query?.createdFrom;
  const createdTo = query?.createdTo;
  const lastOpenedFrom = query?.lastOpenedFrom;
  const lastOpenedTo = query?.lastOpenedTo;
  const neverOpened = query?.neverOpened;
  const dealType = query?.dealType;
  const sortBy = query?.sortBy;
  const order = query?.order;
  const queryPage = query?.page;
  const queryLimit = query?.limit;
  const archived = query?.archived;
  const scope = query?.scope;
  const colorKey = query?.color?.join(",") ?? "";

  const refetch = useCallback(() => {
    setRefetchTick((previousTick) => previousTick + 1);
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

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    const loadClients = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await getClients(
          {
            search,
            createdFrom,
            createdTo,
            lastOpenedFrom,
            lastOpenedTo,
            neverOpened,
            district:
              districtKey === ""
                ? undefined
                : (JSON.parse(districtKey) as GetClientsQuery["district"]),
            budgetMin:
              budgetMinKey === ""
                ? undefined
                : (JSON.parse(budgetMinKey) as GetClientsQuery["budgetMin"]),
            budgetMax:
              budgetMaxKey === ""
                ? undefined
                : (JSON.parse(budgetMaxKey) as GetClientsQuery["budgetMax"]),
            dealType,
            status:
              statusKey === ""
                ? undefined
                : (JSON.parse(statusKey) as GetClientsQuery["status"]),
            sortBy,
            order,
            page: queryPage,
            limit: queryLimit,
            archived,
            scope,
            color: parseColorQueryKey(colorKey),
            ...(requestsArchiveAdminMode ? { adminMode: true as const } : {}),
          },
          { signal: controller.signal },
        );

        if (!cancelled) {
          setClients(result.clients);
          setTotal(result.total);
          setPage(result.page);
          setLimit(result.limit);
          setActiveCount(result.activeCount);
          setAppliedScope(result.scope);
        }
      } catch (loadError) {
        if (cancelled) return;
        const message =
          loadError instanceof Error
            ? loadError.message
            : "კლიენტების ჩატვირთვა ვერ მოხერხდა.";
        setError(message);
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    void loadClients();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [
    search,
    createdFrom,
    createdTo,
    lastOpenedFrom,
    lastOpenedTo,
    neverOpened,
    districtKey,
    budgetMinKey,
    budgetMaxKey,
    statusKey,
    dealType,
    sortBy,
    order,
    queryPage,
    queryLimit,
    archived,
    scope,
    colorKey,
    isAdminMode,
    requestsArchiveAdminMode,
    refetchTick,
  ]);

  return {
    clients,
    total,
    page,
    limit,
    activeCount,
    appliedScope,
    isLoading,
    error,
    refetch,
  };
}
