"use client";

import { Lock } from "lucide-react";
import type { LockState } from "@/features/clients/clientApi.types";
import { cyclePersistentLockState } from "@/features/matching/persistEntityLock";

type PreferenceLockButtonProps = {
  value: LockState;
  onChange: (next: LockState) => void;
  disabled?: boolean;
};

const LOCK_TITLE: Record<"none" | "frozen", string> = {
  none: "არ არის გაყინული — დააჭირეთ მკაცრ პირობად გასაყინად",
  frozen: "გაყინული მკაცრი პირობა — დააჭირეთ გასასუფთავებლად",
};

const LOCK_BUTTON_CLASS: Record<"none" | "frozen", string> = {
  none: "border-border bg-muted text-muted-foreground hover:bg-accent",
  frozen: "border-destructive/40 bg-destructive/10 text-destructive hover:bg-destructive/15",
};

function toPersistentLock(value: LockState): "none" | "frozen" {
  return value === "frozen" ? "frozen" : "none";
}

export function PreferenceLockButton({
  value,
  onChange,
  disabled = false,
}: PreferenceLockButtonProps) {
  const persistentLock = toPersistentLock(value);
  return (
    <button
      type="button"
      disabled={disabled}
      title={LOCK_TITLE[persistentLock]}
      aria-label={LOCK_TITLE[persistentLock]}
      onClick={() => onChange(cyclePersistentLockState(value))}
      className={`inline-flex h-9 w-9 flex-none items-center justify-center rounded-lg border transition ${LOCK_BUTTON_CLASS[persistentLock]} disabled:cursor-not-allowed disabled:opacity-50`}
    >
      <Lock className="h-4 w-4" aria-hidden="true" />
    </button>
  );
}
