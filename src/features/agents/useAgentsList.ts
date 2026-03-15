"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { getApiBaseUrl, getStoredAuthToken } from "@/shared/lib/auth";
import type { Agent, AgentsResponse } from "@/features/agents/types";

type UseAgentsListOptions = {
  enabled: boolean;
};

type UseAgentsListResult = {
  agents: Agent[];
  isLoading: boolean;
  error: string | null;
};

export function useAgentsList(options: UseAgentsListOptions): UseAgentsListResult {
  const { enabled } = options;
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
        const res = await axios.get<AgentsResponse>(`${baseUrl}/admin/agents`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!cancelled) {
          setAgents(res.data.agents ?? []);
        }
      } catch {
        if (!cancelled) {
          setError("Could not load agents right now.");
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    loadAgents();

    return () => {
      cancelled = true;
    };
  }, [enabled]);

  return { agents, isLoading, error };
}

