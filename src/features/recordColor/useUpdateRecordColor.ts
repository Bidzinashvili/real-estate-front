"use client";

import { useState } from "react";
import { updateClient } from "@/features/clients/api";
import { updateProperty } from "@/features/properties/api";
import type { RecordColor } from "@/features/recordColor/recordColor";

type RecordColorKind = "property" | "client";

type UseUpdateRecordColorResult = {
  saveColor: (
    kind: RecordColorKind,
    recordId: string,
    color: RecordColor,
  ) => Promise<void>;
  isSaving: boolean;
  error: string | null;
};

export function useUpdateRecordColor(): UseUpdateRecordColorResult {
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function saveColor(
    kind: RecordColorKind,
    recordId: string,
    color: RecordColor,
  ): Promise<void> {
    setIsSaving(true);
    setError(null);
    try {
      if (kind === "property") {
        await updateProperty(recordId, { color });
        return;
      }
      await updateClient(recordId, { color });
    } catch (caught) {
      const message =
        caught instanceof Error ? caught.message : "ფერის შენახვა ვერ მოხერხდა.";
      setError(message);
      throw caught;
    } finally {
      setIsSaving(false);
    }
  }

  return { saveColor, isSaving, error };
}
