"use client";

import { useCallback, useEffect, useState } from "react";
import { getClientProfiles } from "@/features/clientProfiles/api";
import type { GetClientProfilesQuery } from "@/features/clientProfiles/getClientProfilesQuery";
import type { ClientProfileListItem } from "@/features/clientProfiles/types";
import { useRecordsChangedListener } from "@/features/lifecycle/useRecordsChangedListener";

type UseClientProfilesListResult = {
  profiles: ClientProfileListItem[];
  total: number;
  page: number;
  limit: number;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
};

export function useClientProfilesList(
  query?: GetClientProfilesQuery,
): UseClientProfilesListResult {
  const [profiles, setProfiles] = useState<ClientProfileListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refetchTick, setRefetchTick] = useState(0);

  const search = query?.search;
  const blacklisted = query?.blacklisted;
  const queryPage = query?.page;
  const queryLimit = query?.limit;

  const refetch = useCallback(() => {
    setRefetchTick((previousTick) => previousTick + 1);
  }, []);

  useRecordsChangedListener(refetch);

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    const loadProfiles = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await getClientProfiles(
          {
            search,
            blacklisted,
            page: queryPage,
            limit: queryLimit,
          },
          { signal: controller.signal },
        );
        if (!cancelled) {
          setProfiles(result.profiles);
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
            : "კლიენტის პროფილების ჩატვირთვა ვერ მოხერხდა.";
        setError(message);
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    void loadProfiles();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [search, blacklisted, queryPage, queryLimit, refetchTick]);

  return { profiles, total, page, limit, isLoading, error, refetch };
}
