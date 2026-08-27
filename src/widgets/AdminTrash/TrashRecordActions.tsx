"use client";

import { useState } from "react";
import { isRecordArchived } from "@/features/lifecycle/isRecordArchived";
import { TRASH_COPY } from "@/features/adminTrash/trashCopy";
import {
  permanentlyDeleteAdminTrashClient,
  permanentlyDeleteAdminTrashProperty,
  restoreAdminTrashClient,
  restoreAdminTrashProperty,
} from "@/features/adminTrash/api";
import { showFeedbackSnackbar } from "@/features/recordUndo/undoSnackbarStore";
import { PermanentDeleteDialog } from "@/widgets/AdminTrash/PermanentDeleteDialog";

type TrashRecordKind = "property" | "client";

type TrashRecordActionsProps = {
  kind: TrashRecordKind;
  recordId: string;
  archivedAt: string | null;
  onCompleted: () => void;
};

export function TrashRecordActions({
  kind,
  recordId,
  archivedAt,
  onCompleted,
}: TrashRecordActionsProps) {
  const [isRestoring, setIsRestoring] = useState(false);
  const [isPermanentOpen, setIsPermanentOpen] = useState(false);
  const [isPermanentPending, setIsPermanentPending] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  async function handleRestore() {
    setIsRestoring(true);
    setActionError(null);
    try {
      const restored =
        kind === "property"
          ? await restoreAdminTrashProperty(recordId)
          : await restoreAdminTrashClient(recordId);
      const restoredToArchive = isRecordArchived({
        archivedAt: restored.archivedAt ?? archivedAt,
      });
      showFeedbackSnackbar({
        kind: "success",
        message: restoredToArchive
          ? TRASH_COPY.restoredToArchive
          : TRASH_COPY.restored,
      });
      onCompleted();
    } catch (restoreError) {
      const message =
        restoreError instanceof Error
          ? restoreError.message
          : TRASH_COPY.restoreFailed;
      setActionError(message);
      showFeedbackSnackbar({ kind: "error", message });
      onCompleted();
    } finally {
      setIsRestoring(false);
    }
  }

  async function handlePermanentDelete() {
    setIsPermanentPending(true);
    setActionError(null);
    try {
      if (kind === "property") {
        await permanentlyDeleteAdminTrashProperty(recordId);
      } else {
        await permanentlyDeleteAdminTrashClient(recordId);
      }
      setIsPermanentOpen(false);
      showFeedbackSnackbar({
        kind: "success",
        message: TRASH_COPY.permanentlyDeleted,
      });
      onCompleted();
    } catch (deleteError) {
      const message =
        deleteError instanceof Error
          ? deleteError.message
          : TRASH_COPY.permanentFailed;
      setActionError(message);
      showFeedbackSnackbar({ kind: "error", message });
      onCompleted();
    } finally {
      setIsPermanentPending(false);
    }
  }

  return (
    <>
      <div className="flex flex-wrap items-center justify-end gap-1.5">
        <button
          type="button"
          disabled={isRestoring || isPermanentPending}
          onClick={() => {
            void handleRestore();
          }}
          className="inline-flex items-center rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-foreground shadow-sm transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isRestoring ? "მუშავდება…" : TRASH_COPY.restore}
        </button>
        <button
          type="button"
          disabled={isRestoring || isPermanentPending}
          onClick={() => {
            setActionError(null);
            setIsPermanentOpen(true);
          }}
          className="inline-flex items-center rounded-full border border-destructive/20 bg-destructive/10 px-3 py-1 text-xs font-medium text-destructive shadow-sm transition hover:bg-destructive/15 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {TRASH_COPY.permanentDelete}
        </button>
      </div>
      {actionError ? (
        <p className="mt-1 text-xs text-destructive" role="alert">
          {actionError}
        </p>
      ) : null}
      <PermanentDeleteDialog
        open={isPermanentOpen}
        isProcessing={isPermanentPending}
        error={actionError}
        onConfirm={() => {
          void handlePermanentDelete();
        }}
        onCancel={() => {
          if (!isPermanentPending) {
            setIsPermanentOpen(false);
            setActionError(null);
          }
        }}
      />
    </>
  );
}
