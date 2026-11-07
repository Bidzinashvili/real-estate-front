"use client";

import { useCallback, useEffect, useState } from "react";
import { useAdminModeStore } from "@/features/adminMode/adminModeStore";
import { getApiBaseUrl, getStoredAuthToken } from "@/shared/lib/auth";
import { getAgentsList } from "@/features/agents/api";
import type { Agent } from "@/features/agents/types";

type UseAgentsListOptions = {
  enabled: boolean;
  search?: string;
  sortBy?: "fullName" | "email" | "createdAt";
  order?: "asc" | "desc";
};

type UseAgentsListResult = {
  agents: Agent[];
  isLoading: boolean;
  error: string | null;
  reload: () => void;
};

export function useAgentsList(options: UseAgentsListOptions): UseAgentsListResult {
  const { enabled, search, sortBy, order } = options;
  // Admin Mode changes what the API returns (blocked agents are masked), so refetch on change.
  const isAdminMode = useAdminModeStore((state) => state.isAdminMode);
  const [refreshTick, setRefreshTick] = useState(0);
  const reload = useCallback(() => setRefreshTick((tick) => tick + 1), []);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    let cancelled = false;

    const loadAgents = async () => {
      setIsLoading(true);
      setError(null);

      const baseUrl = getApiBaseUrl();
      const token = getStoredAuthToken();

      if (!baseUrl || !token) {
        if (!cancelled) {
          setError("აგენტების ჩატვირთვა ვერ მოხერხდა. სცადეთ მოგვიანებით.");
          setIsLoading(false);
        }
        return;
      }

      try {
        const list = await getAgentsList({ search, sortBy, order });
        if (!cancelled) {
          setAgents(list);
        }
      } catch (err) {
        if (!cancelled) {
          const message =
            err instanceof Error
              ? err.message
              : "აგენტების ჩატვირთვა ვერ მოხერხდა.";
          setError(message);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    void loadAgents();

    return () => {
      cancelled = true;
    };
  }, [enabled, search, sortBy, order, isAdminMode, refreshTick]);

  return { agents, isLoading, error, reload };
}
