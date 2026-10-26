"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { updateClient } from "@/features/clients/api";
import type { UpdateClientPayload } from "@/features/clients/clientApi.types";
import { isClientStatus, type ClientStatus } from "@/features/clients/clientEnums";
import {
  CLIENT_EDIT_STATUSES,
  formatClientStatusLabel,
  normalizeClientStatusForApi,
} from "@/features/clients/clientStatusDisplay";
import type { Client } from "@/features/clients/types";
import type { OutcomeSource } from "@/features/lifecycle/lifecycleEnums";
import { isOutcomeSource } from "@/features/lifecycle/lifecycleEnums";
import { OptionChips } from "@/shared/ui/OptionChips";
import { ClientOutcomePropertyPicker } from "@/widgets/Clients/ClientOutcomePropertyPicker";
import { OutcomeSourcePicker } from "@/widgets/Lifecycle/OutcomeSourcePicker";

type ClientChangeStatusModalProps = {
  open: boolean;
  client: Client;
  onClose: () => void;
  onSaved: () => void;
};

function buildStatusChangePayload(args: {
  client: Client;
  selectedStatus: ClientStatus;
  outcomeSource: OutcomeSource | "";
  outcomePropertyId: string;
}): UpdateClientPayload {
  const patch: UpdateClientPayload = {
    status: normalizeClientStatusForApi(args.selectedStatus),
  };

  if (args.selectedStatus !== "INACTIVE" || !isOutcomeSource(args.outcomeSource)) {
    return patch;
  }

  patch.outcomeSource = args.outcomeSource;

  if (args.outcomeSource === "BY_OTHER") {
    return patch;
  }

  const trimmedPropertyId = args.outcomePropertyId.trim();
  if (trimmedPropertyId !== "") {
    patch.propertyId = trimmedPropertyId;
  } else if (args.client.propertyId) {
    patch.propertyId = null;
  }

  return patch;
}

export function ClientChangeStatusModal({
  open,
  client,
  onClose,
  onSaved,
}: ClientChangeStatusModalProps) {
  const statusOptions = useMemo(() => {
    const selectable: ClientStatus[] = [...CLIENT_EDIT_STATUSES];
    const normalizedCurrent = normalizeClientStatusForApi(client.status);
    if (!selectable.includes(normalizedCurrent as (typeof CLIENT_EDIT_STATUSES)[number])) {
      return [normalizedCurrent, ...selectable];
    }
    return selectable;
  }, [client.status]);
  const [selectedStatus, setSelectedStatus] = useState<ClientStatus>(
    normalizeClientStatusForApi(client.status),
  );
  const [outcomeSource, setOutcomeSource] = useState<OutcomeSource | "">(
    client.outcomeSource ?? "",
  );
  const [outcomePropertyId, setOutcomePropertyId] = useState(client.propertyId ?? "");
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setSelectedStatus(normalizeClientStatusForApi(client.status));
    setOutcomeSource(client.outcomeSource ?? "");
    setOutcomePropertyId(client.propertyId ?? "");
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

    const normalizedCurrent = normalizeClientStatusForApi(client.status);
    const outcomeUnchanged =
      selectedStatus !== "INACTIVE" ||
      (outcomeSource === (client.outcomeSource ?? "") &&
        outcomePropertyId === (client.propertyId ?? ""));

    if (selectedStatus === normalizedCurrent && outcomeUnchanged) {
      setFormError("შესანახი ცვლილება არ არის.");
      return;
    }

    setIsSaving(true);
    try {
      await updateClient(
        client.id,
        buildStatusChangePayload({
          client,
          selectedStatus,
          outcomeSource,
          outcomePropertyId,
        }),
      );
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
          <OptionChips
            label="კლიენტის სტატუსი"
            value={selectedStatus}
            onChange={(rawStatus) => {
              if (isClientStatus(rawStatus)) {
                setSelectedStatus(normalizeClientStatusForApi(rawStatus));
              }
            }}
            options={statusOptions.map((status) => ({
              value: status,
              label: formatClientStatusLabel(status),
            }))}
          />
          {selectedStatus === "INACTIVE" ? (
            <div className="space-y-4">
              <div>
                <p className="mb-1 text-xs font-medium text-muted-foreground">ვინ დააბინავა?</p>
                <OutcomeSourcePicker
                  value={outcomeSource}
                  onChange={(nextOutcome) => {
                    setOutcomeSource(nextOutcome);
                    if (nextOutcome === "BY_OTHER") {
                      setOutcomePropertyId("");
                    }
                  }}
                  variant="client"
                  disabled={isSaving}
                />
              </div>
              {outcomeSource === "BY_ME" ? (
                <ClientOutcomePropertyPicker
                  dealType={client.dealType}
                  value={outcomePropertyId}
                  onChange={setOutcomePropertyId}
                  disabled={isSaving}
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
