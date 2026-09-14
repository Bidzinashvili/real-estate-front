import {
  CLIENT_STATUS_LABELS,
  DEAL_TYPE_LABELS,
  isClientStatus,
  isDealType,
  type ClientStatus,
  type DealType,
} from "@/features/clients/clientEnums";
import { ARCHIVE_COPY } from "@/features/lifecycle/archiveCopy";
import type { ClientProfileHistoryNote } from "@/features/clientProfiles/types";

export const CLIENT_PROFILE_AUDIT_LABELS: Record<string, string> = {
  BLACKLIST: "შავ სიაში დამატება",
  UNBLACKLIST: "შავი სიიდან ამოღება",
  LINK: "კლიენტის მიბმა",
  REASSIGN: "პროფილის შეცვლა",
  MERGE: "პროფილების გაერთიანება",
  ADD_PHONE: "ნომრის დამატება",
  REMOVE_PHONE: "ნომრის წაშლა",
};

export function formatClientProfileDealType(dealType: string | null): string | null {
  if (!dealType) {
    return null;
  }
  if (isDealType(dealType)) {
    return DEAL_TYPE_LABELS[dealType];
  }
  return null;
}

export function formatClientProfileDealTypes(dealTypes: DealType[]): string {
  return dealTypes
    .map((dealType) => formatClientProfileDealType(dealType))
    .filter((label): label is string => Boolean(label))
    .join(", ");
}

export function formatClientNoteStatus(status: ClientStatus | null): string | null {
  if (!status) {
    return null;
  }
  if (isClientStatus(status)) {
    return CLIENT_STATUS_LABELS[status];
  }
  return null;
}

export function formatBudgetRange(
  budgetMin: number | null,
  budgetMax: number | null,
): string | null {
  if (budgetMin === null && budgetMax === null) {
    return null;
  }
  if (budgetMin !== null && budgetMax !== null) {
    return `${budgetMin.toLocaleString()}–${budgetMax.toLocaleString()}`;
  }
  if (budgetMin !== null) {
    return `${budgetMin.toLocaleString()}–`;
  }
  return `–${(budgetMax as number).toLocaleString()}`;
}

export function formatOccurrenceCount(count: number): string {
  return `${count}-ჯერ`;
}

export function historyNoteTitle(note: ClientProfileHistoryNote): string {
  const dealLabel = formatClientProfileDealType(note.dealType);
  const districtLabel = note.districts.filter((district) => district.trim() !== "").join(", ");
  if (dealLabel && districtLabel) {
    return `${dealLabel} — ${districtLabel}`;
  }
  if (dealLabel) {
    return dealLabel;
  }
  if (note.name?.trim()) {
    return note.name.trim();
  }
  return "კლიენტის მოთხოვნა";
}

export function isHistoryNoteArchived(note: ClientProfileHistoryNote): boolean {
  return Boolean(note.archivedAt && note.archivedAt.trim() !== "");
}

export function historyNoteArchivedLabel(): string {
  return ARCHIVE_COPY.archivedBadge;
}

export function owningAgentDisplayName(
  owningAgent: ClientProfileHistoryNote["owningAgent"],
): string | null {
  const fullName = owningAgent?.fullName?.trim();
  return fullName ? fullName : null;
}

export function auditActionLabel(action: string): string {
  return CLIENT_PROFILE_AUDIT_LABELS[action] ?? action;
}

export function primaryPhoneFromList(
  phones: Array<{ phone: string; isPrimary: boolean; label?: string }>,
): { phone: string; label: string } | null {
  const primary =
    phones.find((phoneItem) => phoneItem.isPrimary) ?? phones[0] ?? null;
  if (!primary || primary.phone.trim() === "") {
    return null;
  }
  return {
    phone: primary.phone,
    label: primary.label?.trim() || "მთავარი",
  };
}
