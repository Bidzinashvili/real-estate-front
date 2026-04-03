"use client";

import { useState } from "react";
import { createProperty } from "@/features/properties/api";
import type { CreatePropertyDto, Property } from "@/features/properties/types";

type UseCreatePropertyResult = {
  create: (payload: CreatePropertyDto, images?: File[]) => Promise<Property | null>;
  isLoading: boolean;
  error: string | null;
};

export function useCreateProperty(): UseCreatePropertyResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = async (payload: CreatePropertyDto, images?: File[]) => {
    setIsLoading(true);
    setError(null);

    try {
      return await createProperty(payload, images);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Could not create this property.";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { create, isLoading, error };
}
