"use client";

import { DELETE_COPY } from "@/features/lifecycle/deleteCopy";
import { ConfirmDialog } from "@/widgets/ConfirmDialog/ConfirmDialog";

type DeleteConfirmDialogProps = {
  open: boolean;
  isProcessing?: boolean;
  error?: string | null;
  onConfirm: () => void;
  onCancel: () => void;
};

export function DeleteConfirmDialog({
  open,
  isProcessing = false,
  error = null,
  onConfirm,
  onCancel,
}: DeleteConfirmDialogProps) {
  return (
    <ConfirmDialog
      open={open}
      title={DELETE_COPY.confirmTitle}
      description={DELETE_COPY.confirmDescription}
      confirmLabel={DELETE_COPY.confirmYes}
      cancelLabel={DELETE_COPY.cancel}
      isProcessing={isProcessing}
      tone="danger"
      error={error}
      onConfirm={onConfirm}
      onCancel={onCancel}
    />
  );
}
