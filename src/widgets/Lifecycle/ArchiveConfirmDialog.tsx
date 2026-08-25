"use client";

import { ARCHIVE_COPY } from "@/features/lifecycle/archiveCopy";
import { ConfirmDialog } from "@/widgets/ConfirmDialog/ConfirmDialog";

export type ArchiveConfirmKind = "archive" | "restore";

type ArchiveConfirmDialogProps = {
  open: boolean;
  kind: ArchiveConfirmKind;
  isProcessing?: boolean;
  error?: string | null;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ArchiveConfirmDialog({
  open,
  kind,
  isProcessing = false,
  error = null,
  onConfirm,
  onCancel,
}: ArchiveConfirmDialogProps) {
  const isRestore = kind === "restore";

  return (
    <ConfirmDialog
      open={open}
      title={
        isRestore
          ? ARCHIVE_COPY.confirmRestoreTitle
          : ARCHIVE_COPY.confirmArchiveTitle
      }
      description={
        isRestore
          ? ARCHIVE_COPY.confirmRestoreDescription
          : ARCHIVE_COPY.confirmArchiveDescription
      }
      confirmLabel={ARCHIVE_COPY.confirmYes}
      cancelLabel={ARCHIVE_COPY.cancel}
      isProcessing={isProcessing}
      tone="primary"
      error={error}
      onConfirm={onConfirm}
      onCancel={onCancel}
    />
  );
}
