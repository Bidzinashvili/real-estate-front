"use client";

import { useEffect, useState } from "react";
import { fetchClientPropertyMatches } from "@/features/matching/matchingApi";
import type { ClientToPropertyMatchResponse, MatchRequest } from "@/features/matching/matchingApi.types";
import type { MatchScope, TemporaryLockKey } from "@/features/matching/matchingEnums";

type UseClientPropertyMatchesArgs = {
  clientId: string;
  scope: MatchScope;
  temporaryLockedFields: TemporaryLockKey[];
  page: number;
  limit?: number;
};

type UseClientPropertyMatchesResult = {
  data: ClientToPropertyMatchResponse | null;
  isLoading: boolean;
  error: string | null;
};

export function useClientPropertyMatches({
  clientId,
  scope,
  temporaryLockedFields,
  page,
  limit = 20,
}: UseClientPropertyMatchesArgs): UseClientPropertyMatchesResult {
  const [data, setData] = useState<ClientToPropertyMatchResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const temporaryLockKey = temporaryLockedFields.join(",");

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();
    const request: MatchRequest = {
      scope,
      page,
      limit,
    };
    if (temporaryLockedFields.length > 0) {
      request.temporaryLockedFields = temporaryLockedFields;
    }

    const loadMatches = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await fetchClientPropertyMatches(clientId, request, {
          signal: controller.signal,
        });
        if (!cancelled) {
          setData(result);
        }
      } catch (loadError) {
        if (cancelled) {
          return;
        }
        const message =
          loadError instanceof Error
            ? loadError.message
            : "Could not load property matches right now.";
        setError(message);
        setData(null);
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    void loadMatches();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [clientId, scope, temporaryLockKey, page, limit]);

  return { data, isLoading, error };
}
