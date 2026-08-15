"use client";

import { useEffect, useMemo, useState } from "react";
import { getClients } from "@/features/clients/api";
import type { Client } from "@/features/clients/types";
import { updateProperty } from "@/features/properties/api";
import {
  formatPropertyStatusLabel,
  isPropertyStatus,
  PROPERTY_STATUSES,
  type Property,
  type PropertyStatus,
  type PropertyUpdatePayload,
} from "@/features/properties/types";
import {
  datetimeLocalValueToIso,
  isoToDatetimeLocalValue,
} from "@/shared/lib/datetimeLocalIso";
import { NativeSelectSurface } from "@/shared/ui/NativeSelectSurface";

const CLIENTS_PAGE_LIMIT = 500;

const FIELD_CLASS =
  "h-11 w-full rounded-lg border border-border bg-card px-3 text-sm text-foreground outline-none focus:border-primary";

function isAvailableSoonAllowed(property: Property): boolean {
  return property.dealType === "RENT" || property.dealType === "DAILY_RENT";
}

function getStatusOptions(property: Property): PropertyStatus[] {
  return PROPERTY_STATUSES.filter(
    (status) => status !== "AVAILABLE_SOON" || isAvailableSoonAllowed(property),
  );
}

type PropertyListingChangeStatusModalProps = {
  open: boolean;
  property: Property;
  onClose: () => void;
  onSaved: () => void;
};

function buildChangeStatusPatch(
  property: Property,
  selectedStatus: PropertyStatus,
  verificationReminderLocal: string,
  tenantClientIdRaw: string,
  rentalDurationMonths: number | null,
): PropertyUpdatePayload {
  const patch: PropertyUpdatePayload = {};
  const trimmedTenantClientId = tenantClientIdRaw.trim();

  if (selectedStatus !== property.status) {
    patch.status = selectedStatus;
  }

  if (selectedStatus === "RENTED" && rentalDurationMonths !== null) {
    if (property.tenantClientId !== trimmedTenantClientId) {
      patch.tenantClientId = trimmedTenantClientId;
    }
    if (property.rentalDurationMonths !== rentalDurationMonths) {
      patch.rentalDurationMonths = rentalDurationMonths;
    }
  } else {
    if (property.tenantClientId != null) {
      patch.tenantClientId = null;
    }
    if (property.rentalDurationMonths != null) {
      patch.rentalDurationMonths = null;
    }
  }

  if (selectedStatus === "TO_BE_VERIFIED") {
    const reminderIso = datetimeLocalValueToIso(verificationReminderLocal);
    if (verificationReminderLocal.trim() === "") {
      if (property.reminderDate != null) {
        patch.reminderDate = null;
      }
    } else if (reminderIso !== null && reminderIso !== property.reminderDate) {
      patch.reminderDate = reminderIso;
    }
  } else if (property.reminderDate != null) {
    patch.reminderDate = null;
  }

  return patch;
}

