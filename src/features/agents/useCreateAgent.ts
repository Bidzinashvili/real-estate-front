"use client";

import { useState } from "react";
import type { Agent, AgentCreatePayload } from "@/features/agents/types";
import { createAgent } from "@/features/agents/api";

type UseCreateAgentResult = {
  create: (payload: AgentCreatePayload) => Promise<Agent>;
  isLoading: boolean;
  error: string | null;
};

export function useCreateAgent(): UseCreateAgentResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = async (payload: AgentCreatePayload): Promise<Agent> => {
    setIsLoading(true);
    setError(null);

    try {
      const agent = await createAgent(payload);
      return agent;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Could not create this agent.";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { create, isLoading, error };
}
