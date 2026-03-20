export const DEAL_TYPES = ["SALE", "RENT", "DAILY_RENT"] as const;

export type DealType = (typeof DEAL_TYPES)[number];

export const DEAL_TYPE_OPTIONS: ReadonlyArray<{ value: DealType; label: string }> = [
  { value: "SALE", label: "Sale" },
  { value: "RENT", label: "Rent" },
  { value: "DAILY_RENT", label: "Daily rent" },
];

export function isDealType(value: string): value is DealType {
  return (DEAL_TYPES as readonly string[]).includes(value);
}

export function parseDealType(value: unknown): DealType {
  const s = typeof value === "string" ? value.trim() : "";
  return isDealType(s) ? s : "SALE";
}

export function formatDealTypeLabel(value: DealType): string {
  const opt = DEAL_TYPE_OPTIONS.find((o) => o.value === value);
  return opt?.label ?? value;
}
