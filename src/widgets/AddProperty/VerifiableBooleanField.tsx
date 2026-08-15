"use client";

import type { VerifiableBooleanUiState } from "@/features/properties/apartmentVerification";
import { NativeSelectSurface } from "@/shared/ui/NativeSelectSurface";

const VERIFIABLE_BOOLEAN_OPTIONS: Array<{
  value: VerifiableBooleanUiState;
  label: string;
}> = [
  { value: "unknown", label: "Unspecified" },
  { value: "toBeVerified", label: "To be verified" },
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
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
      <label htmlFor={id} className="block text-sm font-medium text-slate-800">
        {label}
      </label>
      <NativeSelectSurface>
        <select
          id={id}
          value={value}
          onChange={(event) =>
            onChange(event.target.value as VerifiableBooleanUiState)
          }
          className="block w-full appearance-none rounded-lg border border-slate-200 bg-white py-2 pl-3 pr-10 text-sm text-slate-900 outline-none focus:border-slate-400"
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
