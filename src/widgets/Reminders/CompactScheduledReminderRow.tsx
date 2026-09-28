"use client";

import { useState } from "react";
import type { DashboardReminderRow } from "@/features/reminders/dashboardReminderNormalizer";
import { isLifecycleReminderId } from "@/features/reminders/dashboardReminderNormalizer";
import {
  formatReminderRowDate,
  formatReminderRowTime,
} from "@/features/reminders/formatReminderSchedule";
import { deleteReminder } from "@/features/reminders/remindersApi";
import { toUserFacingReminderError } from "@/features/reminders/reminderErrorMessages";
import { ReminderPickerModal } from "@/widgets/Reminders/ReminderPickerModal";
import { ConfirmDialog } from "@/widgets/ConfirmDialog/ConfirmDialog";

type CompactScheduledReminderRowProps = {
  reminder: DashboardReminderRow;
  canManage: boolean;
  onChanged: () => void;
};

export function CompactScheduledReminderRow({
  reminder,
  canManage,
  onChanged,
}: CompactScheduledReminderRowProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isWorking, setIsWorking] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const isMutableId = !isLifecycleReminderId(reminder.id);
  const showActions = canManage && isMutableId;

  async function handleDeleteConfirm() {
    setActionError(null);
    setIsWorking(true);
    try {
      await deleteReminder(reminder.id);
      setIsDeleteOpen(false);
      onChanged();
    } catch (errorUnknown) {
      setActionError(
        toUserFacingReminderError(errorUnknown, "შეხსენების წაშლა ვერ მოხერხდა."),
      );
    } finally {
      setIsWorking(false);
    }
  }

  return (
    <>
      <div className="flex flex-col gap-1 border-b border-border/70 py-2.5 last:border-b-0 last:pb-0 first:pt-0">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-sm">
          <span className="shrink-0 tabular-nums text-foreground">
            {formatReminderRowDate(reminder.notifyAt)}
          </span>
          <span className="shrink-0 tabular-nums text-muted-foreground">
            {formatReminderRowTime(reminder.notifyAt)}
          </span>
          <span className="min-w-0 flex-1 truncate text-foreground">
            {reminder.note?.trim() ? reminder.note : "\u00a0"}
          </span>
          {showActions ? (
            <div className="ml-auto flex shrink-0 items-center gap-1.5">
              <button
                type="button"
                onClick={() => setIsEditOpen(true)}
                className="rounded-md px-2 py-1 text-xs font-medium text-primary transition hover:bg-primary/10"
              >
                რედაქტირება
              </button>
              <button
                type="button"
                onClick={() => setIsDeleteOpen(true)}
                className="rounded-md px-2 py-1 text-xs font-medium text-destructive transition hover:bg-destructive/10"
              >
                წაშლა
              </button>
            </div>
          ) : null}
        </div>
        {actionError ? (
          <p className="text-xs text-destructive" role="alert">
            {actionError}
          </p>
        ) : null}
      </div>

      {isEditOpen ? (
        <ReminderPickerModal
          mode="edit"
          open
          reminderId={reminder.id}
          initialNotifyAt={reminder.notifyAt}
          initialNote={reminder.note}
          onClose={() => setIsEditOpen(false)}
          onSaved={onChanged}
        />
      ) : null}

      <ConfirmDialog
        open={isDeleteOpen}
        title="წავშალოთ ეს შეხსენება?"
        description="შეხსენება წაიშლება. სხვა შეხსენებები არ შეიცვლება."
        confirmLabel="წაშლა"
        cancelLabel="გაუქმება"
        isProcessing={isWorking}
        onConfirm={() => {
          void handleDeleteConfirm();
        }}
        onCancel={() => {
          if (!isWorking) {
            setIsDeleteOpen(false);
          }
        }}
      />
    </>
  );
}
