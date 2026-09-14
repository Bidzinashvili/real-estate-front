"use client";

import { useState } from "react";
import { UNDO_COPY } from "@/features/recordUndo/undoCopy";
import {
  showFeedbackSnackbar,
  showUndoSnackbar,
} from "@/features/recordUndo/undoSnackbarStore";
import type { ArchiveConfirmKind } from "@/widgets/Lifecycle/ArchiveConfirmDialog";

type UseArchiveActionOptions = {
  canManage: boolean;
  isArchived: boolean;
  canRestore: boolean;
  onArchive: () => Promise<unknown>;
  onRestore: () => Promise<unknown>;
  onSuccess: () => void;
};

export function useArchiveAction({
  canManage,
  isArchived,
  canRestore,
  onArchive,
  onRestore,
  onSuccess,
}: UseArchiveActionOptions) {
  const [confirmKind, setConfirmKind] = useState<ArchiveConfirmKind | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canShowArchive = canManage && !isArchived;
  const canShowRestore = canManage && canRestore;

  function requestArchive() {
    setError(null);
    setConfirmKind("archive");
  }

  function requestRestore() {
    setError(null);
    setConfirmKind("restore");
  }

  function cancel() {
    if (isPending) {
      return;
    }
    setConfirmKind(null);
    setError(null);
  }

  async function confirm() {
    if (confirmKind === null) {
      return;
    }
    setIsPending(true);
    setError(null);
    try {
      if (confirmKind === "archive") {
        await onArchive();
        setConfirmKind(null);
        onSuccess();
        showUndoSnackbar({
          message: UNDO_COPY.archivedMessage,
          onUndo: async () => {
            try {
              await onRestore();
              onSuccess();
              showFeedbackSnackbar({
                kind: "success",
                message: UNDO_COPY.unarchived,
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
      } else {
        await onRestore();
        setConfirmKind(null);
        onSuccess();
      }
    } catch (actionError) {
      const message =
        actionError instanceof Error
          ? actionError.message
          : "მოქმედება ვერ შესრულდა.";
      setError(message);
    } finally {
      setIsPending(false);
    }
  }

  return {
    confirmKind,
    isPending,
    error,
    canShowArchive,
    canShowRestore,
    requestArchive,
    requestRestore,
    cancel,
    confirm,
  };
}
