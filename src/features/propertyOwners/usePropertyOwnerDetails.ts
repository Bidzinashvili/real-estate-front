"use client";

import { useCallback, useEffect, useState } from "react";
import { getPropertyOwnerById } from "@/features/propertyOwners/api";
import type { PropertyOwner } from "@/features/propertyOwners/types";
import { ApiError } from "@/shared/lib/apiError";
import { useRecordsChangedListener } from "@/features/lifecycle/useRecordsChangedListener";

type UsePropertyOwnerDetailsResult = {
  owner: PropertyOwner | null;
  isLoading: boolean;
  error: string | null;
  statusCode: number | null;
  refetch: () => Promise<void>;
};

export function usePropertyOwnerDetails(
  ownerId: string,
): UsePropertyOwnerDetailsResult {
  const [owner, setOwner] = useState<PropertyOwner | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusCode, setStatusCode] = useState<number | null>(null);

  const refetch = useCallback(async () => {
    if (!ownerId) {
      return;
    }
    try {
      const result = await getPropertyOwnerById(ownerId);
      setOwner(result);
      setError(null);
      setStatusCode(null);
    } catch (loadError) {
      const message =
        loadError instanceof Error
          ? loadError.message
          : "მეპატრონის ჩატვირთვა ვერ მოხერხდა.";
      setError(message);
      setStatusCode(loadError instanceof ApiError ? loadError.statusCode : 500);
      setOwner(null);
    }
  }, [ownerId]);

  useRecordsChangedListener(refetch);

  useEffect(() => {
    if (!ownerId) {
      return;
    }

    let cancelled = false;

    const loadOwner = async () => {
      setIsLoading(true);
      setError(null);
      setStatusCode(null);

      try {
        const result = await getPropertyOwnerById(ownerId);
        if (!cancelled) {
          setOwner(result);
        }
      } catch (loadError) {
        if (!cancelled) {
          const message =
            loadError instanceof Error
              ? loadError.message
              : "მეპატრონის ჩატვირთვა ვერ მოხერხდა.";
          setError(message);
          setStatusCode(
            loadError instanceof ApiError ? loadError.statusCode : 500,
          );
          setOwner(null);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    void loadOwner();

    return () => {
      cancelled = true;
    };
  }, [ownerId]);

  return { owner, isLoading, error, statusCode, refetch };
}
