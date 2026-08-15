import type { JsonValue } from "@/shared/lib/jsonValue";
import { DEAL_TYPE_LABELS } from "@/shared/i18n/enumLabels";

export const DEAL_TYPES = ["SALE", "RENT", "DAILY_RENT"] as const;

export type DealType = (typeof DEAL_TYPES)[number];

export const DEAL_TYPE_OPTIONS: ReadonlyArray<{ value: DealType; label: string }> = [
  { value: "SALE", label: DEAL_TYPE_LABELS.SALE },
  { value: "RENT", label: DEAL_TYPE_LABELS.RENT },
  { value: "DAILY_RENT", label: DEAL_TYPE_LABELS.DAILY_RENT },
];

export function isDealType(value: string): value is DealType {
  return (DEAL_TYPES as readonly string[]).includes(value);
}

export function parseDealType(value: JsonValue | undefined): DealType {
  const stringCandidate = typeof value === "string" ? value.trim() : "";
  return isDealType(stringCandidate) ? stringCandidate : "SALE";
}

export function formatDealTypeLabel(value: DealType): string {
  const opt = DEAL_TYPE_OPTIONS.find((o) => o.value === value);
  return opt?.label ?? value;
}
