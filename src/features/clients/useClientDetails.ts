"use client";

import { useEffect, useState } from "react";
import { getClientById } from "@/features/clients/api";
import type { ClientDetail } from "@/features/clients/types";

type UseClientDetailsResult = {
  client: ClientDetail | null;
  isLoading: boolean;
  error: string | null;
};

export function useClientDetails(id: string): UseClientDetailsResult {
  const [client, setClient] = useState<ClientDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    let cancelled = false;

    const loadClient = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await getClientById(id);
        if (!cancelled) {
          setClient(result);
        }
      } catch (err) {
        if (!cancelled) {
          const message =
            err instanceof Error
              ? err.message
              : "Could not load this client right now.";
          setError(message);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    void loadClient();

    return () => {
      cancelled = true;
    };
  }, [id]);

  return { client, isLoading, error };
}