export function PropertyListingChangeStatusModal({
  open,
  property,
  onClose,
  onSaved,
}: PropertyListingChangeStatusModalProps) {
  const statusOptions = useMemo(() => getStatusOptions(property), [property]);
  const fallbackStatus = statusOptions[0] ?? property.status;
  const [selectedStatus, setSelectedStatus] = useState<PropertyStatus>(
    statusOptions.includes(property.status) ? property.status : fallbackStatus,
  );
  const [verificationReminderLocal, setVerificationReminderLocal] = useState(
    () => isoToDatetimeLocalValue(property.reminderDate),
  );
  const [rentalDurationMonthsInput, setRentalDurationMonthsInput] = useState(
    () =>
      property.rentalDurationMonths != null
        ? String(property.rentalDurationMonths)
        : "6",
  );
  const [tenantClientId, setTenantClientId] = useState(
    () => property.tenantClientId ?? "",
  );
  const [clients, setClients] = useState<Client[]>([]);
  const [clientsLoadError, setClientsLoadError] = useState<string | null>(null);
  const [isLoadingClients, setIsLoadingClients] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;

    setSelectedStatus(
      statusOptions.includes(property.status) ? property.status : fallbackStatus,
    );
    setVerificationReminderLocal(isoToDatetimeLocalValue(property.reminderDate));
    setRentalDurationMonthsInput(
      property.rentalDurationMonths != null
        ? String(property.rentalDurationMonths)
        : "6",
    );
    setTenantClientId(property.tenantClientId ?? "");
    setFormError(null);
    setClientsLoadError(null);
    setIsLoadingClients(true);

    const controller = new AbortController();

    void (async () => {
      try {
        const result = await getClients(
          {
            limit: CLIENTS_PAGE_LIMIT,
            page: 1,
            sortBy: "name",
            order: "asc",
          },
          { signal: controller.signal },
        );
        setClients(result.clients);
      } catch (error) {
        if (controller.signal.aborted) return;
        const message =
          error instanceof Error ? error.message : "კლიენტების ჩატვირთვა ვერ მოხერხდა.";
        setClientsLoadError(message);
        setClients([]);
      } finally {
        if (!controller.signal.aborted) {
          setIsLoadingClients(false);
        }
      }
    })();

    return () => controller.abort();
  }, [fallbackStatus, open, property, statusOptions]);

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
    if (!isSaving) onClose();
  };

  const handleSubmit = async () => {
    setFormError(null);

    let rentalDurationMonthsValue: number | null = null;
    if (selectedStatus === "RENTED") {
      const parsedMonths = Number.parseInt(rentalDurationMonthsInput.trim(), 10);
      if (
        Number.isNaN(parsedMonths) ||
        !Number.isInteger(parsedMonths) ||
        parsedMonths < 1
      ) {
        setFormError("შეიყვანეთ ქირის თვეების მთელი რიცხვი (მინიმუმ 1).");
        return;
      }
      rentalDurationMonthsValue = parsedMonths;
      if (tenantClientId.trim() === "") {
        setFormError("აირჩიეთ კლიენტი, რომელზეც გააქირავეთ ეს განცხადება.");
        return;
      }
    }

    const patch = buildChangeStatusPatch(
      property,
      selectedStatus,
      verificationReminderLocal,
      tenantClientId.trim(),
      rentalDurationMonthsValue,
    );

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
        aria-labelledby={`change-status-title-${property.id}`}
        className="max-h-[min(90vh,36rem)] w-full max-w-md overflow-y-auto rounded-2xl bg-card p-5 shadow-lg ring-1 ring-border"
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

          {selectedStatus === "RENTED" ? (
            <>
              <div>
                <label
                  htmlFor={`modal-rental-months-${property.id}`}
                  className="mb-1 block text-xs font-medium text-muted-foreground"
                >
                  ქირის ხანგრძლივობა (თვე)
                </label>
                <input
                  id={`modal-rental-months-${property.id}`}
                  type="number"
                  inputMode="numeric"
                  min={1}
                  step={1}
                  value={rentalDurationMonthsInput}
                  onChange={(event) =>
                    setRentalDurationMonthsInput(event.target.value)
                  }
                  className={FIELD_CLASS}
                />
              </div>
              <div>
                <label
                  htmlFor={`modal-tenant-client-${property.id}`}
                  className="mb-1 block text-xs font-medium text-muted-foreground"
                >
                  გაქირავებულია (კლიენტზე)
                </label>
                <NativeSelectSurface>
                  <select
                    id={`modal-tenant-client-${property.id}`}
                    aria-label="კლიენტი, რომელზეც არის გაქირავებული"
                    value={tenantClientId}
                    onChange={(event) => setTenantClientId(event.target.value)}
                    disabled={isLoadingClients}
                    className={FIELD_CLASS}
                  >
                    <option value="">აირჩიეთ კლიენტი…</option>
                    {clients.map((client) => (
                      <option key={client.id} value={client.id}>
                        {client.name}
                      </option>
                    ))}
                  </select>
                </NativeSelectSurface>
                {clientsLoadError ? (
                  <p className="mt-1 text-xs text-destructive" role="alert">
                    {clientsLoadError}
                  </p>
                ) : null}
              </div>
            </>
          ) : null}

          {selectedStatus === "TO_BE_VERIFIED" ? (
            <div>
              <label
                htmlFor={`modal-verification-reminder-${property.id}`}
                className="mb-1 block text-xs font-medium text-muted-foreground"
              >
                გადამოწმების შეხსენება
              </label>
              <input
                id={`modal-verification-reminder-${property.id}`}
                type="datetime-local"
                value={verificationReminderLocal}
                onChange={(event) =>
                  setVerificationReminderLocal(event.target.value)
                }
                className={FIELD_CLASS}
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
