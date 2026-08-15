"use client";

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel: string;
  isProcessing?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel,
  isProcessing = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary/40 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-card p-5 shadow-lg ring-1 ring-border">
        <h2 className="text-base font-semibold text-foreground">{title}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>

        <div className="mt-5 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isProcessing}
            className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground shadow-sm transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-70"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isProcessing}
            className="rounded-full bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isProcessing ? "მუშავდება…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

