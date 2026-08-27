"use client";

import { useState } from "react";
import { updateClient } from "@/features/clients/api";
import { HIDE_FROM_OTHERS_COPY } from "@/features/hideFromOthers/hideFromOthersCopy";
import { updateProperty } from "@/features/properties/api";

type HideFromOthersKind = "property" | "client";

type UseUpdateHideFromOthersResult = {
  saveHideFromOthers: (
    kind: HideFromOthersKind,
    recordId: string,
    hideFromOthers: boolean,
  ) => Promise<void>;
  isSaving: boolean;
  error: string | null;
};

export function useUpdateHideFromOthers(): UseUpdateHideFromOthersResult {
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function saveHideFromOthers(
    kind: HideFromOthersKind,
    recordId: string,
    hideFromOthers: boolean,
  ): Promise<void> {
    setIsSaving(true);
    setError(null);
    try {
      if (kind === "property") {
        await updateProperty(recordId, { hideFromOthers });
        return;
      }
      await updateClient(recordId, { hideFromOthers });
    } catch (caught) {
      const message =
        caught instanceof Error ? caught.message : HIDE_FROM_OTHERS_COPY.saveError;
      setError(message);
      throw caught;
    } finally {
      setIsSaving(false);
    }
  }

  return { saveHideFromOthers, isSaving, error };
}
