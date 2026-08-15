"use client";

import { useEffect, useState } from "react";
import { fetchPropertyClientMatches } from "@/features/matching/matchingApi";
import type { MatchRequest, PropertyToClientMatchResponse } from "@/features/matching/matchingApi.types";
import type { MatchScope, TemporaryLockKey } from "@/features/matching/matchingEnums";

type UsePropertyClientMatchesArgs = {
  propertyId: string;
  scope: MatchScope;
  temporaryLockedFields: TemporaryLockKey[];
  page: number;
  limit?: number;
};

type UsePropertyClientMatchesResult = {
  data: PropertyToClientMatchResponse | null;
  isLoading: boolean;
  error: string | null;
};

export function usePropertyClientMatches({
  propertyId,
  scope,
  temporaryLockedFields,
  page,
  limit = 20,
}: UsePropertyClientMatchesArgs): UsePropertyClientMatchesResult {
  const [data, setData] = useState<PropertyToClientMatchResponse | null>(null);
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
        const result = await fetchPropertyClientMatches(propertyId, request, {
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
            : "შესაბამისი კლიენტების ჩატვირთვა ვერ მოხერხდა.";
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
  }, [propertyId, scope, temporaryLockKey, page, limit]);

  return { data, isLoading, error };
}
