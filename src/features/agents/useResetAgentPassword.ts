"use client";

import { useState } from "react";
import { resetAgentPassword } from "@/features/agents/api";
import { mapAdminResetPasswordError } from "@/features/auth/authRequestErrors";

type UseResetAgentPasswordResult = {
  resetPassword: (agentId: string, newPassword: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
};

export function useResetAgentPassword(): UseResetAgentPasswordResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetPassword = async (
    agentId: string,
    newPassword: string,
  ): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      await resetAgentPassword(agentId, newPassword);
    } catch (err) {
      setError(mapAdminResetPasswordError(err));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { resetPassword, isLoading, error };
}
