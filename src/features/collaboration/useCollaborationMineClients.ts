"use client";

import { useCallback, useEffect, useState } from "react";
import { getClients } from "@/features/clients/api";
import type { Client } from "@/features/clients/types";

type UseCollaborationMineClientsOptions = {
  enabled: boolean;
  search: string;
};

type UseCollaborationMineClientsResult = {
  clients: Client[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
};

export function useCollaborationMineClients({
  enabled,
  search,
}: UseCollaborationMineClientsOptions): UseCollaborationMineClientsResult {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadClients = useCallback(async () => {
    if (!enabled) {
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const trimmedSearch = search.trim();
      const response = await getClients({
        scope: "MINE",
        page: 1,
        limit: 40,
        ...(trimmedSearch !== "" ? { search: trimmedSearch } : {}),
      });
      setClients(response.clients);
    } catch (loadError) {
      const message =
        loadError instanceof Error
          ? loadError.message
          : "კლიენტების ჩატვირთვა ვერ მოხერხდა.";
      setError(message);
      setClients([]);
    } finally {
      setIsLoading(false);
    }
  }, [enabled, search]);

  useEffect(() => {
    if (!enabled) {
      return;
    }
    const timeoutId = window.setTimeout(() => {
      void loadClients();
    }, 300);
    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [enabled, loadClients]);

  return { clients, isLoading, error, refetch: loadClients };
}
