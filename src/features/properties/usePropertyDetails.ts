"use client";

import { useMemo } from "react";
import type { Property } from "@/features/properties/types";
import { usePropertiesList } from "@/features/properties/usePropertiesList";

type UsePropertyDetailsResult = {
  property: Property | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<Property[]>;
};

export function usePropertyDetails(
  id: string | null | undefined,
): UsePropertyDetailsResult {
  const { properties, isLoading, error, refetch } = usePropertiesList({
    enabled: Boolean(id),
  });

  const property = useMemo(() => {
    if (!id) return null;
    return properties.find((item) => item.id === id) ?? null;
  }, [id, properties]);

  return { property, isLoading, error, refetch };
}

