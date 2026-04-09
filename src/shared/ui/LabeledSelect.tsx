"use client";

import { NativeSelectSurface } from "@/shared/ui/NativeSelectSurface";

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
  const selectId = id ?? label.replace(/\s+/g, "-").toLowerCase();

  return (
    <div className="space-y-1.5">
      <label
        htmlFor={selectId}
        className="block text-sm font-medium text-slate-800"
      >
        {label}
      </label>
      <NativeSelectSurface>
        <select
          id={selectId}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          disabled={disabled}
          className="block w-full appearance-none rounded-lg border border-slate-200 bg-white pl-3 pr-10 py-2 text-sm text-slate-900 shadow-sm outline-none ring-0 disabled:cursor-not-allowed disabled:bg-slate-50"
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </NativeSelectSurface>
    </div>
  );
}
