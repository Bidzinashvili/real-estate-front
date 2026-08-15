"use client";

import { useEffect, useId, useState } from "react";
import type { DashboardReminderRow } from "@/features/reminders/dashboardReminderNormalizer";
import {
  buildDashboardReminderPatch,
  type DashboardReminderEditFormSnapshot,
} from "@/features/reminders/reminderDashboardPatch";
import { patchReminder } from "@/features/reminders/remindersApi";
import { isoToDatetimeLocalValue } from "@/shared/lib/datetimeLocalIso";

const FIELD_CLASS =
  "h-11 w-full rounded-lg border border-border bg-card px-3 text-sm text-foreground outline-none focus:border-primary";

type DashboardReminderEditModalProps = {
  row: DashboardReminderRow;
  onClose: () => void;
  onSaved: () => void;
};

function buildInitialForm(row: DashboardReminderRow): DashboardReminderEditFormSnapshot {
  return {
    notifyLocal: isoToDatetimeLocalValue(row.dueAtIso),
    note: row.note ?? "",
    rentalDurationMonthsInput:
      row.rentalDurationMonths != null ? String(row.rentalDurationMonths) : "",
    rentalStartedLocal: isoToDatetimeLocalValue(row.rentalPeriodStartedAtIso),
    rentalEndedLocal: isoToDatetimeLocalValue(row.rentalPeriodEndsAtIso),
  };
}

export function DashboardReminderEditModal({
  row,
  onClose,
  onSaved,
}: DashboardReminderEditModalProps) {
  const formFieldIdPrefix = useId();
  const [form, setForm] = useState<DashboardReminderEditFormSnapshot>(() =>
    buildInitialForm(row),
  );
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    setForm(buildInitialForm(row));
    setFormError(null);
  }, [row]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isSaving) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose, isSaving]);

  const showNoteField =
    row.reminderVariant === "SCHEDULED_PROPERTY" &&
    row.scheduledKind !== "RENTAL_PERIOD_ENDING";

  const showRentalFields =
    row.reminderVariant === "SCHEDULED_PROPERTY" &&
    row.scheduledKind === "RENTAL_PERIOD_ENDING";

  const handleBackdropPointerDown = () => {
    if (!isSaving) onClose();
  };

  const handleSubmit = async () => {
    setFormError(null);

    const built = buildDashboardReminderPatch(row, form);
    if (built === null) {
      setFormError("შესანახი ცვლილება არ არის.");
      return;
    }
    if ("errorMessage" in built) {
      setFormError(built.errorMessage);
      return;
    }

    setIsSaving(true);
    try {
      await patchReminder(row.id, built.patch);
      onSaved();
      onClose();
    } catch (errorUnknown) {
      const message =
        errorUnknown instanceof Error
          ? errorUnknown.message
          : "შეხსენების განახლება ვერ მოხერხდა.";
      setFormError(message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-primary/40 px-4"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) handleBackdropPointerDown();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${formFieldIdPrefix}-title`}
        className="max-h-[min(90vh,40rem)] w-full max-w-lg overflow-y-auto rounded-2xl bg-card p-5 shadow-lg ring-1 ring-border"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <h2
          id={`${formFieldIdPrefix}-title`}
          className="text-base font-semibold text-foreground"
        >
          შეხსენების რედაქტირება
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {row.reminderKindLabel}
          <span className="text-muted-foreground"> · </span>
          {row.subjectTitle}
        </p>

        <div className="mt-4 space-y-4">
          <div>
            <label
              htmlFor={`${formFieldIdPrefix}-when`}
              className="mb-1 block text-xs font-medium text-muted-foreground"
            >
              როდის
            </label>
            <input
              id={`${formFieldIdPrefix}-when`}
              type="datetime-local"
              value={form.notifyLocal}
              onChange={(event) =>
                setForm((previous) =>
                  previous ? { ...previous, notifyLocal: event.target.value } : previous,
                )
              }
              className={FIELD_CLASS}
            />
          </div>

          {showNoteField ? (
            <div>
              <label
                htmlFor={`${formFieldIdPrefix}-note`}
                className="mb-1 block text-xs font-medium text-muted-foreground"
              >
                შენიშვნა (არასავალდებულო)
              </label>
              <textarea
                id={`${formFieldIdPrefix}-note`}
                rows={3}
                value={form.note}
                onChange={(event) =>
                  setForm((previous) =>
                    previous ? { ...previous, note: event.target.value } : previous,
                  )
                }
                className={`${FIELD_CLASS} min-h-[4.5rem] resize-y py-2`}
              />
            </div>
          ) : null}

          {showRentalFields ? (
            <div className="space-y-4 rounded-xl border border-border bg-muted/80 p-3">
              <p className="text-xs font-medium text-muted-foreground">
                ქირის პერიოდი (სავალდებულოა, თუ რომელიმე ამ ველს შეცვლით)
              </p>
              <div>
                <label
                  htmlFor={`${formFieldIdPrefix}-rental-months`}
                  className="mb-1 block text-xs font-medium text-muted-foreground"
                >
                  ხანგრძლივობა (თვე)
                </label>
                <input
                  id={`${formFieldIdPrefix}-rental-months`}
                  type="number"
                  inputMode="numeric"
                  min={1}
                  step={1}
                  value={form.rentalDurationMonthsInput}
                  onChange={(event) =>
                    setForm((previous) =>
                      previous
                        ? { ...previous, rentalDurationMonthsInput: event.target.value }
                        : previous,
                    )
                  }
                  className={FIELD_CLASS}
                />
              </div>
              <div>
                <label
                  htmlFor={`${formFieldIdPrefix}-rental-start`}
                  className="mb-1 block text-xs font-medium text-muted-foreground"
                >
                  პერიოდის დასაწყისი
                </label>
                <input
                  id={`${formFieldIdPrefix}-rental-start`}
                  type="datetime-local"
                  value={form.rentalStartedLocal}
                  onChange={(event) =>
                    setForm((previous) =>
                      previous
                        ? { ...previous, rentalStartedLocal: event.target.value }
                        : previous,
                    )
                  }
                  className={FIELD_CLASS}
                />
              </div>
              <div>
                <label
                  htmlFor={`${formFieldIdPrefix}-rental-end`}
                  className="mb-1 block text-xs font-medium text-muted-foreground"
                >
                  პერიოდის დასასრული
                </label>
                <input
                  id={`${formFieldIdPrefix}-rental-end`}
                  type="datetime-local"
                  value={form.rentalEndedLocal}
                  onChange={(event) =>
                    setForm((previous) =>
                      previous
                        ? { ...previous, rentalEndedLocal: event.target.value }
                        : previous,
                    )
                  }
                  className={FIELD_CLASS}
                />
              </div>
            </div>
          ) : null}
        </div>

        {formError ? (
          <p className="mt-3 text-sm text-destructive" role="alert">
            {formError}
          </p>
        ) : null}

        <div className="mt-5 flex flex-wrap items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground shadow-sm transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-70"
          >
            გაუქმება
          </button>
          <button
            type="button"
            disabled={isSaving}
            onClick={() => void handleSubmit()}
            className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSaving ? "ინახება…" : "შენახვა"}
          </button>
        </div>
      </div>
    </div>
  );
}
