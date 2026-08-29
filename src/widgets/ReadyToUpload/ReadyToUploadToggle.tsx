"use client";

import type { MouseEvent } from "react";
import { Check, Upload } from "lucide-react";
import { READY_TO_UPLOAD_COPY } from "@/features/readyToUpload/readyToUploadCopy";
import { cn } from "@/shared/lib/utils";

type ReadyToUploadToggleProps = {
  isReady: boolean;
  disabled?: boolean;
  variant?: "icon" | "button";
  onToggle: (nextReady: boolean) => void;
};

export function ReadyToUploadToggle({
  isReady,
  disabled = false,
  variant = "button",
  onToggle,
}: ReadyToUploadToggleProps) {
  const actionLabel = isReady
    ? READY_TO_UPLOAD_COPY.activeLabel
    : READY_TO_UPLOAD_COPY.markLabel;
  const title = isReady
    ? READY_TO_UPLOAD_COPY.hint
    : READY_TO_UPLOAD_COPY.markLabel;

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();
    if (disabled) {
      return;
    }
    onToggle(!isReady);
  }

  if (variant === "icon") {
    return (
      <button
        type="button"
        disabled={disabled}
        aria-pressed={isReady}
        aria-label={actionLabel}
        title={title}
        onClick={handleClick}
        className={cn(
          "inline-flex h-9 w-9 items-center justify-center rounded-full border shadow-sm transition disabled:cursor-not-allowed disabled:opacity-60",
          isReady
            ? "border-sky-700 bg-sky-700 text-white"
            : "border-border bg-card text-foreground hover:bg-muted",
        )}
      >
        <Upload className="h-4 w-4" aria-hidden />
      </button>
    );
  }

  return (
    <button
      type="button"
      disabled={disabled}
      aria-pressed={isReady}
      title={title}
      onClick={handleClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium shadow-sm transition disabled:cursor-not-allowed disabled:opacity-60",
        isReady
          ? "border-sky-700 bg-sky-700 text-white"
          : "border-border bg-card text-foreground hover:bg-muted",
      )}
    >
      {isReady ? (
        <Check className="h-3.5 w-3.5 shrink-0" aria-hidden />
      ) : (
        <Upload className="h-3.5 w-3.5 shrink-0" aria-hidden />
      )}
      {actionLabel}
    </button>
  );
}
