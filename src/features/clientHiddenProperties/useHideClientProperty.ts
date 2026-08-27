"use client";

import { useCallback, useRef, useState } from "react";
import { hideClientProperty } from "@/features/clientHiddenProperties/api";
import { HIDDEN_PROPERTY_COPY } from "@/features/clientHiddenProperties/hiddenPropertyCopy";
import { emitClientHiddenPropertiesChanged } from "@/features/clientHiddenProperties/hiddenPropertyEvents";
import { showFeedbackSnackbar } from "@/features/recordUndo/undoSnackbarStore";

type UseHideClientPropertyResult = {
  hideProperty: (propertyId: string) => Promise<boolean>;
  isPropertyPending: (propertyId: string) => boolean;
  error: string | null;
};

export function useHideClientProperty(clientId: string): UseHideClientPropertyResult {
  const pendingPropertyIdsRef = useRef<string[]>([]);
  const [pendingPropertyIds, setPendingPropertyIds] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const isPropertyPending = useCallback(
    (propertyId: string) => pendingPropertyIds.includes(propertyId),
    [pendingPropertyIds],
  );

  const hideProperty = useCallback(
    async (propertyId: string): Promise<boolean> => {
      if (pendingPropertyIdsRef.current.includes(propertyId)) {
        return false;
      }
      pendingPropertyIdsRef.current = [...pendingPropertyIdsRef.current, propertyId];
      setPendingPropertyIds(pendingPropertyIdsRef.current);
      setError(null);
      try {
        await hideClientProperty(clientId, propertyId);
        emitClientHiddenPropertiesChanged(clientId);
        showFeedbackSnackbar({
          kind: "success",
          message: HIDDEN_PROPERTY_COPY.hideSuccess,
        });
        return true;
      } catch (hideError) {
        const message =
          hideError instanceof Error ? hideError.message : HIDDEN_PROPERTY_COPY.hideError;
        setError(message);
        showFeedbackSnackbar({ kind: "error", message });
        return false;
      } finally {
        pendingPropertyIdsRef.current = pendingPropertyIdsRef.current.filter(
          (currentId) => currentId !== propertyId,
        );
        setPendingPropertyIds(pendingPropertyIdsRef.current);
      }
    },
    [clientId],
  );

  return { hideProperty, isPropertyPending, error };
}
