"use client";

import { useState } from "react";
import type { EntityVerificationFields } from "@/features/lifecycle/lifecycleEnums";
import type { ReminderConfigPayload } from "@/features/lifecycle/lifecycleEnums";
import { formatLifecycleDate } from "@/features/lifecycle/formatLifecycleDate";
import { formatReminderTypeLabel } from "@/features/lifecycle/lifecycleLabels";
import {
  datetimeLocalValueToIso,
  isoToDatetimeLocalValue,
} from "@/shared/lib/datetimeLocalIso";

const FIELD_CLASS =
  "h-11 w-full rounded-lg border border-border bg-card px-3 text-sm text-foreground outline-none focus:border-primary";

type ReminderPresetSet = "verification" | "rentalExpiry";

type VerificationReminderPanelProps = {
  fields: EntityVerificationFields;
  presetSet: ReminderPresetSet;
  canEdit: boolean;
  isSaving: boolean;
  error: string | null;
  onSaveReminder: (payload: ReminderConfigPayload) => Promise<void>;
  onVerifyNow?: () => Promise<void>;
  isVerifying?: boolean;
};

export function VerificationReminderPanel({
  fields,
  presetSet,
  canEdit,
  isSaving,
  error,
  onSaveReminder,
  onVerifyNow,
  isVerifying = false,
}: VerificationReminderPanelProps) {
  const [customMonthsInput, setCustomMonthsInput] = useState(
    fields.reminderIntervalMonths != null ? String(fields.reminderIntervalMonths) : "2",
  );
  const [customDateLocal, setCustomDateLocal] = useState(
    isoToDatetimeLocalValue(fields.reminderDate),
  );
  const [formError, setFormError] = useState<string | null>(null);

  const lastVerifiedLabel = formatLifecycleDate(fields.lastVerifiedAt);
  const nextReminderLabel = formatLifecycleDate(fields.reminderDate);
  const reminderTypeLabel = formatReminderTypeLabel(
    fields.reminderType,
    fields.reminderIntervalMonths,
    fields.reminderDate,
  );

  async function saveReminder(payload: ReminderConfigPayload) {
    setFormError(null);
    try {
      await onSaveReminder(payload);
    } catch (saveError) {
      const message =
        saveError instanceof Error ? saveError.message : "შეხსენების შენახვა ვერ მოხერხდა.";
      setFormError(message);
    }
  }

  async function handleCustomInterval() {
    const parsedMonths = Number.parseInt(customMonthsInput.trim(), 10);
    if (Number.isNaN(parsedMonths) || parsedMonths < 1) {
      setFormError("შეიყვანეთ თვეების რაოდენობა (მინიმუმ 1).");
      return;
    }
    await saveReminder({
      type: "INTERVAL_MONTHS",
      intervalMonths: parsedMonths,
      repeats: true,
    });
  }

  async function handleCustomDate() {
    const notifyAt = datetimeLocalValueToIso(customDateLocal);
    if (notifyAt === null) {
      setFormError("აირჩიეთ შეხსენების თარიღი.");
      return;
    }
    await saveReminder({
      type: "CUSTOM_DATE",
      notifyAt,
      repeats: false,
    });
  }

  const busy = isSaving || isVerifying;

  return (
    <section className="rounded-2xl bg-card p-5 shadow-sm ring-1 ring-border sm:p-6">
      <h2 className="text-sm font-semibold text-foreground">გადამოწმება და შეხსენება</h2>

      <dl className="mt-3 space-y-1.5 text-sm">
        <div className="flex flex-wrap gap-x-2">
          <dt className="text-muted-foreground">გადამოწმებულია:</dt>
          <dd className="font-medium text-foreground">{lastVerifiedLabel ?? "—"}</dd>
        </div>
        <div className="flex flex-wrap gap-x-2">
          <dt className="text-muted-foreground">შემდეგი შეხსენება:</dt>
          <dd className="font-medium text-foreground">{nextReminderLabel ?? "—"}</dd>
        </div>
        <div className="flex flex-wrap gap-x-2">
          <dt className="text-muted-foreground">ტიპი:</dt>
          <dd className="font-medium text-foreground">{reminderTypeLabel ?? "—"}</dd>
        </div>
        <div className="flex flex-wrap gap-x-2">
          <dt className="text-muted-foreground">შეხსენება:</dt>
          <dd className="font-medium text-foreground">
            {fields.reminderEnabled ? "ჩართულია" : "გამორთულია"}
            {fields.reminderRepeats ? " · მეორდება" : ""}
          </dd>
        </div>
      </dl>

      {canEdit ? (
        <div className="mt-4 space-y-3">
          {presetSet === "verification" ? (
            <>
              <button
                type="button"
                disabled={busy}
                onClick={() =>
                  void saveReminder({
                    type: "INTERVAL_MONTHS",
                    intervalMonths: 1,
                    repeats: true,
                  })
                }
                className="inline-flex rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground transition hover:bg-muted disabled:opacity-60"
              >
                1 თვე
              </button>
              <div className="flex flex-wrap items-end gap-2">
                <div className="min-w-[8rem] flex-1">
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">
                    სხვა ინტერვალი (თვე)
                  </label>
                  <input
                    type="number"
                    min={1}
                    step={1}
                    value={customMonthsInput}
                    onChange={(event) => setCustomMonthsInput(event.target.value)}
                    className={FIELD_CLASS}
                  />
                </div>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => void handleCustomInterval()}
                  className="h-11 rounded-full bg-primary px-4 text-sm font-medium text-white transition hover:bg-primary/90 disabled:opacity-60"
                >
                  შენახვა
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                disabled={busy}
                onClick={() =>
                  void saveReminder({ type: "RENTAL_6M_MINUS_15D" })
                }
                className="inline-flex rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground transition hover:bg-muted disabled:opacity-60"
              >
                6 თვე (-15 დღე)
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() =>
                  void saveReminder({ type: "RENTAL_1Y_MINUS_15D" })
                }
                className="inline-flex rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground transition hover:bg-muted disabled:opacity-60"
              >
                1 წელი (-15 დღე)
              </button>
            </div>
          )}

          <div className="flex flex-wrap items-end gap-2">
            <div className="min-w-[12rem] flex-1">
              <label className="mb-1 block text-xs font-medium text-muted-foreground">
                კონკრეტული თარიღი
              </label>
              <input
                type="datetime-local"
                value={customDateLocal}
                onChange={(event) => setCustomDateLocal(event.target.value)}
                className={FIELD_CLASS}
              />
            </div>
            <button
              type="button"
              disabled={busy}
              onClick={() => void handleCustomDate()}
              className="h-11 rounded-full border border-border bg-card px-4 text-sm font-medium text-foreground transition hover:bg-muted disabled:opacity-60"
            >
              თარიღის შენახვა
            </button>
          </div>

          {onVerifyNow ? (
            <button
              type="button"
              disabled={busy}
              onClick={() => void onVerifyNow()}
              className="inline-flex rounded-full bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary/90 disabled:opacity-60"
            >
              {isVerifying ? "მოწმდება…" : "გადავამოწმე"}
            </button>
          ) : null}
        </div>
      ) : null}

      {formError || error ? (
        <p className="mt-3 text-sm text-destructive" role="alert">
          {formError ?? error}
        </p>
      ) : null}
    </section>
  );
}
