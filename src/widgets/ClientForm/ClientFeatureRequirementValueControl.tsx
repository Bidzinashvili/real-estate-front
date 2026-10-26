"use client";

import type { ClientPreferenceValue } from "@/features/matching/matchingEnums";
import { OptionChips } from "@/shared/ui/OptionChips";
import {
  CLIENT_YES_DOES_NOT_MATTER_OPTIONS,
  CLIENT_YES_DOES_NOT_MATTER_TO_VERIFY_OPTIONS,
} from "@/widgets/ClientForm/clientRequirementChipOptions";

type ClientFeatureRequirementValueControlProps = {
  id?: string;
  value: ClientPreferenceValue;
  onChange: (next: ClientPreferenceValue) => void;
  disabled?: boolean;
  includeToVerify?: boolean;
};

export function ClientFeatureRequirementValueControl({
  id,
  value,
  onChange,
  disabled = false,
  includeToVerify = false,
}: ClientFeatureRequirementValueControlProps) {
  const options = includeToVerify
    ? CLIENT_YES_DOES_NOT_MATTER_TO_VERIFY_OPTIONS
    : CLIENT_YES_DOES_NOT_MATTER_OPTIONS;

  return (
    <OptionChips
      id={id}
      aria-label="მოთხოვნა"
      value={value}
      onChange={onChange}
      options={options}
      allowDeselect
      emptyValue="NOT_SET"
      disabled={disabled}
    />
  );
}
