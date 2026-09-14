"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { updateProperty } from "@/features/properties/api";
import {
  formatPropertyStatusLabel,
  getSelectablePropertyStatuses,
  isPropertyStatus,
  type Property,
  type PropertyStatus,
  type PropertyUpdatePayload,
} from "@/features/properties/types";
import type { OutcomeSource } from "@/features/lifecycle/lifecycleEnums";
import type { ReminderConfigPayload } from "@/features/lifecycle/lifecycleEnums";
import { datetimeLocalValueToIso } from "@/shared/lib/datetimeLocalIso";
import { NativeSelectSurface } from "@/shared/ui/NativeSelectSurface";
import { OutcomeSourcePicker } from "@/widgets/Lifecycle/OutcomeSourcePicker";

const FIELD_CLASS =
  "h-11 w-full rounded-lg border border-border bg-card px-3 text-sm text-foreground outline-none focus:border-primary";

type RentalReminderChoice = "RENTAL_6M_MINUS_15D" | "RENTAL_1Y_MINUS_15D" | "CUSTOM_DATE";

type PropertyListingChangeStatusModalProps = {
  open: boolean;
  property: Property;
  onClose: () => void;
  onSaved: () => void;
};

function needsOutcomeSource(status: PropertyStatus): boolean {
  return status === "SOLD" || status === "RENTED";
}

