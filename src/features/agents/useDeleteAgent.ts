"use client";

import { useState } from "react";
import { deleteAgents } from "@/features/agents/api";

type UseDeleteAgentResult = {
  deleteAgent: (id: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
};

export function useDeleteAgent(): UseDeleteAgentResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteAgent = async (id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      await deleteAgents([id]);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Could not delete this agent.";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { deleteAgent, isLoading, error };
}

