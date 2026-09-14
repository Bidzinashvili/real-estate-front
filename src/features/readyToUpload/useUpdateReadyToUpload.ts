"use client";

import { useState } from "react";
import { updateProperty } from "@/features/properties/api";
import { READY_TO_UPLOAD_COPY } from "@/features/readyToUpload/readyToUploadCopy";

type UseUpdateReadyToUploadResult = {
  saveReadyToUpload: (recordId: string, readyToUpload: boolean) => Promise<void>;
  isSaving: boolean;
  error: string | null;
};

export function useUpdateReadyToUpload(): UseUpdateReadyToUploadResult {
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function saveReadyToUpload(
    recordId: string,
    readyToUpload: boolean,
  ): Promise<void> {
    setIsSaving(true);
    setError(null);
    try {
      await updateProperty(recordId, { readyToUpload });
    } catch (caught) {
      const message =
        caught instanceof Error ? caught.message : READY_TO_UPLOAD_COPY.saveError;
      setError(message);
      throw caught;
    } finally {
      setIsSaving(false);
    }
  }

  return { saveReadyToUpload, isSaving, error };
}
