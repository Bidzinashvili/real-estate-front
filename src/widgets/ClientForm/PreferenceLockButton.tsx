"use client";

import { Lock } from "lucide-react";
import { cycleLockState, type LockState } from "@/features/clients/clientApi.types";

type PreferenceLockButtonProps = {
  value: LockState;
  onChange: (next: LockState) => void;
  disabled?: boolean;
};

const LOCK_TITLE: Record<LockState, string> = {
  none: "Preference stored but not used as a strict filter (click to lock)",
  locked: "Strict match when filtering (click for frozen)",
  frozen: "Strict match — frozen (same as locked for the API; click to clear lock)",
};

const LOCK_BUTTON_CLASS: Record<LockState, string> = {
  none: "border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100",
  locked: "border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100",
  frozen: "border-rose-300 bg-rose-50 text-rose-700 hover:bg-rose-100",
};

export function PreferenceLockButton({
  value,
  onChange,
  disabled = false,
}: PreferenceLockButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      title={LOCK_TITLE[value]}
      aria-label={LOCK_TITLE[value]}
      onClick={() => onChange(cycleLockState(value))}
      className={`inline-flex h-9 w-9 flex-none items-center justify-center rounded-lg border transition ${LOCK_BUTTON_CLASS[value]} disabled:cursor-not-allowed disabled:opacity-50`}
    >
      <Lock className="h-4 w-4" aria-hidden="true" />
    </button>
  );
}
