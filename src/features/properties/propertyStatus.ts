import type { JsonValue } from "@/shared/lib/jsonValue";

export const PROPERTY_STATUSES = [
  "TO_BE_VERIFIED",
  "FOR_RENT",
  "FOR_SALE",
  "AVAILABLE_SOON",
  "RENTED",
  "SOLD",
  "ARCHIVED",
] as const;

export type PropertyStatus = (typeof PROPERTY_STATUSES)[number];

export const PROPERTY_STATUS_LABELS: Record<PropertyStatus, string> = {
  FOR_RENT: "Available for rent",
  FOR_SALE: "Available for sale",
  AVAILABLE_SOON: "Available soon",
  RENTED: "Rented",
  SOLD: "Sold",
  ARCHIVED: "Archived",
  TO_BE_VERIFIED: "Needs verification",
};

export const PROPERTY_STATUS_FILTER_OPTIONS: ReadonlyArray<{
  value: PropertyStatus | "";
  label: string;
}> = [
  { value: "", label: "All statuses" },
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
  return isPropertyStatus(candidate) ? candidate : "FOR_RENT";
}

export function formatPropertyStatusLabel(status: PropertyStatus): string {
  return PROPERTY_STATUS_LABELS[status] ?? status;
}
