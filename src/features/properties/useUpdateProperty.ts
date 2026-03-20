"use client";

import { useState } from "react";
import type { PropertyUpdatePayload } from "@/features/properties/types";
import { updateProperty } from "@/features/properties/api";

type UseUpdatePropertyResult = {
  update: (id: string, payload: PropertyUpdatePayload) => Promise<void>;
  isLoading: boolean;
  error: string | null;
};

export function useUpdateProperty(): UseUpdatePropertyResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = async (id: string, payload: PropertyUpdatePayload) => {
    setIsLoading(true);
    setError(null);

    try {
      await updateProperty(id, payload);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Could not save changes.";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { update, isLoading, error };
}

