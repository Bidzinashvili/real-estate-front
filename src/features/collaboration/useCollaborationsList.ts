"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchCollaborations, fetchAdminCollaborations } from "@/features/collaboration/collaborationApi";
import type {
  CollaborationListQuery,
  CollaborationListResponse,
} from "@/features/collaboration/collaborationApi.types";

type UseCollaborationsListArgs = {
  enabled?: boolean;
  mode: "agent" | "admin";
  query: CollaborationListQuery;
  pollIntervalMs?: number;
};

type UseCollaborationsListResult = {
  data: CollaborationListResponse | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
};

export function useCollaborationsList({
  enabled = true,
  mode,
  query,
  pollIntervalMs,
}: UseCollaborationsListArgs): UseCollaborationsListResult {
  const [data, setData] = useState<CollaborationListResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const statusKey = query.status ?? "";
  const groupKey = query.statusGroup ?? "";
  const page = query.page ?? 1;
  const limit = query.limit ?? 20;

  const loadRows = useCallback(
    async (showLoading: boolean) => {
      if (showLoading) {
        setIsLoading(true);
      }
      setError(null);
      try {
        const listQuery: CollaborationListQuery = {
          page,
          limit,
        };
        if (query.status) {
          listQuery.status = query.status;
        }
        if (query.statusGroup) {
          listQuery.statusGroup = query.statusGroup;
        }
        const result =
          mode === "admin"
            ? await fetchAdminCollaborations(listQuery)
            : await fetchCollaborations(listQuery);
        setData(result);
      } catch (loadError) {
        const message =
          loadError instanceof Error
            ? loadError.message
            : "თანამშრომლობის მოთხოვნების ჩატვირთვა ვერ მოხერხდა.";
        setError(message);
        if (showLoading) {
          setData(null);
        }
      } finally {
        if (showLoading) {
          setIsLoading(false);
        }
      }
    },
    [mode, statusKey, groupKey, page, limit],
  );

  const refetch = useCallback(async () => {
    await loadRows(true);
  }, [loadRows]);

  useEffect(() => {
    if (!enabled) {
      return;
    }
    void loadRows(true);
  }, [enabled, loadRows]);

  useEffect(() => {
    if (!enabled || !pollIntervalMs || pollIntervalMs <= 0) {
      return;
    }
    const intervalId = window.setInterval(() => {
      void loadRows(false);
    }, pollIntervalMs);
    return () => window.clearInterval(intervalId);
  }, [enabled, pollIntervalMs, loadRows]);

  return { data, isLoading, error, refetch };
}
