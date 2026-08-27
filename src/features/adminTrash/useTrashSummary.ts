"use client";

import { useCallback, useEffect, useState } from "react";
import { getAdminTrashSummary } from "@/features/adminTrash/api";
import type { TrashSummary } from "@/features/adminTrash/types";
import { useRecordsChangedListener } from "@/features/lifecycle/useRecordsChangedListener";
import { ApiError } from "@/shared/lib/apiError";

type UseTrashSummaryResult = {
  summary: TrashSummary | null;
  isLoading: boolean;
  error: string | null;
  statusCode: number | null;
  refetch: () => void;
};

export function useTrashSummary(enabled: boolean): UseTrashSummaryResult {
  const [summary, setSummary] = useState<TrashSummary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusCode, setStatusCode] = useState<number | null>(null);
  const [refetchTick, setRefetchTick] = useState(0);

  const refetch = useCallback(() => {
    setRefetchTick((previousTick) => previousTick + 1);
  }, []);

  useRecordsChangedListener(refetch);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    let cancelled = false;
    const controller = new AbortController();

    const loadSummary = async () => {
      setIsLoading(true);
      setError(null);
      setStatusCode(null);
      try {
        const result = await getAdminTrashSummary({ signal: controller.signal });
        if (!cancelled) {
          setSummary(result);
        }
      } catch (loadError) {
        if (cancelled) {
          return;
        }
        const message =
          loadError instanceof Error
            ? loadError.message
            : "ნაგვის ყუთის ჩატვირთვა ვერ მოხერხდა.";
        setError(message);
        setStatusCode(loadError instanceof ApiError ? loadError.statusCode : 500);
        setSummary(null);
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    void loadSummary();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [enabled, refetchTick]);

  return { summary, isLoading, error, statusCode, refetch };
}
