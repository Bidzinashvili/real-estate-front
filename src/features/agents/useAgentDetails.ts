"use client";

import { useEffect, useState } from "react";
import type { AgentDetails } from "@/features/agents/types";
import { getAgentById } from "@/features/agents/api";

type UseAgentDetailsResult = {
  agent: AgentDetails | null;
  isLoading: boolean;
  error: string | null;
};

export function useAgentDetails(id: string | null | undefined): UseAgentDetailsResult {
  const [agent, setAgent] = useState<AgentDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      return;
    }

    let cancelled = false;

    const load = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await getAgentById(id);
        if (!cancelled) {
          setAgent(result);
        }
      } catch (err) {
        if (!cancelled) {
          const message =
            err instanceof Error ? err.message : "Could not load this agent.";
          setError(message);
          setAgent(null);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [id]);

  return { agent, isLoading, error };
}

