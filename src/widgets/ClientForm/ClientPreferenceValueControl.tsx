"use client";

import {
  CLIENT_PREFERENCE_LABELS,
  CLIENT_PREFERENCE_VALUES,
  type ClientPreferenceValue,
} from "@/features/matching/matchingEnums";
import { NativeSelectSurface } from "@/shared/ui/NativeSelectSurface";

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
    <NativeSelectSurface>
      <select
        id={id}
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value as ClientPreferenceValue)}
        className="block w-full appearance-none rounded-lg border border-border bg-card py-2 pl-3 pr-10 text-sm text-foreground outline-none focus:border-primary disabled:cursor-not-allowed disabled:bg-muted"
      >
        {CLIENT_PREFERENCE_VALUES.map((preferenceValue) => (
          <option key={preferenceValue} value={preferenceValue}>
            {CLIENT_PREFERENCE_LABELS[preferenceValue]}
          </option>
        ))}
      </select>
    </NativeSelectSurface>
  );
}
