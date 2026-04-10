"use client";

import { useEffect, useState } from "react";
import { createReminder } from "@/features/reminders/remindersApi";
import type { Property } from "@/features/properties/types";
import { datetimeLocalValueToIso } from "@/shared/lib/datetimeLocalIso";

const FIELD_CLASS =
  "h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:border-slate-400";

type ReminderFormRow = {
  rowKey: string;
  notifyLocal: string;
  note: string;
};

function createReminderRowKey(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `reminder-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

type PropertyListingRemindersModalProps = {
  open: boolean;
  property: Property;
  onClose: () => void;
  onScheduled: () => void;
};

export function PropertyListingRemindersModal({
  open,
  property,
  onClose,
  onScheduled,
}: PropertyListingRemindersModalProps) {
  const [reminderRows, setReminderRows] = useState<ReminderFormRow[]>(() => [
    { rowKey: createReminderRowKey(), notifyLocal: "", note: "" },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setReminderRows([
      { rowKey: createReminderRowKey(), notifyLocal: "", note: "" },
    ]);
    setFormError(null);
  }, [open, property.id]);

  useEffect(() => {
    if (!open) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  const handleBackdropPointerDown = () => {
    if (!isSubmitting) onClose();
  };

  const handleAddReminderRow = () => {
    setReminderRows((previous) => [
      ...previous,
      { rowKey: createReminderRowKey(), notifyLocal: "", note: "" },
    ]);
  };

  const handleRemoveReminderRow = (rowKey: string) => {
    setReminderRows((previous) => {
      if (previous.length <= 1) return previous;
      return previous.filter((row) => row.rowKey !== rowKey);
    });
  };

  const handleSubmit = async () => {
    setFormError(null);

    const payloads: { notifyAt: string; note: string | null }[] = [];

    for (const row of reminderRows) {
      const notifyIso = datetimeLocalValueToIso(row.notifyLocal);
      if (row.notifyLocal.trim() === "" || notifyIso === null) {
        continue;
      }
      const trimmedNote = row.note.trim();
      payloads.push({
        notifyAt: notifyIso,
        note: trimmedNote === "" ? null : trimmedNote,
      });
    }

    if (payloads.length === 0) {
      setFormError("Add at least one reminder with a valid date and time.");
      return;
    }

    setIsSubmitting(true);
    try {
      for (const payload of payloads) {
        await createReminder({
          propertyId: property.id,
          kind: "CUSTOM",
          notifyAt: payload.notifyAt,
          note: payload.note,
        });
      }
      onScheduled();
      onClose();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Could not save reminders.";
      setFormError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 px-4"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) handleBackdropPointerDown();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={`reminders-title-${property.id}`}
        className="max-h-[min(90vh,40rem)] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-5 shadow-lg ring-1 ring-slate-200"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <h2
          id={`reminders-title-${property.id}`}
          className="text-base font-semibold text-slate-900"
        >
          Set reminders
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          You can schedule several notifications for this listing. Each row is saved as its own
          reminder.
        </p>

        <div className="mt-4 space-y-4">
          {reminderRows.map((row, rowIndex) => (
            <div
              key={row.rowKey}
              className="rounded-xl border border-slate-200 bg-slate-50/80 p-3 space-y-3"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Reminder {rowIndex + 1}
                </span>
                {reminderRows.length > 1 ? (
                  <button
                    type="button"
                    onClick={() => handleRemoveReminderRow(row.rowKey)}
                    disabled={isSubmitting}
                    className="text-xs font-medium text-red-700 transition hover:text-red-800 disabled:opacity-50"
                  >
                    Remove
                  </button>
                ) : null}
              </div>
              <div>
                <label
                  htmlFor={`reminder-when-${row.rowKey}`}
                  className="mb-1 block text-xs font-medium text-slate-600"
                >
                  When
                </label>
                <input
                  id={`reminder-when-${row.rowKey}`}
                  type="datetime-local"
                  value={row.notifyLocal}
                  onChange={(event) => {
                    const nextValue = event.target.value;
                    setReminderRows((previous) =>
                      previous.map((existing) =>
                        existing.rowKey === row.rowKey
                          ? { ...existing, notifyLocal: nextValue }
                          : existing,
                      ),
                    );
                  }}
                  className={FIELD_CLASS}
                />
              </div>
              <div>
                <label
                  htmlFor={`reminder-note-${row.rowKey}`}
                  className="mb-1 block text-xs font-medium text-slate-600"
                >
                  Note (optional)
                </label>
                <textarea
                  id={`reminder-note-${row.rowKey}`}
                  rows={2}
                  value={row.note}
                  onChange={(event) => {
                    const nextValue = event.target.value;
                    setReminderRows((previous) =>
                      previous.map((existing) =>
                        existing.rowKey === row.rowKey
                          ? { ...existing, note: nextValue }
                          : existing,
                      ),
                    );
                  }}
                  className={`${FIELD_CLASS} min-h-[4.5rem] resize-y py-2`}
                />
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={handleAddReminderRow}
          disabled={isSubmitting}
          className="mt-3 text-sm font-medium text-teal-800 transition hover:text-teal-900 disabled:opacity-50"
        >
          + Add another reminder
        </button>

        {formError ? (
          <p className="mt-3 text-sm text-red-600" role="alert">
            {formError}
          </p>
        ) : null}

        <div className="mt-5 flex flex-wrap items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-70"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => void handleSubmit()}
            className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Saving…" : "Save reminders"}
          </button>
        </div>
      </div>
    </div>
  );
}
