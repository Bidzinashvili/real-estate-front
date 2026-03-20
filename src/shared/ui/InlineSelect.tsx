"use client";

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
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      aria-label={ariaLabel}
      className={
        className ??
        "bg-transparent pr-2 text-xs outline-none"
      }
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
