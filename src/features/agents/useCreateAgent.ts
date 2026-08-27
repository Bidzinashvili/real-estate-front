"use client";

import { useState } from "react";
import type { AgentCreatePayload, AgentCreateResult } from "@/features/agents/types";
import { createAgent } from "@/features/agents/api";

type UseCreateAgentResult = {
  create: (payload: AgentCreatePayload) => Promise<AgentCreateResult>;
  isLoading: boolean;
  error: string | null;
};

export function useCreateAgent(): UseCreateAgentResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = async (payload: AgentCreatePayload): Promise<AgentCreateResult> => {
    setIsLoading(true);
    setError(null);

    try {
      const agent = await createAgent(payload);
      return agent;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "აგენტის შექმნა ვერ მოხერხდა.";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { create, isLoading, error };
}
