"use client";

import type { MouseEvent } from "react";
import { EyeOff } from "lucide-react";
import { HIDE_FROM_OTHERS_COPY } from "@/features/hideFromOthers/hideFromOthersCopy";
import { cn } from "@/shared/lib/utils";

type HideFromOthersToggleProps = {
  isHidden: boolean;
  disabled?: boolean;
  variant?: "icon" | "button" | "menuitem";
  onToggle: (nextHidden: boolean) => void;
};

export function HideFromOthersToggle({
  isHidden,
  disabled = false,
  variant = "button",
  onToggle,
}: HideFromOthersToggleProps) {
  const actionLabel = isHidden
    ? HIDE_FROM_OTHERS_COPY.revealLabel
    : HIDE_FROM_OTHERS_COPY.actionLabel;
  const title = isHidden
    ? HIDE_FROM_OTHERS_COPY.badgeLabel
    : HIDE_FROM_OTHERS_COPY.hint;

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();
    if (disabled) {
      return;
    }
    onToggle(!isHidden);
  }

  if (variant === "icon") {
    return (
      <button
        type="button"
        disabled={disabled}
        aria-pressed={isHidden}
        aria-label={actionLabel}
        title={title}
        onClick={handleClick}
        className={cn(
          "inline-flex h-9 w-9 items-center justify-center rounded-full border shadow-sm transition disabled:cursor-not-allowed disabled:opacity-60",
          isHidden
            ? "border-slate-800 bg-slate-800 text-white"
            : "border-border bg-card text-foreground hover:bg-muted",
        )}
      >
        <EyeOff className="h-4 w-4" aria-hidden />
      </button>
    );
  }

  if (variant === "menuitem") {
    return (
      <button
        type="button"
        role="menuitem"
        disabled={disabled}
        aria-pressed={isHidden}
        className="flex w-full px-3 py-2 text-left text-foreground transition hover:bg-muted disabled:opacity-60"
        onClick={handleClick}
      >
        {actionLabel}
      </button>
    );
  }

  return (
    <button
      type="button"
      disabled={disabled}
      aria-pressed={isHidden}
      title={title}
      onClick={handleClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium shadow-sm transition disabled:cursor-not-allowed disabled:opacity-60",
        isHidden
          ? "border-slate-800 bg-slate-800 text-white"
          : "border-border bg-card text-foreground hover:bg-muted",
      )}
    >
      <EyeOff className="h-3.5 w-3.5 shrink-0" aria-hidden />
      {HIDE_FROM_OTHERS_COPY.actionLabel}
    </button>
  );
}
