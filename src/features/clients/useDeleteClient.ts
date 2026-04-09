"use client";

import { useState } from "react";
import { deleteClient } from "@/features/clients/api";

type UseDeleteClientResult = {
  remove: (id: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
};

export function useDeleteClient(): UseDeleteClientResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const remove = async (id: string): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      await deleteClient(id);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Could not delete this client right now.";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { remove, isLoading, error };
}
