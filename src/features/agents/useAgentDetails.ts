"use client";

import { useCallback, useEffect, useState } from "react";
import type { AgentDetails } from "@/features/agents/types";
import { getAgentById } from "@/features/agents/api";

type UseAgentDetailsResult = {
  agent: AgentDetails | null;
  isLoading: boolean;
  error: string | null;
  reload: () => void;
};

export function useAgentDetails(id: string | null | undefined): UseAgentDetailsResult {
  const [agent, setAgent] = useState<AgentDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reloadCount, setReloadCount] = useState(0);

  const reload = useCallback(() => {
    setReloadCount((current) => current + 1);
  }, []);

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
            err instanceof Error ? err.message : "აგენტის ჩატვირთვა ვერ მოხერხდა.";
          setError(message);
          setAgent(null);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, [id, reloadCount]);

  return { agent, isLoading, error, reload };
}
