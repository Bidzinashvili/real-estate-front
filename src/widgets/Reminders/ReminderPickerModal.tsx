"use client";

import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";
import {
  createReminder,
  patchReminder,
} from "@/features/reminders/remindersApi";
import {
  datetimeLocalValueToIso,
  isoToDatetimeLocalValue,
} from "@/shared/lib/datetimeLocalIso";

const FIELD_CLASS =
  "h-11 w-full rounded-lg border border-border bg-card px-3 text-sm text-foreground outline-none focus:border-primary";

type ReminderPickerTarget =
  | { targetType: "PROPERTY"; propertyId: string }
  | { targetType: "CLIENT"; clientId: string };

type ReminderPickerCreateProps = {
  mode: "create";
  open: boolean;
  target: ReminderPickerTarget;
  onClose: () => void;
  onSaved: () => void;
};

type ReminderPickerEditProps = {
  mode: "edit";
  open: boolean;
  reminderId: string;
  initialNotifyAt: string;
  initialNote?: string | null;
  onClose: () => void;
  onSaved: () => void;
};

type ReminderPickerModalProps = ReminderPickerCreateProps | ReminderPickerEditProps;

function splitDatetimeLocal(value: string): { dateValue: string; timeValue: string } {
  const [dateValue = "", timeValue = ""] = value.split("T");
  return { dateValue, timeValue };
}

function joinDatetimeLocal(dateValue: string, timeValue: string): string {
  if (dateValue.trim() === "" || timeValue.trim() === "") {
    return "";
  }
  return `${dateValue}T${timeValue}`;
}

export function ReminderPickerModal(props: ReminderPickerModalProps) {
  const formFieldIdPrefix = useId();
  const initialLocal =
    props.mode === "edit" ? isoToDatetimeLocalValue(props.initialNotifyAt) : "";
  const initialSplit = splitDatetimeLocal(initialLocal);
  const [dateValue, setDateValue] = useState(initialSplit.dateValue);
  const [timeValue, setTimeValue] = useState(initialSplit.timeValue);
  const [note, setNote] = useState(
    props.mode === "edit" ? props.initialNote ?? "" : "",
  );
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const isOpen = props.open;
  const isEditMode = props.mode === "edit";
  const reminderId = isEditMode ? props.reminderId : "";
  const initialNotifyAt = isEditMode ? props.initialNotifyAt : "";
  const initialNote = isEditMode ? props.initialNote ?? "" : "";

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    const nextLocal = isEditMode ? isoToDatetimeLocalValue(initialNotifyAt) : "";
    const nextSplit = splitDatetimeLocal(nextLocal);
    setDateValue(nextSplit.dateValue);
    setTimeValue(nextSplit.timeValue);
    setNote(initialNote);
    setFormError(null);
  }, [isOpen, isEditMode, reminderId, initialNotifyAt, initialNote]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isSaving) {
        props.onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, isSaving, props]);

  if (!isOpen || typeof document === "undefined") {
    return null;
  }

  const title = props.mode === "edit" ? "შეხსენების შეცვლა" : "შეხსენების დაყენება";

  const handleSubmit = async () => {
    setFormError(null);
    const notifyIso = datetimeLocalValueToIso(joinDatetimeLocal(dateValue, timeValue));
    if (notifyIso === null) {
      setFormError("აირჩიეთ თარიღი და დრო.");
      return;
    }
    const trimmedNote = note.trim();
    const nextNote = trimmedNote === "" ? null : trimmedNote;

    setIsSaving(true);
    try {
      if (props.mode === "edit") {
        await patchReminder(props.reminderId, {
          notifyAt: notifyIso,
          note: nextNote,
        });
      } else if (props.target.targetType === "PROPERTY") {
        await createReminder({
          propertyId: props.target.propertyId,
          kind: "CUSTOM",
          notifyAt: notifyIso,
          note: nextNote,
        });
      } else {
        await createReminder({
          clientId: props.target.clientId,
          notifyAt: notifyIso,
          note: nextNote,
        });
      }
      props.onSaved();
      props.onClose();
    } catch (errorUnknown) {
      const message =
        errorUnknown instanceof Error
          ? errorUnknown.message
          : "შეხსენების შენახვა ვერ მოხერხდა.";
      setFormError(message);
    } finally {
      setIsSaving(false);
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-primary/40 px-4"
      role="presentation"
      onClick={(event) => {
        if (event.target === event.currentTarget && !isSaving) {
          props.onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${formFieldIdPrefix}-title`}
        className="w-full max-w-md rounded-2xl bg-card p-5 shadow-lg ring-1 ring-border"
        onClick={(event) => event.stopPropagation()}
      >
        <h2
          id={`${formFieldIdPrefix}-title`}
          className="text-base font-semibold text-foreground"
        >
          {title}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          აირჩიეთ თარიღი და დრო. შენიშვნა არასავალდებულოა.
        </p>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label
              htmlFor={`${formFieldIdPrefix}-date`}
              className="mb-1 block text-xs font-medium text-muted-foreground"
            >
              თარიღი
            </label>
            <input
              id={`${formFieldIdPrefix}-date`}
              type="date"
              value={dateValue}
              onChange={(event) => setDateValue(event.target.value)}
              className={FIELD_CLASS}
            />
          </div>
          <div>
            <label
              htmlFor={`${formFieldIdPrefix}-time`}
              className="mb-1 block text-xs font-medium text-muted-foreground"
            >
              დრო
            </label>
            <input
              id={`${formFieldIdPrefix}-time`}
              type="time"
              value={timeValue}
              onChange={(event) => setTimeValue(event.target.value)}
              className={FIELD_CLASS}
            />
          </div>
        </div>

        <div className="mt-3">
          <label
            htmlFor={`${formFieldIdPrefix}-note`}
            className="mb-1 block text-xs font-medium text-muted-foreground"
          >
            შენიშვნა (არასავალდებულო)
          </label>
          <textarea
            id={`${formFieldIdPrefix}-note`}
            rows={3}
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="მაგ. დაურეკე მეპატრონეს"
            className={`${FIELD_CLASS} min-h-[4.5rem] resize-y py-2`}
          />
        </div>

        {formError ? (
          <p className="mt-3 text-sm text-destructive" role="alert">
            {formError}
          </p>
        ) : null}

        <div className="mt-5 flex flex-wrap items-center justify-end gap-3">
          <button
            type="button"
            onClick={props.onClose}
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
    </div>,
    document.body,
  );
}
