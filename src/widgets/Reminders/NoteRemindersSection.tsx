"use client";

import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { useRemindersList } from "@/features/reminders/useRemindersList";
import type { DashboardReminderRow } from "@/features/reminders/dashboardReminderNormalizer";
import {
  REMINDERS_PER_RECORD_LIMIT,
  REMINDER_LIMIT_GEORGIAN_MESSAGE,
} from "@/features/reminders/reminderErrorMessages";
import { CompactScheduledReminderRow } from "@/widgets/Reminders/CompactScheduledReminderRow";
import { ReminderPickerModal } from "@/widgets/Reminders/ReminderPickerModal";

function isManualScheduledReminderForTarget(
  reminder: DashboardReminderRow,
  targetType: "PROPERTY" | "CLIENT",
): boolean {
  if (targetType === "PROPERTY") {
    return reminder.reminderVariant === "SCHEDULED_PROPERTY";
  }
  return reminder.reminderVariant === "SCHEDULED_CLIENT";
}

type NoteRemindersSectionProps =
  | {
      targetType: "PROPERTY";
      propertyId: string;
      canManage: boolean;
    }
  | {
      targetType: "CLIENT";
      clientId: string;
      canManage: boolean;
    };

export function NoteRemindersSection(props: NoteRemindersSectionProps) {
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const propertyId = props.targetType === "PROPERTY" ? props.propertyId : "";
  const clientId = props.targetType === "CLIENT" ? props.clientId : "";
  const query = useMemo(
    () =>
      props.targetType === "PROPERTY"
        ? { propertyId, timing: "ALL" as const, limit: REMINDERS_PER_RECORD_LIMIT, page: 1 }
        : { clientId, timing: "ALL" as const, limit: REMINDERS_PER_RECORD_LIMIT, page: 1 },
    [props.targetType, propertyId, clientId],
  );

  const { reminders, isLoading, error, refetch } = useRemindersList({
    enabled: true,
    query,
  });

  const manualReminders = useMemo(() => {
    return reminders
      .filter((reminder) => isManualScheduledReminderForTarget(reminder, props.targetType))
      .slice()
      .sort(
        (left, right) =>
          new Date(left.notifyAt).getTime() - new Date(right.notifyAt).getTime(),
      );
  }, [reminders]);

  const isAtLimit = manualReminders.length >= REMINDERS_PER_RECORD_LIMIT;

  return (
    <section className="rounded-2xl bg-card p-4 shadow-sm ring-1 ring-border">
      <h2 className="text-sm font-semibold text-foreground">შეხსენებები</h2>

      {isLoading ? (
        <p className="mt-3 text-sm text-muted-foreground">შეხსენებები იტვირთება…</p>
      ) : null}
      {error ? (
        <p className="mt-3 text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}

      {!isLoading && !error && manualReminders.length === 0 ? (
        <p className="mt-3 text-sm text-muted-foreground">ამ ჩანაწერზე დაგეგმილი შეხსენება არ არის.</p>
      ) : null}

      {!isLoading && !error && manualReminders.length > 0 ? (
        <div className="mt-3">
          {manualReminders.map((reminder) => (
            <CompactScheduledReminderRow
              key={reminder.id}
              reminder={reminder}
              canManage={props.canManage}
              onChanged={() => void refetch()}
            />
          ))}
        </div>
      ) : null}

      {props.canManage ? (
        <div className="mt-3">
          {isAtLimit ? (
            <p className="text-xs text-muted-foreground">{REMINDER_LIMIT_GEORGIAN_MESSAGE}</p>
          ) : (
            <button
              type="button"
              onClick={() => setIsPickerOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-border px-3 py-2 text-xs font-medium text-foreground transition hover:bg-muted"
            >
              <Plus className="h-3.5 w-3.5" aria-hidden />
              შეხსენების დამატება
            </button>
          )}
        </div>
      ) : null}

      {isPickerOpen && props.canManage && !isAtLimit ? (
        <ReminderPickerModal
          mode="create"
          open
          target={
            props.targetType === "PROPERTY"
              ? { targetType: "PROPERTY", propertyId: props.propertyId }
              : { targetType: "CLIENT", clientId: props.clientId }
          }
          onClose={() => setIsPickerOpen(false)}
          onSaved={() => void refetch()}
        />
      ) : null}
    </section>
  );
}