export function PropertyListingChangeStatusModal({
  open,
  property,
  onClose,
  onSaved,
}: PropertyListingChangeStatusModalProps) {
  const statusOptions = useMemo(() => {
    const selectable = getSelectablePropertyStatuses(property.dealType);
    if (selectable.includes(property.status)) {
      return selectable;
    }
    return [property.status, ...selectable];
  }, [property.dealType, property.status]);
  const fallbackStatus = statusOptions[0] ?? property.status;
  const [selectedStatus, setSelectedStatus] = useState<PropertyStatus>(
    statusOptions.includes(property.status) ? property.status : fallbackStatus,
  );
  const [outcomeSource, setOutcomeSource] = useState<OutcomeSource | "">("");
  const [rentalReminderChoice, setRentalReminderChoice] =
    useState<RentalReminderChoice>("RENTAL_6M_MINUS_15D");
  const [customReminderLocal, setCustomReminderLocal] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;

    setSelectedStatus(
      statusOptions.includes(property.status) ? property.status : fallbackStatus,
    );
    setOutcomeSource(property.outcomeSource ?? "");
    setRentalReminderChoice("RENTAL_6M_MINUS_15D");
    setCustomReminderLocal("");
    setFormError(null);
  }, [fallbackStatus, open, property, statusOptions]);

  useEffect(() => {
    if (!open) return;

    const overlayId = `change-status-overlay-${property.id}`;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    const handleCapturedClick = (event: MouseEvent) => {
      const targetNode = event.target;
      if (!(targetNode instanceof Node)) return;
      const overlay = document.getElementById(overlayId);
      if (overlay && overlay.contains(targetNode)) return;
      event.stopPropagation();
    };

    window.addEventListener("keydown", handleEscape);
    document.addEventListener("click", handleCapturedClick, true);
    return () => {
      window.removeEventListener("keydown", handleEscape);
      document.removeEventListener("click", handleCapturedClick, true);
    };
  }, [open, onClose, property.id]);

  if (!open) {
    return null;
  }

  const handleBackdropPointerDown = () => {
    if (!isSaving) onClose();
  };

  const handleSubmit = async () => {
    setFormError(null);

    if (needsOutcomeSource(selectedStatus) && outcomeSource === "") {
      setFormError("აირჩიეთ: ჩემს მიერ ან სხვის მიერ.");
      return;
    }

    const patch: PropertyUpdatePayload = {};

    if (selectedStatus !== property.status) {
      patch.status = selectedStatus;
    }

    if (needsOutcomeSource(selectedStatus)) {
      patch.outcomeSource = outcomeSource as OutcomeSource;
    }

    if (selectedStatus === "RENTED") {
      if (rentalReminderChoice === "CUSTOM_DATE") {
        const notifyAt = datetimeLocalValueToIso(customReminderLocal);
        if (notifyAt === null) {
          setFormError("აირჩიეთ შეხსენების თარიღი.");
          return;
        }
        patch.reminder = {
          type: "CUSTOM_DATE",
          notifyAt,
          repeats: false,
        };
      } else {
        const reminder: ReminderConfigPayload = { type: rentalReminderChoice };
        patch.reminder = reminder;
      }
    }

    if (Object.keys(patch).length === 0) {
      setFormError("შესანახი ცვლილება არ არის.");
      return;
    }

    setIsSaving(true);
    try {
      await updateProperty(property.id, patch);
      onSaved();
      onClose();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "ცვლილებების შენახვა ვერ მოხერხდა.";
      setFormError(message);
    } finally {
      setIsSaving(false);
    }
  };

  return createPortal(
    <div
      id={`change-status-overlay-${property.id}`}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-primary/40 px-4"
      role="presentation"
      onClick={(event) => {
        if (event.target === event.currentTarget) handleBackdropPointerDown();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={`change-status-title-${property.id}`}
        className="max-h-[min(90vh,36rem)] w-full max-w-md overflow-y-auto rounded-2xl bg-card p-5 shadow-lg ring-1 ring-border"
        onClick={(event) => event.stopPropagation()}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <h2
          id={`change-status-title-${property.id}`}
          className="text-base font-semibold text-foreground"
        >
          სტატუსის შეცვლა
        </h2>

        <div className="mt-4 space-y-4">
          <div>
            <label
              htmlFor={`modal-status-${property.id}`}
              className="mb-1 block text-xs font-medium text-muted-foreground"
            >
              განცხადების სტატუსი
            </label>
            <NativeSelectSurface>
              <select
                id={`modal-status-${property.id}`}
                aria-label="განცხადების სტატუსი"
                value={selectedStatus}
                onChange={(event) => {
                  const raw = event.target.value;
                  if (isPropertyStatus(raw)) {
                    setSelectedStatus(raw);
                  }
                }}
                className={FIELD_CLASS}
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {formatPropertyStatusLabel(status)}
                  </option>
                ))}
              </select>
            </NativeSelectSurface>
          </div>

          {needsOutcomeSource(selectedStatus) ? (
            <div>
              <p className="mb-1 text-xs font-medium text-muted-foreground">ვინ დაასრულა</p>
              <OutcomeSourcePicker
                value={outcomeSource}
                onChange={setOutcomeSource}
                disabled={isSaving}
              />
            </div>
          ) : null}

          {selectedStatus === "RENTED" ? (
            <div className="space-y-3">
              <p className="text-xs font-medium text-muted-foreground">
                ქირის გადამოწმების შეხსენება
              </p>
              <div className="flex flex-col gap-2">
                <label className="inline-flex items-center gap-2 text-sm text-foreground">
                  <input
                    type="radio"
                    name={`rental-reminder-${property.id}`}
                    checked={rentalReminderChoice === "RENTAL_6M_MINUS_15D"}
                    onChange={() => setRentalReminderChoice("RENTAL_6M_MINUS_15D")}
                  />
                  6 თვე (-15 დღე)
                </label>
                <label className="inline-flex items-center gap-2 text-sm text-foreground">
                  <input
                    type="radio"
                    name={`rental-reminder-${property.id}`}
                    checked={rentalReminderChoice === "RENTAL_1Y_MINUS_15D"}
                    onChange={() => setRentalReminderChoice("RENTAL_1Y_MINUS_15D")}
                  />
                  1 წელი (-15 დღე)
                </label>
                <label className="inline-flex items-center gap-2 text-sm text-foreground">
                  <input
                    type="radio"
                    name={`rental-reminder-${property.id}`}
                    checked={rentalReminderChoice === "CUSTOM_DATE"}
                    onChange={() => setRentalReminderChoice("CUSTOM_DATE")}
                  />
                  კონკრეტული თარიღი
                </label>
              </div>
              {rentalReminderChoice === "CUSTOM_DATE" ? (
                <input
                  type="datetime-local"
                  value={customReminderLocal}
                  onChange={(event) => setCustomReminderLocal(event.target.value)}
                  className={FIELD_CLASS}
                />
              ) : null}
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
    </div>,
    document.body,
  );
}
