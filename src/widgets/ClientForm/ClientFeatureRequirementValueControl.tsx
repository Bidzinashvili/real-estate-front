"use client";

import {
  CLIENT_PREFERENCE_LABELS,
  type ClientPreferenceValue,
} from "@/features/matching/matchingEnums";
import { OptionChips } from "@/shared/ui/OptionChips";

const CLIENT_FEATURE_REQUIREMENT_OPTIONS = [
  { value: "YES" as const, label: CLIENT_PREFERENCE_LABELS.YES },
  { value: "DOES_NOT_MATTER" as const, label: CLIENT_PREFERENCE_LABELS.DOES_NOT_MATTER },
];

const CLIENT_LEGACY_REQUIREMENT_NO_OPTION = {
  value: "NO" as const,
  label: CLIENT_PREFERENCE_LABELS.NO,
};

function optionsForClientFeatureRequirement(
  value: ClientPreferenceValue,
): ReadonlyArray<{ value: ClientPreferenceValue; label: string }> {
  if (value === "NO") {
    return [...CLIENT_FEATURE_REQUIREMENT_OPTIONS, CLIENT_LEGACY_REQUIREMENT_NO_OPTION];
  }
  return CLIENT_FEATURE_REQUIREMENT_OPTIONS;
}

type ClientFeatureRequirementValueControlProps = {
  id?: string;
  value: ClientPreferenceValue;
  onChange: (next: ClientPreferenceValue) => void;
  disabled?: boolean;
};

export function ClientFeatureRequirementValueControl({
  id,
  value,
  onChange,
  disabled = false,
}: ClientFeatureRequirementValueControlProps) {
  return (
    <OptionChips
      id={id}
      aria-label="მოთხოვნა"
      value={value}
      onChange={onChange}
      options={optionsForClientFeatureRequirement(value)}
      allowDeselect
      emptyValue="NOT_SET"
      disabled={disabled}
    />
  );
}
