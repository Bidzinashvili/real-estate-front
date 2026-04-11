"use client";

import { useEffect, useState } from "react";
import { getClientInviteLinks } from "@/features/clientInviteLinks/api";
import type { ClientInviteLinkListItem } from "@/features/clientInviteLinks/types";

type UseClientInviteLinksListQuery = {
  page?: number;
  limit?: number;
};

type UseClientInviteLinksListResult = {
  links: ClientInviteLinkListItem[];
  total: number;
  page: number;
  limit: number;
  isLoading: boolean;
  error: string | null;
};

export function useClientInviteLinksList(
  query?: UseClientInviteLinksListQuery,
): UseClientInviteLinksListResult {
  const [links, setLinks] = useState<ClientInviteLinkListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const queryPage = query?.page ?? 1;
  const queryLimit = query?.limit ?? 20;

  useEffect(() => {
    let cancelled = false;

    const loadLinks = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await getClientInviteLinks({
          page: queryPage,
          limit: queryLimit,
        });

        if (!cancelled) {
          setLinks(result.links);
          setTotal(result.total);
          setPage(result.page);
          setLimit(result.limit);
        }
      } catch (err) {
        if (cancelled) return;
        const message =
          err instanceof Error ? err.message : "Could not load invite links right now.";
        setError(message);
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    void loadLinks();

    return () => {
      cancelled = true;
    };
  }, [queryPage, queryLimit]);

  return { links, total, page, limit, isLoading, error };
}
