"use client";

import { useState } from "react";
import { updateClient } from "@/features/clients/api";
import type { UpdateClientPayload, Client } from "@/features/clients/types";

type UseUpdateClientResult = {
  update: (id: string, dto: UpdateClientPayload) => Promise<Client>;
  isLoading: boolean;
  error: string | null;
};

export function useUpdateClient(): UseUpdateClientResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = async (id: string, dto: UpdateClientPayload): Promise<Client> => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await updateClient(id, dto);
      return result;
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "კლიენტის ცვლილებების შენახვა ვერ მოხერხდა.";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { update, isLoading, error };
}
