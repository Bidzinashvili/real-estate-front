"use client";

import { useEffect, useState } from "react";
import { getClients } from "@/features/clients/api";
import type { GetClientsQuery } from "@/features/clients/getClientsQuery";
import type { Client } from "@/features/clients/types";

type UseClientsListResult = {
  clients: Client[];
  total: number;
  page: number;
  limit: number;
  isLoading: boolean;
  error: string | null;
};

export function useClientsList(query?: GetClientsQuery): UseClientsListResult {
  const [clients, setClients] = useState<Client[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const district = query?.district;
  const budgetMin = query?.budgetMin;
  const budgetMax = query?.budgetMax;
  const dealType = query?.dealType;
  const status = query?.status;
  const sortBy = query?.sortBy;
  const order = query?.order;
  const queryPage = query?.page;
  const queryLimit = query?.limit;

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    const loadClients = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await getClients(
          {
            district,
            budgetMin,
            budgetMax,
            dealType,
            status,
            sortBy,
            order,
            page: queryPage,
            limit: queryLimit,
          },
          { signal: controller.signal },
        );

        if (!cancelled) {
          setClients(result.clients);
          setTotal(result.total);
          setPage(result.page);
          setLimit(result.limit);
        }
      } catch (err) {
        if (cancelled) return;
        const message =
          err instanceof Error ? err.message : "Could not load clients right now.";
        setError(message);
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    void loadClients();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [
    district,
    budgetMin,
    budgetMax,
    dealType,
    status,
    sortBy,
    order,
    queryPage,
    queryLimit,
  ]);

  return { clients, total, page, limit, isLoading, error };
}
