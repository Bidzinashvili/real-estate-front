import type { LockState } from "@/features/clients/clientApi.types";
import type { ClientPreferenceValue } from "@/features/matching/matchingEnums";
import { CLIENT_PREFERENCE_LABELS, isClientPreferenceValue } from "@/features/matching/matchingEnums";
import { ClientDetailsLockBadge } from "@/widgets/ClientDetails/ClientDetailsLockBadge";

type ClientDetailsRequirementRowProps = {
  label: string;
  value: string | number | boolean | ClientPreferenceValue | null | undefined;
  lock?: LockState;
};

export function ClientDetailsRequirementRow({
  label,
  value,
  lock,
}: ClientDetailsRequirementRowProps) {
  const hasDisplayValue =
    value !== null &&
    value !== undefined &&
    !(typeof value === "string" && value.trim() === "") &&
    !(typeof value === "string" && isClientPreferenceValue(value) && value === "NOT_SET");
  const showLockedOnly = lock !== undefined && lock !== "none";
  if (!hasDisplayValue && !showLockedOnly) {
    return null;
  }
  const displayValue =
    !hasDisplayValue && showLockedOnly
      ? "—"
      : typeof value === "boolean"
        ? value
          ? "Yes"
          : "No"
        : typeof value === "string" && isClientPreferenceValue(value)
          ? CLIENT_PREFERENCE_LABELS[value]
          : String(value);
  return (
    <div className="flex flex-col gap-0.5">
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-xs text-slate-500">{label}</span>
        {lock !== undefined ? <ClientDetailsLockBadge lock={lock} /> : null}
      </div>
      <span className="text-sm font-medium text-slate-800">{displayValue}</span>
    </div>
  );
}
