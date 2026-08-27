"use client";

import { useEffect, useRef, useState } from "react";
import { MoreHorizontal } from "lucide-react";
import type { DashboardReminderRow } from "@/features/reminders/dashboardReminderNormalizer";
import {
  deleteReminder,
  dismissReminder,
  snoozeReminder,
} from "@/features/reminders/remindersApi";
import { minutesUntilTomorrowMorning } from "@/features/reminders/formatReminderSchedule";
import { ConfirmDialog } from "@/widgets/ConfirmDialog/ConfirmDialog";

const SNOOZE_OPTIONS: { label: string; minutes: number | "tomorrow" }[] = [
  { label: "10 წუთი", minutes: 10 },
  { label: "30 წუთი", minutes: 30 },
  { label: "1 საათი", minutes: 60 },
  { label: "ხვალ", minutes: "tomorrow" },
];

type ReminderCardActionsProps = {
  reminder: DashboardReminderRow;
  onOpenNote: () => void;
  onEdit: () => void;
  onChanged: () => void;
};

export function ReminderCardActions({
  reminder,
  onOpenNote,
  onEdit,
  onChanged,
}: ReminderCardActionsProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSnoozeOpen, setIsSnoozeOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isWorking, setIsWorking] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    if (!isMenuOpen && !isSnoozeOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      const node = menuRef.current;
      if (!node) return;
      if (node.contains(event.target as Node)) return;
      setIsMenuOpen(false);
      setIsSnoozeOpen(false);
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [isMenuOpen, isSnoozeOpen]);

  const { actions } = reminder;
  const hasOverflowActions =
    actions.canUpdate || actions.canDelete || actions.canDismiss || actions.canSnooze;

  async function runAction(task: () => Promise<void>, fallback: string) {
    setActionError(null);
    setIsWorking(true);
    try {
      await task();
      setIsMenuOpen(false);
      setIsSnoozeOpen(false);
      onChanged();
    } catch (errorUnknown) {
      const message = errorUnknown instanceof Error ? errorUnknown.message : fallback;
      setActionError(message);
    } finally {
      setIsWorking(false);
    }
  }

  return (
    <div ref={menuRef} className="relative shrink-0">
      <div className="flex items-center justify-end gap-1">
        <button
          type="button"
          onClick={onOpenNote}
          className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground shadow-sm transition hover:bg-muted"
        >
          ჩანაწერის გახსნა
        </button>
        {hasOverflowActions ? (
          <button
            type="button"
            onClick={() => {
              setIsMenuOpen((previous) => !previous);
              setIsSnoozeOpen(false);
            }}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-sm transition hover:bg-muted hover:text-foreground"
            aria-label="შეხსენების მოქმედებები"
            aria-expanded={isMenuOpen}
          >
            <MoreHorizontal className="h-4 w-4" aria-hidden />
          </button>
        ) : null}
      </div>

      {isMenuOpen ? (
        <div
          role="menu"
          className="absolute right-0 z-20 mt-1 min-w-[11rem] overflow-hidden rounded-xl border border-border bg-card py-1 text-sm shadow-lg"
        >
          {actions.canUpdate ? (
            <button
              type="button"
              role="menuitem"
              className="flex w-full px-3 py-2 text-left text-foreground transition hover:bg-muted"
              onClick={() => {
                setIsMenuOpen(false);
                onEdit();
              }}
            >
              შეცვლა
            </button>
          ) : null}
          {actions.canSnooze ? (
            <button
              type="button"
              role="menuitem"
              className="flex w-full px-3 py-2 text-left text-foreground transition hover:bg-muted"
              onClick={() => {
                setIsSnoozeOpen(true);
                setIsMenuOpen(false);
              }}
            >
              გადადება
            </button>
          ) : null}
          {actions.canDismiss ? (
            <button
              type="button"
              role="menuitem"
              disabled={isWorking}
              className="flex w-full px-3 py-2 text-left text-foreground transition hover:bg-muted disabled:opacity-60"
              onClick={() =>
                void runAction(
                  () => dismissReminder(reminder.id),
                  "შეხსენების დამალვა ვერ მოხერხდა.",
                )
              }
            >
              დამალვა
            </button>
          ) : null}
          {actions.canDelete ? (
            <button
              type="button"
              role="menuitem"
              className="flex w-full px-3 py-2 text-left text-destructive transition hover:bg-destructive/10"
              onClick={() => {
                setIsMenuOpen(false);
                setIsDeleteOpen(true);
              }}
            >
              წაშლა
            </button>
          ) : null}
        </div>
      ) : null}

      {isSnoozeOpen ? (
        <div
          role="menu"
          className="absolute right-0 z-20 mt-1 min-w-[11rem] overflow-hidden rounded-xl border border-border bg-card py-1 text-sm shadow-lg"
        >
          {SNOOZE_OPTIONS.map((option) => (
            <button
              key={option.label}
              type="button"
              role="menuitem"
              disabled={isWorking}
              className="flex w-full px-3 py-2 text-left text-foreground transition hover:bg-muted disabled:opacity-60"
              onClick={() => {
                const minutes =
                  option.minutes === "tomorrow"
                    ? minutesUntilTomorrowMorning()
                    : option.minutes;
                void runAction(
                  () => snoozeReminder(reminder.id, minutes),
                  "შეხსენების გადადება ვერ მოხერხდა.",
                );
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      ) : null}

      {actionError ? (
        <p className="mt-2 max-w-[14rem] text-xs text-destructive" role="alert">
          {actionError}
        </p>
      ) : null}

      <ConfirmDialog
        open={isDeleteOpen}
        title="წავშალოთ ეს შეხსენება?"
        description="შეხსენება წაიშლება. ჩანაწერის სტატუსი არ შეიცვლება."
        confirmLabel="წაშლა"
        cancelLabel="გაუქმება"
        isProcessing={isWorking}
        onConfirm={() => {
          void runAction(() => deleteReminder(reminder.id), "შეხსენების წაშლა ვერ მოხერხდა.").then(
            () => {
              setIsDeleteOpen(false);
            },
          );
        }}
        onCancel={() => {
          if (!isWorking) setIsDeleteOpen(false);
        }}
      />
    </div>
  );
}
