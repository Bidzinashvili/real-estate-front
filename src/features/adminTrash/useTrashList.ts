"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getAdminTrashClients,
  getAdminTrashProperties,
} from "@/features/adminTrash/api";
import type {
  TrashClientRecord,
  TrashListQuery,
  TrashPropertyRecord,
} from "@/features/adminTrash/types";
import { useRecordsChangedListener } from "@/features/lifecycle/useRecordsChangedListener";
import { ApiError } from "@/shared/lib/apiError";

type TrashKind = "properties" | "clients";

type UseTrashListResult<Item> = {
  items: Item[];
  total: number;
  page: number;
  limit: number;
  isLoading: boolean;
  error: string | null;
  statusCode: number | null;
  refetch: () => void;
};

export function useTrashList<Item extends TrashPropertyRecord | TrashClientRecord>(
  kind: TrashKind,
  query: TrashListQuery,
  enabled: boolean,
): UseTrashListResult<Item> {
  const [items, setItems] = useState<Item[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(query.page ?? 1);
  const [limit, setLimit] = useState(query.limit ?? 20);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusCode, setStatusCode] = useState<number | null>(null);
  const [refetchTick, setRefetchTick] = useState(0);

  const refetch = useCallback(() => {
    setRefetchTick((previousTick) => previousTick + 1);
  }, []);

  useRecordsChangedListener(refetch);

  const search = query.search;
  const sortBy = query.sortBy;
  const order = query.order;
  const queryPage = query.page;
  const queryLimit = query.limit;

  useEffect(() => {
    if (!enabled) {
      return;
    }

    let cancelled = false;
    const controller = new AbortController();

    const loadItems = async () => {
      setIsLoading(true);
      setError(null);
      setStatusCode(null);
      try {
        const result =
          kind === "properties"
            ? await getAdminTrashProperties(
                {
                  search,
                  sortBy,
                  order,
                  page: queryPage,
                  limit: queryLimit,
                },
                { signal: controller.signal },
              )
            : await getAdminTrashClients(
                {
                  search,
                  sortBy,
                  order,
                  page: queryPage,
                  limit: queryLimit,
                },
                { signal: controller.signal },
              );
        if (!cancelled) {
          setItems(result.items as Item[]);
          setTotal(result.total);
          setPage(result.page);
          setLimit(result.limit);
        }
      } catch (loadError) {
        if (cancelled) {
          return;
        }
        const message =
          loadError instanceof Error
            ? loadError.message
            : "ნაგვის ყუთის ჩატვირთვა ვერ მოხერხდა.";
        setError(message);
        setStatusCode(loadError instanceof ApiError ? loadError.statusCode : 500);
        setItems([]);
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    void loadItems();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [enabled, kind, search, sortBy, order, queryPage, queryLimit, refetchTick]);

  return { items, total, page, limit, isLoading, error, statusCode, refetch };
}
