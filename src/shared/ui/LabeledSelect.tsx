"use client";

import { OptionChips, OPTION_CHIPS_FORM_LABEL_CLASS_NAME } from "@/shared/ui/OptionChips";
import type { FieldVisibility } from "@/shared/ui/VisibilityHint";

export type LabeledSelectOption = { value: string; label: string };

type LabeledSelectProps = {
  id?: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly LabeledSelectOption[];
  disabled?: boolean;
  visibility?: FieldVisibility;
};

export function LabeledSelect({
  id,
  label,
  value,
  onChange,
  options,
  disabled,
  visibility,
}: LabeledSelectProps) {
  return (
    <OptionChips
      id={id}
      label={label}
      labelClassName={OPTION_CHIPS_FORM_LABEL_CLASS_NAME}
      value={value}
      onChange={onChange}
      options={options}
      disabled={disabled}
      visibility={visibility}
    />
  );
}
