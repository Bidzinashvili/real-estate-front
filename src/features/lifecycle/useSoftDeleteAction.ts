"use client";

import { useState } from "react";
import { isRecordArchived } from "@/features/lifecycle/isRecordArchived";
import { UNDO_COPY } from "@/features/recordUndo/undoCopy";
import {
  showFeedbackSnackbar,
  showUndoSnackbar,
} from "@/features/recordUndo/undoSnackbarStore";

type RestoredRecord = {
  archivedAt?: string | null;
} | null;

type UseSoftDeleteActionOptions = {
  canManage: boolean;
  onDelete: () => Promise<unknown>;
  onRestore: () => Promise<RestoredRecord | unknown>;
  onSuccess: () => void;
  onDeleted?: () => void;
};

function isRestoredRecord(value: unknown): value is { archivedAt?: string | null } {
  return typeof value === "object" && value !== null;
}

export function useSoftDeleteAction({
  canManage,
  onDelete,
  onRestore,
  onSuccess,
  onDeleted,
}: UseSoftDeleteActionOptions) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canShowDelete = canManage;

  function requestDelete() {
    setError(null);
    setIsConfirmOpen(true);
  }

  function cancel() {
    if (isPending) {
      return;
    }
    setIsConfirmOpen(false);
    setError(null);
  }

  async function confirm() {
    if (!isConfirmOpen) {
      return;
    }
    setIsPending(true);
    setError(null);
    try {
      await onDelete();
      setIsConfirmOpen(false);
      onDeleted?.();
      showUndoSnackbar({
        message: UNDO_COPY.deletedMessage,
        onUndo: async () => {
          try {
            const restored = await onRestore();
            onSuccess();
            const restoredToArchive =
              isRestoredRecord(restored) && isRecordArchived(restored);
            showFeedbackSnackbar({
              kind: "success",
              message: restoredToArchive
                ? UNDO_COPY.restoredToArchive
                : UNDO_COPY.restored,
            });
          } catch (restoreError) {
            onSuccess();
            const message =
              restoreError instanceof Error
                ? restoreError.message
                : UNDO_COPY.undoFailed;
            showFeedbackSnackbar({
              kind: "error",
              message,
            });
            throw restoreError;
          }
        },
      });
      onDeleted?.();
    } catch (actionError) {
      const message =
        actionError instanceof Error
          ? actionError.message
          : "ჩანაწერის წაშლა ვერ მოხერხდა.";
      setError(message);
    } finally {
      setIsPending(false);
    }
  }

  return {
    isConfirmOpen,
    isPending,
    error,
    canShowDelete,
    requestDelete,
    cancel,
    confirm,
  };
}
