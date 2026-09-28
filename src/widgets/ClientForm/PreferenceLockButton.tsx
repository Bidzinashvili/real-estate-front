"use client";

import type { ReactNode } from "react";
import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { CircleHelp, Lock, LockOpen, Snowflake } from "lucide-react";
import {
  cycleClientFormLockState,
  cycleClientSearchLockState,
} from "@/features/clients/clientApi.types";
import type { LockState } from "@/features/matching/matchingEnums";

export type PreferenceLockMode = "client-form" | "client-search";

type PreferenceLockButtonProps = {
  value: LockState;
  onChange: (next: LockState) => void;
  disabled?: boolean;
  mode?: PreferenceLockMode;
  isPersistedFrozen?: boolean;
};

const CLIENT_FORM_LOCK_HINT: Record<"none" | "frozen", string> = {
  none: "ჩვეულებრივი პირობა — შენახვისას შეიძლება შეიცვალოს.",
  frozen: "აუცილებელი პირობა — ინახება კლიენტთან და ყოველთვის მოქმედებს.",
};

const CLIENT_SEARCH_LOCK_HINT: Record<"none" | "locked" | "frozen", string> = {
  none: "ჩვეულებრივი ფილტრი — ამ ძებნაში შეგიძლიათ გამოტოვოთ.",
  locked: "დროებით აუცილებელი — ამ ძებნაში მხოლოდ შესაბამისი განცხადებები.",
  frozen: "შენახული აუცილებელი — უკვე მოქმედებს კლიენტის მოთხოვნაში.",
};

const LOCK_BUTTON_CLASS: Record<"none" | "locked" | "frozen", string> = {
  none: "border-border bg-muted text-muted-foreground hover:bg-accent",
  locked: "border-destructive/50 bg-destructive/10 text-destructive hover:bg-destructive/15",
  frozen: "border-destructive/50 bg-destructive/10 text-destructive hover:bg-destructive/15",
};

function normalizeClientFormLock(value: LockState): "none" | "frozen" {
  return value === "frozen" ? "frozen" : "none";
}

function normalizeClientSearchLock(
  value: LockState,
  isPersistedFrozen: boolean,
): "none" | "locked" | "frozen" {
  if (isPersistedFrozen || value === "frozen") {
    return "frozen";
  }
  return value === "locked" ? "locked" : "none";
}

function hintForLockButton(
  mode: PreferenceLockMode,
  displayLock: "none" | "locked" | "frozen",
): string {
  if (mode === "client-form") {
    return displayLock === "frozen"
      ? CLIENT_FORM_LOCK_HINT.frozen
      : CLIENT_FORM_LOCK_HINT.none;
  }
  return CLIENT_SEARCH_LOCK_HINT[displayLock];
}

type LockHelpPopoverProps = {
  hint: string;
  isOpen: boolean;
  anchorRef: React.RefObject<HTMLButtonElement | null>;
  onClose: () => void;
};

