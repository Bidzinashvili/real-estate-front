"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { updateClient } from "@/features/clients/api";
import {
  CLIENT_EDIT_STATUSES,
  CLIENT_STATUS_LABELS,
  isClientStatus,
  type ClientStatus,
} from "@/features/clients/clientEnums";
import type { Client } from "@/features/clients/types";
import type { OutcomeSource } from "@/features/lifecycle/lifecycleEnums";
import { NativeSelectSurface } from "@/shared/ui/NativeSelectSurface";
import { OutcomeSourcePicker } from "@/widgets/Lifecycle/OutcomeSourcePicker";

const FIELD_CLASS =
  "h-11 w-full rounded-lg border border-border bg-card px-3 text-sm text-foreground outline-none focus:border-primary";

type ClientChangeStatusModalProps = {
  open: boolean;
  client: Client;
  onClose: () => void;
  onSaved: () => void;
};

export function ClientChangeStatusModal({
  open,
  client,
  onClose,
  onSaved,
}: ClientChangeStatusModalProps) {
  const statusOptions = useMemo(() => {
    const selectable: ClientStatus[] = [...CLIENT_EDIT_STATUSES];
    if (!selectable.includes(client.status)) {
      return [client.status, ...selectable];
    }
    return selectable;
  }, [client.status]);
  const [selectedStatus, setSelectedStatus] = useState<ClientStatus>(client.status);
  const [outcomeSource, setOutcomeSource] = useState<OutcomeSource | "">(
    client.outcomeSource ?? "",
  );
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setSelectedStatus(client.status);
    setOutcomeSource(client.outcomeSource ?? "");
    setFormError(null);
  }, [client, open]);

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

  const handleSubmit = async () => {
    setFormError(null);

    if (selectedStatus === "INACTIVE" && outcomeSource === "") {
      setFormError("აირჩიეთ: მე ან სხვამ.");
      return;
    }

    if (selectedStatus === client.status && selectedStatus !== "INACTIVE") {
      setFormError("შესანახი ცვლილება არ არის.");
      return;
    }

    setIsSaving(true);
    try {
      await updateClient(client.id, {
        status: selectedStatus,
        ...(selectedStatus === "INACTIVE"
          ? { outcomeSource: outcomeSource as OutcomeSource }
          : {}),
      });
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
      className="fixed inset-0 z-[100] flex items-center justify-center bg-primary/40 px-4"
      role="presentation"
      onClick={(event) => {
        if (event.target === event.currentTarget && !isSaving) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="w-full max-w-md rounded-2xl bg-card p-5 shadow-lg ring-1 ring-border"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 className="text-base font-semibold text-foreground">სტატუსის შეცვლა</h2>
        <div className="mt-4 space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">
              კლიენტის სტატუსი
            </label>
            <NativeSelectSurface>
              <select
                value={selectedStatus}
                onChange={(event) => {
                  const raw = event.target.value;
                  if (isClientStatus(raw)) {
                    setSelectedStatus(raw);
                  }
                }}
                className={FIELD_CLASS}
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {CLIENT_STATUS_LABELS[status]}
                  </option>
                ))}
              </select>
            </NativeSelectSurface>
          </div>
          {selectedStatus === "INACTIVE" ? (
            <div>
              <p className="mb-1 text-xs font-medium text-muted-foreground">ვინ დაასრულა</p>
              <OutcomeSourcePicker
                value={outcomeSource}
                onChange={setOutcomeSource}
                variant="client"
                disabled={isSaving}
              />
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
            className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground shadow-sm transition hover:bg-muted disabled:opacity-70"
          >
            გაუქმება
          </button>
          <button
            type="button"
            disabled={isSaving}
            onClick={() => void handleSubmit()}
            className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-primary/90 disabled:opacity-70"
          >
            {isSaving ? "ინახება…" : "შენახვა"}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
