"use client";

import type { OutcomeSource } from "@/features/lifecycle/lifecycleEnums";
import {
  CLIENT_OUTCOME_SOURCE_LABELS,
  OUTCOME_SOURCE_LABELS,
} from "@/features/lifecycle/lifecycleLabels";

type OutcomeSourcePickerProps = {
  value: OutcomeSource | "";
  onChange: (nextValue: OutcomeSource) => void;
  variant?: "property" | "client";
  disabled?: boolean;
  groupAriaLabel?: string;
};

export function OutcomeSourcePicker({
  value,
  onChange,
  variant = "property",
  disabled = false,
  groupAriaLabel,
}: OutcomeSourcePickerProps) {
  const labels = variant === "client" ? CLIENT_OUTCOME_SOURCE_LABELS : OUTCOME_SOURCE_LABELS;
  const resolvedAriaLabel =
    groupAriaLabel ?? (variant === "client" ? "ვინ დააბინავა" : "ვინ დაასრულა");

  return (
    <div className="grid grid-cols-2 gap-2" role="group" aria-label={resolvedAriaLabel}>
      <button
        type="button"
        disabled={disabled}
        aria-pressed={value === "BY_ME"}
        onClick={() => onChange("BY_ME")}
        className={`rounded-xl border px-3 py-2.5 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-60 ${
          value === "BY_ME"
            ? "border-success bg-success-muted text-success-foreground"
            : "border-border bg-card text-foreground hover:bg-muted"
        }`}
      >
        {labels.BY_ME}
      </button>
      <button
        type="button"
        disabled={disabled}
        aria-pressed={value === "BY_OTHER"}
        onClick={() => onChange("BY_OTHER")}
        className={`rounded-xl border px-3 py-2.5 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-60 ${
          value === "BY_OTHER"
            ? "border-destructive bg-destructive/10 text-destructive"
            : "border-border bg-card text-foreground hover:bg-muted"
        }`}
      >
        {labels.BY_OTHER}
      </button>
    </div>
  );
}
