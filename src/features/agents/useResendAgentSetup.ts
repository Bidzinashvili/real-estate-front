"use client";

import { useState } from "react";
import { resendAgentSetupEmail } from "@/features/agents/api";
import { AUTH_COPY } from "@/features/auth/authCopy";

type UseResendAgentSetupResult = {
  resend: (agentId: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
};

export function useResendAgentSetup(): UseResendAgentSetupResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resend = async (agentId: string): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      await resendAgentSetupEmail(agentId);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : AUTH_COPY.genericError;
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { resend, isLoading, error };
}
