"use client";

import { useCallback, useEffect, useState } from "react";
import { getProperties } from "@/features/properties/api";
import type { Property } from "@/features/properties/types";

type UsePropertiesListOptions = {
  enabled: boolean;
};

type UsePropertiesListResult = {
  properties: Property[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<Property[]>;
};

export function usePropertiesList({
  enabled,
}: UsePropertiesListOptions): UsePropertiesListResult {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (): Promise<Property[]> => {
    setIsLoading(true);
    setError(null);

    try {
      const list = await getProperties();
      setProperties(list ?? []);
      return list ?? [];
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Could not load properties right now.";
      setError(message);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!enabled) {
      return;
    }
    void load();
  }, [enabled, load]);

  return { properties, isLoading, error, refetch: load };
}

