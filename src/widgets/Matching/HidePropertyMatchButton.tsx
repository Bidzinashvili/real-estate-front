"use client";

import { EyeOff } from "lucide-react";
import { HIDDEN_PROPERTY_COPY } from "@/features/clientHiddenProperties/hiddenPropertyCopy";

type HidePropertyMatchButtonProps = {
  isPending: boolean;
  onHide: () => void;
};

export function HidePropertyMatchButton({
  isPending,
  onHide,
}: HidePropertyMatchButtonProps) {
  return (
    <button
      type="button"
      onClick={onHide}
      disabled={isPending}
      className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-sm transition hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-60"
    >
      <EyeOff className="h-3.5 w-3.5" aria-hidden="true" />
      {isPending ? "იმალება…" : HIDDEN_PROPERTY_COPY.hideAction}
    </button>
  );
}
