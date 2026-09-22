"use client";

import {
  CLIENT_PREFERENCE_LABELS,
  CLIENT_PREFERENCE_VALUES,
  type ClientPreferenceValue,
} from "@/features/matching/matchingEnums";
import { OptionChips } from "@/shared/ui/OptionChips";

const CLIENT_PREFERENCE_OPTIONS = CLIENT_PREFERENCE_VALUES.map((preferenceValue) => ({
  value: preferenceValue,
  label: CLIENT_PREFERENCE_LABELS[preferenceValue],
}));

type ClientPreferenceValueControlProps = {
  id?: string;
  value: ClientPreferenceValue;
  onChange: (next: ClientPreferenceValue) => void;
  disabled?: boolean;
};

export function ClientPreferenceValueControl({
  id,
  value,
  onChange,
  disabled = false,
}: ClientPreferenceValueControlProps) {
  return (
    <OptionChips
      id={id}
      aria-label="პრეფერენცია"
      value={value}
      onChange={onChange}
      options={CLIENT_PREFERENCE_OPTIONS}
      disabled={disabled}
    />
  );
}
