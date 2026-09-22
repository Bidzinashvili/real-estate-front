"use client";

import type { VerifiableBooleanUiState } from "@/features/properties/apartmentVerification";
import { OptionChips, OPTION_CHIPS_FORM_LABEL_CLASS_NAME } from "@/shared/ui/OptionChips";

const VERIFIABLE_BOOLEAN_OPTIONS: Array<{
  value: VerifiableBooleanUiState;
  label: string;
}> = [
  { value: "unknown", label: "არ არის მითითებული" },
  { value: "toBeVerified", label: "გადასამოწმებელია" },
  { value: "yes", label: "კი" },
  { value: "no", label: "არა" },
];

type VerifiableBooleanFieldProps = {
  id: string;
  label: string;
  value: VerifiableBooleanUiState;
  onChange: (next: VerifiableBooleanUiState) => void;
};

export function VerifiableBooleanField({
  id,
  label,
  value,
  onChange,
}: VerifiableBooleanFieldProps) {
  return (
    <OptionChips
      id={id}
      label={label}
      labelClassName={OPTION_CHIPS_FORM_LABEL_CLASS_NAME}
      value={value}
      onChange={onChange}
      options={VERIFIABLE_BOOLEAN_OPTIONS}
    />
  );
}
