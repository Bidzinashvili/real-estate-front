import type { ClientStatus } from "@/features/clients/clientEnums";
import { CLIENT_STATUS_LABELS as CLIENT_STATUS_I18N_LABELS } from "@/shared/i18n/enumLabels";

export const CLIENT_BUSINESS_STATUSES = [
  "ACTIVE",
  "NEEDS_VERIFICATION",
  "INACTIVE",
] as const;

export type ClientBusinessStatus = (typeof CLIENT_BUSINESS_STATUSES)[number];

export const CLIENT_FILTER_STATUSES = [...CLIENT_BUSINESS_STATUSES] as const;

export const CLIENT_CREATE_STATUSES = ["ACTIVE", "NEEDS_VERIFICATION"] as const;

export const CLIENT_EDIT_STATUSES = [...CLIENT_BUSINESS_STATUSES] as const;

export function normalizeClientStatusFromApi(
  status: string | null | undefined,
): ClientStatus {
  const candidate = typeof status === "string" ? status.trim() : "";
  if (candidate === "IN_PROGRESS") {
    return "NEEDS_VERIFICATION";
  }
  if (
    candidate === "ACTIVE" ||
    candidate === "INACTIVE" ||
    candidate === "NEEDS_VERIFICATION" ||
    candidate === "ARCHIVED"
  ) {
    return candidate;
  }
  return "ACTIVE";
}

export function normalizeClientStatusForApi(status: ClientStatus): ClientStatus {
  if (status === "IN_PROGRESS") {
    return "NEEDS_VERIFICATION";
  }
  return status;
}

export function formatClientStatusLabel(status: ClientStatus): string {
  const displayStatus = normalizeClientStatusFromApi(status);
  return (
    CLIENT_STATUS_I18N_LABELS[displayStatus as keyof typeof CLIENT_STATUS_I18N_LABELS] ??
    displayStatus
  );
}

export function isClientBusinessStatus(value: string): value is ClientBusinessStatus {
  return (CLIENT_BUSINESS_STATUSES as readonly string[]).includes(value);
}

export function clientStatusToFormValue(
  status: ClientStatus,
): ClientBusinessStatus | "ARCHIVED" | "" {
  const normalized = normalizeClientStatusFromApi(status);
  if (normalized === "ARCHIVED") {
    return "ARCHIVED";
  }
  if (isClientBusinessStatus(normalized)) {
    return normalized;
  }
  return "ACTIVE";
}
