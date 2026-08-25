import type { JsonValue } from "@/shared/lib/jsonValue";
import { PROPERTY_STATUS_LABELS as PROPERTY_STATUS_DISPLAY_LABELS } from "@/shared/i18n/enumLabels";
import type { DealType } from "@/features/properties/dealType";

export const PROPERTY_STATUSES = [
  "FOR_SALE",
  "FOR_RENT",
  "AVAILABLE_SOON",
  "SOLD",
  "RENTED",
  "NEEDS_VERIFICATION",
  "ARCHIVED",
] as const;

export type PropertyStatus = (typeof PROPERTY_STATUSES)[number];

export const PROPERTY_STATUS_LABELS: Record<PropertyStatus, string> = {
  FOR_RENT: PROPERTY_STATUS_DISPLAY_LABELS.FOR_RENT,
  FOR_SALE: PROPERTY_STATUS_DISPLAY_LABELS.FOR_SALE,
  AVAILABLE_SOON: PROPERTY_STATUS_DISPLAY_LABELS.AVAILABLE_SOON,
  RENTED: PROPERTY_STATUS_DISPLAY_LABELS.RENTED,
  SOLD: PROPERTY_STATUS_DISPLAY_LABELS.SOLD,
  NEEDS_VERIFICATION: PROPERTY_STATUS_DISPLAY_LABELS.NEEDS_VERIFICATION,
  ARCHIVED: PROPERTY_STATUS_DISPLAY_LABELS.ARCHIVED,
};

export const PROPERTY_STATUS_FILTER_OPTIONS: ReadonlyArray<{
  value: PropertyStatus | "";
  label: string;
}> = [
  { value: "", label: "ყველა სტატუსი" },
  ...PROPERTY_STATUSES.map((status) => ({
    value: status,
    label: PROPERTY_STATUS_LABELS[status],
  })),
];

export function isPropertyStatus(value: string): value is PropertyStatus {
  return (PROPERTY_STATUSES as readonly string[]).includes(value);
}

export function parsePropertyStatus(value: JsonValue | undefined): PropertyStatus {
  const candidate = typeof value === "string" ? value.trim() : "";
  if (candidate === "TO_BE_VERIFIED") {
    return "NEEDS_VERIFICATION";
  }
  return isPropertyStatus(candidate) ? candidate : "FOR_RENT";
}

export function formatPropertyStatusLabel(status: PropertyStatus): string {
  return PROPERTY_STATUS_LABELS[status] ?? status;
}

export function isRentalDealType(dealType: DealType): boolean {
  return dealType === "RENT" || dealType === "DAILY_RENT";
}

export function getSelectablePropertyStatuses(dealType: DealType): PropertyStatus[] {
  if (dealType === "SALE") {
    return ["FOR_SALE", "SOLD"];
  }
  if (isRentalDealType(dealType)) {
    return ["FOR_RENT", "AVAILABLE_SOON", "RENTED"];
  }
  return ["FOR_SALE", "FOR_RENT"];
}
