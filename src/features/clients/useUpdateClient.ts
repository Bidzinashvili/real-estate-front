"use client";

import { useState } from "react";
import { updateClient } from "@/features/clients/api";
import type { UpdateClientDto, Client } from "@/features/clients/types";

type UseUpdateClientResult = {
  update: (id: string, dto: UpdateClientDto) => Promise<Client>;
  isLoading: boolean;
  error: string | null;
};

export function useUpdateClient(): UseUpdateClientResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = async (id: string, dto: UpdateClientDto): Promise<Client> => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await updateClient(id, dto);
      return result;
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Could not save client changes right now.";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { update, isLoading, error };
}
