"use client";

import { OptionChips, OPTION_CHIPS_FORM_LABEL_CLASS_NAME } from "@/shared/ui/OptionChips";

export type LabeledSelectOption = { value: string; label: string };

type LabeledSelectProps = {
  id?: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly LabeledSelectOption[];
  disabled?: boolean;
};

export function LabeledSelect({
  id,
  label,
  value,
  onChange,
  options,
  disabled,
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
    />
  );
}
