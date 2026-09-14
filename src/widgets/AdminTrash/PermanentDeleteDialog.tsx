"use client";

import { DELETE_COPY } from "@/features/lifecycle/deleteCopy";
import { ConfirmDialog } from "@/widgets/ConfirmDialog/ConfirmDialog";

type PermanentDeleteDialogProps = {
  open: boolean;
  isProcessing?: boolean;
  error?: string | null;
  onConfirm: () => void;
  onCancel: () => void;
};

export function PermanentDeleteDialog({
  open,
  isProcessing = false,
  error = null,
  onConfirm,
  onCancel,
}: PermanentDeleteDialogProps) {
  return (
    <ConfirmDialog
      open={open}
      title="სამუდამოდ წაშლა"
      description="ეს მოქმედება შეუქცევადია. ჩანაწერი სამუდამოდ წაიშლება."
      confirmLabel="სამუდამოდ წაშლა"
      cancelLabel={DELETE_COPY.cancel}
      isProcessing={isProcessing}
      tone="danger"
      error={error}
      onConfirm={onConfirm}
      onCancel={onCancel}
    />
  );
}
