"use client";

import { useState } from "react";
import type { AgentDetails } from "@/features/agents/types";
import { updateAgent } from "@/features/agents/api";

type UpdateAgentPayload = {
  fullName: string;
  email: string;
  phone: string;
};

type UseUpdateAgentResult = {
  update: (id: string, payload: UpdateAgentPayload) => Promise<AgentDetails>;
  isLoading: boolean;
  error: string | null;
};

export function useUpdateAgent(): UseUpdateAgentResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = async (
    id: string,
    payload: UpdateAgentPayload,
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

