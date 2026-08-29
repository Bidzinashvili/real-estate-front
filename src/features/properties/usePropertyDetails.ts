"use client";

import { useCallback, useEffect, useState } from "react";
import { getPropertyById } from "@/features/properties/api";
import type { Property } from "@/features/properties/types";
import { useAdminModeStore } from "@/features/adminMode/adminModeStore";

type UsePropertyDetailsResult = {
  property: Property | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<Property | null>;
  applyNoteLastOpenedAt: (openedAt: string | null) => void;
};

export function usePropertyDetails(
  id: string | null | undefined,
): UsePropertyDetailsResult {
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isAdminMode = useAdminModeStore((state) => state.isAdminMode);

  const applyNoteLastOpenedAt = useCallback((openedAt: string | null) => {
    setProperty((previous) => {
      if (!previous || previous.noteLastOpenedAt === undefined) {
        return previous;
      }
      return { ...previous, noteLastOpenedAt: openedAt };
    });
  }, []);

  const load = useCallback(async (): Promise<Property | null> => {
    if (!id) {
      setProperty(null);
      setError(null);
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const next = await getPropertyById(id);
      setProperty(next);
      if (!next) {
        setError("განცხადება ვერ მოიძებნა.");
      }
      return next;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "განცხადების დეტალების ჩატვირთვა ვერ მოხერხდა.";
      setError(message);
      setProperty(null);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [id, isAdminMode]);

  useEffect(() => {
    void load();
  }, [load]);

  return { property, isLoading, error, refetch: load, applyNoteLastOpenedAt };
}
