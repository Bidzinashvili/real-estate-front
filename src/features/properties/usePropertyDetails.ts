"use client";

import { useCallback, useEffect, useState } from "react";
import { getPropertyFromListById } from "@/features/properties/api";
import type { Property } from "@/features/properties/types";

type UsePropertyDetailsResult = {
  property: Property | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<Property | null>;
};

export function usePropertyDetails(
  id: string | null | undefined,
): UsePropertyDetailsResult {
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (): Promise<Property | null> => {
    if (!id) {
      setProperty(null);
      setError(null);
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const next = await getPropertyFromListById(id);
      setProperty(next);
      if (!next) {
        setError("Property not found.");
      }
      return next;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Could not load property details.";
      setError(message);
      setProperty(null);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void load();
  }, [load]);

  return { property, isLoading, error, refetch: load };
}
