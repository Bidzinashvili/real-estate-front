"use client";

import { useCallback, useEffect, useState } from "react";
import { getPropertyOwners } from "@/features/propertyOwners/api";
import type { GetPropertyOwnersQuery } from "@/features/propertyOwners/getPropertyOwnersQuery";
import type { PropertyOwner } from "@/features/propertyOwners/types";

type UsePropertyOwnersListResult = {
  owners: PropertyOwner[];
  total: number;
  page: number;
  limit: number;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
};

export function usePropertyOwnersList(
  query?: GetPropertyOwnersQuery,
): UsePropertyOwnersListResult {
  const [owners, setOwners] = useState<PropertyOwner[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refetchTick, setRefetchTick] = useState(0);

  const search = query?.search;
  const queryPage = query?.page;
  const queryLimit = query?.limit;

  const refetch = useCallback(() => {
    setRefetchTick((previousTick) => previousTick + 1);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    const loadOwners = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await getPropertyOwners(
          {
            search,
            page: queryPage,
            limit: queryLimit,
          },
          { signal: controller.signal },
        );
        if (!cancelled) {
          setOwners(result.owners);
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
            : "მეპატრონეების ჩატვირთვა ვერ მოხერხდა.";
        setError(message);
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    void loadOwners();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [search, queryPage, queryLimit, refetchTick]);

  return { owners, total, page, limit, isLoading, error, refetch };
}
