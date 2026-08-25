"use client";

import { useCallback, useEffect, useState } from "react";
import { getClients } from "@/features/clients/api";
import type { GetClientsQuery } from "@/features/clients/getClientsQuery";
import type { Client } from "@/features/clients/types";
import { recordsChangedEventName } from "@/features/lifecycle/recordsChangedEvent";

type UseClientsListResult = {
  clients: Client[];
  total: number;
  page: number;
  limit: number;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
};

function lockedFieldKey(field: { value?: unknown; lock: string } | undefined): string {
  return field === undefined ? "" : JSON.stringify(field);
}

export function useClientsList(query?: GetClientsQuery): UseClientsListResult {
  const [clients, setClients] = useState<Client[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refetchTick, setRefetchTick] = useState(0);

  const districtKey = lockedFieldKey(query?.district);
  const budgetMinKey = lockedFieldKey(query?.budgetMin);
  const budgetMaxKey = lockedFieldKey(query?.budgetMax);
  const statusKey = lockedFieldKey(query?.status);
  const dealType = query?.dealType;
  const sortBy = query?.sortBy;
  const order = query?.order;
  const queryPage = query?.page;
  const queryLimit = query?.limit;
  const archived = query?.archived;

  const refetch = useCallback(() => {
    setRefetchTick((previousTick) => previousTick + 1);
  }, []);

  useEffect(() => {
    const handleRecordsChanged = () => {
      setRefetchTick((previousTick) => previousTick + 1);
    };
    window.addEventListener(recordsChangedEventName, handleRecordsChanged);
    return () => {
      window.removeEventListener(recordsChangedEventName, handleRecordsChanged);
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
          },
          { signal: controller.signal },
        );

        if (!cancelled) {
          setClients(result.clients);
          setTotal(result.total);
          setPage(result.page);
          setLimit(result.limit);
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
    refetchTick,
  ]);

  return { clients, total, page, limit, isLoading, error, refetch };
}
