"use client";

import type { ReactNode } from "react";
import { Lock, LockOpen, Snowflake } from "lucide-react";
import { cycleLockState } from "@/features/clients/clientApi.types";
import type { LockState } from "@/features/matching/matchingEnums";

type PreferenceLockButtonProps = {
  value: LockState;
  onChange: (next: LockState) => void;
  disabled?: boolean;
};

const LOCK_TITLE: Record<LockState, string> = {
  none: "ჩვეულებრივი ფილტრი",
  locked: "დროებით აუცილებელი პირობა",
  frozen: "შენახული აუცილებელი პირობა",
};

const LOCK_BUTTON_CLASS: Record<LockState, string> = {
  none: "border-border bg-muted text-muted-foreground hover:bg-accent",
  locked: "border-destructive/50 bg-destructive/10 text-destructive hover:bg-destructive/15",
  frozen: "border-destructive/50 bg-destructive/10 text-destructive hover:bg-destructive/15",
};

function normalizeLock(value: LockState): LockState {
  if (value === "locked" || value === "frozen") {
    return value;
  }
  return "none";
}

export function PreferenceLockButton({
  value,
  onChange,
  disabled = false,
}: PreferenceLockButtonProps) {
  const currentLock = normalizeLock(value);
  return (
    <button
      type="button"
      disabled={disabled}
      title={LOCK_TITLE[currentLock]}
      aria-label={LOCK_TITLE[currentLock]}
      onClick={() => onChange(cycleLockState(currentLock))}
      className={`relative inline-flex h-9 w-9 flex-none items-center justify-center overflow-visible rounded-lg border transition ${LOCK_BUTTON_CLASS[currentLock]} disabled:cursor-not-allowed disabled:opacity-50`}
    >
      {currentLock === "none" ? (
        <LockOpen className="h-4 w-4" aria-hidden="true" />
      ) : (
        <Lock className="h-4 w-4" aria-hidden="true" />
      )}
      {currentLock === "frozen" ? (
        <Snowflake
          className="absolute -right-1 -top-1 h-3.5 w-3.5 text-destructive"
          aria-hidden="true"
        />
      ) : null}
    </button>
  );
}

type FieldWithLockProps = {
  lock: LockState;
  onLockChange: (next: LockState) => void;
  disabled?: boolean;
  labelOffset?: boolean;
  children: ReactNode;
};

export function FieldWithLock({
  lock,
  onLockChange,
  disabled = false,
  labelOffset = true,
  children,
}: FieldWithLockProps) {
  return (
    <div className="flex items-start gap-2">
      <div className="min-w-0 flex-1">{children}</div>
      <div className={labelOffset ? "pt-7" : "pt-1"}>
        <PreferenceLockButton value={lock} onChange={onLockChange} disabled={disabled} />
      </div>
    </div>
  );
}

export function MatchingLockHint() {
  return (
    <p className="text-xs text-muted-foreground">
      ნაცრისფერი ღია საკეტი — ჩვეულებრივი ფილტრი. წითელი საკეტი — დროებითი აუცილებელი
      პირობა და შენახვისას არ რჩება. წითელი საკეტი ფიფქით — შენახული აუცილებელი პირობა.
    </p>
  );
}
