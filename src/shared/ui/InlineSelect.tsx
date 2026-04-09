"use client";

import { NativeSelectSurface } from "@/shared/ui/NativeSelectSurface";

export type InlineSelectOption = { value: string; label: string };

type InlineSelectProps = {
  value: string;
  onChange: (value: string) => void;
  options: readonly InlineSelectOption[];
  "aria-label": string;
  className?: string;
};

export function InlineSelect({
  value,
  onChange,
  options,
  "aria-label": ariaLabel,
  className,
}: InlineSelectProps) {
  return (
    <NativeSelectSurface className={className ?? "text-xs"}>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-label={ariaLabel}
        className="w-full appearance-none bg-transparent pr-10 outline-none"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </NativeSelectSurface>
  );
}
