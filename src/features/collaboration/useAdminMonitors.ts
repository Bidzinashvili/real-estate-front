"use client";

import { useCallback, useEffect, useState } from "react";
import {
  fetchAdminCollaborationMonitorById,
  fetchAdminCollaborationMonitors,
} from "@/features/collaboration/collaborationApi";
import type {
  CollaborationMonitorDto,
  CollaborationMonitorListResponse,
} from "@/features/collaboration/collaborationApi.types";

type UseAdminMonitorsListArgs = {
  enabled?: boolean;
  page: number;
  limit?: number;
};

type UseAdminMonitorsListResult = {
  data: CollaborationMonitorListResponse | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
};

export function useAdminMonitorsList({
  enabled = true,
  page,
  limit = 20,
}: UseAdminMonitorsListArgs): UseAdminMonitorsListResult {
  const [data, setData] = useState<CollaborationMonitorListResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadRows = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await fetchAdminCollaborationMonitors({ page, limit });
      setData(result);
    } catch (loadError) {
      const message =
        loadError instanceof Error
          ? loadError.message
          : "მონიტორინგის ჩანაწერების ჩატვირთვა ვერ მოხერხდა.";
      setError(message);
      setData(null);
    } finally {
      setIsLoading(false);
    }
  }, [page, limit]);

  useEffect(() => {
    if (!enabled) {
      return;
    }
    void loadRows();
  }, [enabled, loadRows]);

  return { data, isLoading, error, refetch: loadRows };
}

type UseAdminMonitorDetailsResult = {
  monitor: CollaborationMonitorDto | null;
  isLoading: boolean;
  error: string | null;
};

export function useAdminMonitorDetails(monitorId: string): UseAdminMonitorDetailsResult {
  const [monitor, setMonitor] = useState<CollaborationMonitorDto | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const loadMonitor = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await fetchAdminCollaborationMonitorById(monitorId);
        if (!cancelled) {
          setMonitor(result);
        }
      } catch (loadError) {
        if (!cancelled) {
          const message =
            loadError instanceof Error
              ? loadError.message
              : "მონიტორინგის ჩანაწერის ჩატვირთვა ვერ მოხერხდა.";
          setError(message);
          setMonitor(null);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };
    void loadMonitor();
    return () => {
      cancelled = true;
    };
  }, [monitorId]);

  return { monitor, isLoading, error };
}
