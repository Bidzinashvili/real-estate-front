"use client";

import { useMemo, useState } from "react";
import { Bell } from "lucide-react";
import { useRemindersList } from "@/features/reminders/useRemindersList";
import { isKeepStyleReminder } from "@/features/reminders/dashboardReminderNormalizer";
import { ReminderFeedCard } from "@/widgets/Reminders/ReminderFeedCard";
import { ReminderPickerModal } from "@/widgets/Reminders/ReminderPickerModal";

type NoteRemindersSectionProps =
  | {
      targetType: "PROPERTY";
      propertyId: string;
      canCreate: boolean;
    }
  | {
      targetType: "CLIENT";
      clientId: string;
      canCreate: boolean;
    };

export function NoteRemindersSection(props: NoteRemindersSectionProps) {
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const propertyId = props.targetType === "PROPERTY" ? props.propertyId : "";
  const clientId = props.targetType === "CLIENT" ? props.clientId : "";
  const query = useMemo(
    () =>
      props.targetType === "PROPERTY"
        ? { propertyId, timing: "ALL" as const, limit: 100, page: 1 }
        : { clientId, timing: "ALL" as const, limit: 100, page: 1 },
    [props.targetType, propertyId, clientId],
  );

  const { reminders, isLoading, error, refetch } = useRemindersList({
    enabled: true,
    query,
  });

  const manualReminders = reminders.filter((reminder) =>
    isKeepStyleReminder(reminder.reminderVariant),
  );

  return (
    <section className="rounded-2xl bg-card p-4 shadow-sm ring-1 ring-border">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-foreground">დაგეგმილი შეხსენებები</h2>
        {props.canCreate ? (
          <button
            type="button"
            onClick={() => setIsPickerOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-medium text-foreground transition hover:bg-muted"
          >
            <Bell className="h-3.5 w-3.5" aria-hidden />
            შეხსენების დამატება
          </button>
        ) : null}
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">შეხსენებები იტვირთება…</p>
      ) : null}
      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
      {!isLoading && !error && manualReminders.length === 0 ? (
        <p className="text-sm text-muted-foreground">ამ ჩანაწერზე დაგეგმილი შეხსენება არ არის.</p>
      ) : null}
      {!isLoading && !error && manualReminders.length > 0 ? (
        <div className="space-y-3">
          {manualReminders.map((reminder) => (
            <ReminderFeedCard
              key={reminder.id}
              reminder={reminder}
              onChanged={() => void refetch()}
            />
          ))}
        </div>
      ) : null}

      {isPickerOpen && props.canCreate ? (
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
