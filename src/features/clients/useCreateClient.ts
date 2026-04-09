"use client";

import { useState } from "react";
import { createClient } from "@/features/clients/api";
import type { CreateClientDto, Client } from "@/features/clients/types";

type UseCreateClientResult = {
  create: (dto: CreateClientDto) => Promise<Client>;
  isLoading: boolean;
  error: string | null;
};

export function useCreateClient(): UseCreateClientResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = async (dto: CreateClientDto): Promise<Client> => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await createClient(dto);
      return result;
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Could not create this client right now.";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { create, isLoading, error };
}