function LockHelpPopover({ hint, isOpen, anchorRef, onClose }: LockHelpPopoverProps) {
  const popoverRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);

  useEffect(() => {
    if (!isOpen || !anchorRef.current) {
      return;
    }

    function updatePosition() {
      const anchorNode = anchorRef.current;
      if (!anchorNode) {
        return;
      }
      const rect = anchorNode.getBoundingClientRect();
      const width = 240;
      const left = Math.min(
        Math.max(8, rect.left),
        Math.max(8, window.innerWidth - width - 8),
      );
      setPosition({ top: rect.bottom + 4, left });
    }

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [anchorRef, isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    function handlePointerDown(event: PointerEvent) {
      const targetNode = event.target as Node;
      if (anchorRef.current?.contains(targetNode)) {
        return;
      }
      if (popoverRef.current?.contains(targetNode)) {
        return;
      }
      onClose();
    }
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [anchorRef, isOpen, onClose]);

  if (!isOpen || !position || typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <div
      ref={popoverRef}
      role="tooltip"
      className="fixed z-[100] max-w-[240px] rounded-lg border border-border bg-popover px-3 py-2 text-xs leading-snug text-popover-foreground shadow-md"
      style={{ top: position.top, left: position.left }}
    >
      {hint}
    </div>,
    document.body,
  );
}

export function PreferenceLockButton({
  value,
  onChange,
  disabled = false,
  mode = "client-search",
  isPersistedFrozen = false,
}: PreferenceLockButtonProps) {
  const helpAnchorRef = useRef<HTMLButtonElement>(null);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const helpControlId = useId();

  const displayLock =
    mode === "client-form"
      ? normalizeClientFormLock(value)
      : normalizeClientSearchLock(value, isPersistedFrozen);

  const hint = hintForLockButton(mode, displayLock);
  const lockControlDisabled = disabled || (mode === "client-search" && isPersistedFrozen);

  function handleLockClick() {
    if (lockControlDisabled) {
      return;
    }
    if (mode === "client-form") {
      onChange(cycleClientFormLockState(value));
      return;
    }
    onChange(cycleClientSearchLockState(displayLock === "locked" ? "locked" : "none"));
  }

  return (
    <div className="inline-flex items-center gap-0.5">
      <button
        type="button"
        disabled={lockControlDisabled}
        aria-label={hint}
        onClick={handleLockClick}
        className={`relative inline-flex h-9 w-9 flex-none items-center justify-center overflow-visible rounded-lg border transition ${LOCK_BUTTON_CLASS[displayLock]} disabled:cursor-not-allowed disabled:opacity-50`}
      >
        {displayLock === "none" ? (
          <LockOpen className="h-4 w-4" aria-hidden="true" />
        ) : (
          <Lock className="h-4 w-4" aria-hidden="true" />
        )}
        {displayLock === "frozen" ? (
          <Snowflake
            className="absolute -right-1 -top-1 h-3.5 w-3.5 text-destructive"
            aria-hidden="true"
          />
        ) : null}
      </button>
      <button
        ref={helpAnchorRef}
        type="button"
        id={helpControlId}
        aria-label={`${hint} — დახმარება`}
        aria-expanded={isHelpOpen}
        onClick={() => setIsHelpOpen((previous) => !previous)}
        className="inline-flex h-9 w-7 flex-none items-center justify-center rounded-lg text-muted-foreground transition hover:bg-accent hover:text-foreground"
      >
        <CircleHelp className="h-3.5 w-3.5" aria-hidden="true" />
      </button>
      <LockHelpPopover
        hint={hint}
        isOpen={isHelpOpen}
        anchorRef={helpAnchorRef}
        onClose={() => setIsHelpOpen(false)}
      />
    </div>
  );
}

type FieldWithLockProps = {
  lock: LockState;
  onLockChange: (next: LockState) => void;
  disabled?: boolean;
  labelOffset?: boolean;
  lockMode?: PreferenceLockMode;
  children: ReactNode;
};

export function FieldWithLock({
  lock,
  onLockChange,
  disabled = false,
  labelOffset = true,
  lockMode = "client-search",
  children,
}: FieldWithLockProps) {
  return (
    <div className="flex items-start gap-2">
      <div className="min-w-0 flex-1">{children}</div>
      <div className={labelOffset ? "pt-7" : "pt-1"}>
        <PreferenceLockButton
          value={lock}
          onChange={onLockChange}
          disabled={disabled}
          mode={lockMode}
        />
      </div>
    </div>
  );
}

export function ClientFormLockHint() {
  return (
    <p className="text-xs text-muted-foreground">
      ღია საკეტი — ჩვეულებრივი პირობა. წითელი საკეტი ფიფქით — აუცილებელი პირობა, რომელიც
      ინახება კლიენტთან. დახმარების ხატულაზე დააჭირეთ მოკლე ახსნისთვის.
    </p>
  );
}

export function ClientSearchLockHint() {
  return (
    <p className="text-xs text-muted-foreground">
      ღია საკეტი — ჩვეულებრივი ფილტრი ამ ძებნისთვის. წითელი დაკეტილი საკეტი — დროებით
      აუცილებელი პირობა მხოლოდ ამ შესაბამისობის ძებნაში. ფიფქიანი საკეტი — უკვე შენახული
      აუცილებელი პირობა. დახმარების ხატულაზე დააჭირეთ მოკლე ახსნისთვის.
    </p>
  );
}

export function MatchingLockHint() {
  return <ClientSearchLockHint />;
}
