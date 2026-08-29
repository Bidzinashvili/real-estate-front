"use client";

import { useCallback, useEffect, useState } from "react";
import { getClientById } from "@/features/clients/api";
import type { ClientDetail } from "@/features/clients/types";

type UseClientDetailsResult = {
  client: ClientDetail | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  applyNoteLastOpenedAt: (openedAt: string | null) => void;
};

export function useClientDetails(id: string): UseClientDetailsResult {
  const [client, setClient] = useState<ClientDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const applyNoteLastOpenedAt = useCallback((openedAt: string | null) => {
    setClient((previous) => {
      if (!previous || previous.noteLastOpenedAt === undefined) {
        return previous;
      }
      return { ...previous, noteLastOpenedAt: openedAt };
    });
  }, []);

  const refetch = async () => {
    if (!id) return;
    try {
      const result = await getClientById(id);
      setClient(result);
      setError(null);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "კლიენტის ჩატვირთვა ვერ მოხერხდა.";
      setError(message);
    }
  };

  useEffect(() => {
    if (!id) return;

    let cancelled = false;

    const runLoad = async () => {
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
              : "კლიენტის ჩატვირთვა ვერ მოხერხდა.";
          setError(message);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    void runLoad();

    return () => {
      cancelled = true;
    };
  }, [id]);

  return { client, isLoading, error, refetch, applyNoteLastOpenedAt };
}
