"use client";

import { useEffect, useState } from "react";
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
};

export function useAgentsList(options: UseAgentsListOptions): UseAgentsListResult {
  const { enabled, search, sortBy, order } = options;
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
          setError("Could not load agents. Please try again later.");
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
              : "Could not load agents right now.";
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
  }, [enabled, search, sortBy, order]);

  return { agents, isLoading, error };
}
