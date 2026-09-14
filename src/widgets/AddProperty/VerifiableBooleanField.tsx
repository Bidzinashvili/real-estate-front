"use client";

import type { VerifiableBooleanUiState } from "@/features/properties/apartmentVerification";
import { NativeSelectSurface } from "@/shared/ui/NativeSelectSurface";

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
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-foreground">
        {label}
      </label>
      <NativeSelectSurface>
        <select
          id={id}
          value={value}
          onChange={(event) =>
            onChange(event.target.value as VerifiableBooleanUiState)
          }
          className="block w-full appearance-none rounded-lg border border-border bg-card py-2 pl-3 pr-10 text-sm text-foreground outline-none focus:border-primary"
        >
          {VERIFIABLE_BOOLEAN_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </NativeSelectSurface>
    </div>
  );
}
