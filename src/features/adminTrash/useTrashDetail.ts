"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getAdminTrashClientById,
  getAdminTrashPropertyById,
} from "@/features/adminTrash/api";
import type {
  TrashClientRecord,
  TrashPropertyRecord,
} from "@/features/adminTrash/types";
import { ApiError } from "@/shared/lib/apiError";

type UseTrashDetailResult<Item> = {
  record: Item | null;
  isLoading: boolean;
  error: string | null;
  statusCode: number | null;
  refetch: () => Promise<void>;
};

export function useTrashPropertyDetail(
  recordId: string,
  enabled: boolean,
): UseTrashDetailResult<TrashPropertyRecord> {
  return useTrashDetail(recordId, enabled, getAdminTrashPropertyById);
}

export function useTrashClientDetail(
  recordId: string,
  enabled: boolean,
): UseTrashDetailResult<TrashClientRecord> {
  return useTrashDetail(recordId, enabled, getAdminTrashClientById);
}

function useTrashDetail<Item>(
  recordId: string,
  enabled: boolean,
  loader: (id: string) => Promise<Item>,
): UseTrashDetailResult<Item> {
  const [record, setRecord] = useState<Item | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusCode, setStatusCode] = useState<number | null>(null);

  const refetch = useCallback(async () => {
    if (!recordId || !enabled) {
      return;
    }
    try {
      const result = await loader(recordId);
      setRecord(result);
      setError(null);
      setStatusCode(null);
    } catch (loadError) {
      const message =
        loadError instanceof Error
          ? loadError.message
          : "ჩანაწერის ჩატვირთვა ვერ მოხერხდა.";
      setError(message);
      setStatusCode(loadError instanceof ApiError ? loadError.statusCode : 500);
      setRecord(null);
    }
  }, [enabled, loader, recordId]);

  useEffect(() => {
    if (!recordId || !enabled) {
      return;
    }

    let cancelled = false;

    const loadRecord = async () => {
      setIsLoading(true);
      setError(null);
      setStatusCode(null);
      try {
        const result = await loader(recordId);
        if (!cancelled) {
          setRecord(result);
        }
      } catch (loadError) {
        if (!cancelled) {
          const message =
            loadError instanceof Error
              ? loadError.message
              : "ჩანაწერის ჩატვირთვა ვერ მოხერხდა.";
          setError(message);
          setStatusCode(
            loadError instanceof ApiError ? loadError.statusCode : 500,
          );
          setRecord(null);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    void loadRecord();

    return () => {
      cancelled = true;
    };
  }, [enabled, loader, recordId]);

  return { record, isLoading, error, statusCode, refetch };
}
