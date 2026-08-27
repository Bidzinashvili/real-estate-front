"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useClientHiddenPropertiesChangedListener } from "@/features/clientHiddenProperties/hiddenPropertyEvents";
import { fetchClientPropertyMatches } from "@/features/matching/matchingApi";
import type { ClientToPropertyMatchResponse, MatchRequest } from "@/features/matching/matchingApi.types";
import type { MatchScope, TemporaryLockKey } from "@/features/matching/matchingEnums";
import { useRecordsChangedListener } from "@/features/lifecycle/useRecordsChangedListener";

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
  refetch: () => void;
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
  const [refetchTick, setRefetchTick] = useState(0);
  const temporaryLockKey = temporaryLockedFields.join(",");
  const requestSignature = `${clientId}|${scope}|${temporaryLockKey}|${page}|${limit}`;
  const loadedSignatureRef = useRef<string | null>(null);
  const bumpRefetch = useCallback(() => {
    setRefetchTick((previousTick) => previousTick + 1);
  }, []);

  useRecordsChangedListener(bumpRefetch);
  useClientHiddenPropertiesChangedListener(clientId, bumpRefetch);

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
    const isRequestChanged = loadedSignatureRef.current !== requestSignature;

    const loadMatches = async () => {
      if (isRequestChanged) {
        setIsLoading(true);
        setData(null);
      }
      setError(null);
      try {
        const result = await fetchClientPropertyMatches(clientId, request, {
          signal: controller.signal,
        });
        if (!cancelled) {
          loadedSignatureRef.current = requestSignature;
          setData(result);
        }
      } catch (loadError) {
        if (cancelled) {
          return;
        }
        const message =
          loadError instanceof Error
            ? loadError.message
            : "შესაბამისი განცხადებების ჩატვირთვა ვერ მოხერხდა.";
        setError(message);
        if (isRequestChanged) {
          setData(null);
        }
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
  }, [clientId, scope, temporaryLockKey, page, limit, refetchTick, requestSignature]);

  return { data, isLoading, error, refetch: bumpRefetch };
}
