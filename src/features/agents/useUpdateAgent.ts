"use client";

import { useState } from "react";
import type { AgentDetails, AgentUpdatePayload } from "@/features/agents/types";
import { updateAgent } from "@/features/agents/api";

type UseUpdateAgentResult = {
  update: (id: string, payload: AgentUpdatePayload) => Promise<AgentDetails>;
  isLoading: boolean;
  error: string | null;
};

export function useUpdateAgent(): UseUpdateAgentResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = async (
    id: string,
    payload: AgentUpdatePayload,
  ): Promise<AgentDetails> => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await updateAgent(id, payload);
      return result;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Could not save changes.";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { update, isLoading, error };
}

