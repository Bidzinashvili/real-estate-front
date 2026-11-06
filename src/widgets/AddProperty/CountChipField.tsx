"use client";

import { useState } from "react";
import { addPropertyInputClassName } from "@/widgets/AddProperty/addPropertyFormFields";
import { OptionChips, OPTION_CHIPS_FORM_LABEL_CLASS_NAME } from "@/shared/ui/OptionChips";

const MORE_VALUE = "more";

type CountChipFieldProps = {
  id: string;
  label: string;
  /** Raw count as a string ("" when unset). */
  value: string;
  onChange: (next: string) => void;
  /** First chip (1 for rooms, 0 for bedrooms). */
  min?: number;
  /** Last explicit chip; a "{max+1}+" chip opens a number input. */
  maxChip?: number;
  required?: boolean;
  error?: string;
  disabled?: boolean;
  labelClassName?: string;
};

function parseCount(value: string): number | null {
  const trimmed = value.trim();
  if (trimmed === "") return null;
  const parsed = Number.parseInt(trimmed, 10);
  return Number.isFinite(parsed) ? parsed : null;
}

/**
 * ss.ge-style count picker: tap 1 2 3 4 5 or "6+" (which reveals a number
 * input) instead of typing the number.
 */
export function CountChipField({
  id,
  label,
  value,
  onChange,
  min = 1,
  maxChip = 5,
  required,
  error,
  disabled,
  labelClassName = OPTION_CHIPS_FORM_LABEL_CLASS_NAME,
}: CountChipFieldProps) {
  const parsed = parseCount(value);
  const [moreOpen, setMoreOpen] = useState(false);
  const isAboveChips = parsed !== null && parsed > maxChip;
  const showMoreInput = moreOpen || isAboveChips;

  const options = [
    ...Array.from({ length: maxChip - min + 1 }, (_, i) => {
      const n = String(min + i);
      return { value: n, label: n };
    }),
    { value: MORE_VALUE, label: `${maxChip + 1}+` },
  ];

  const selected = showMoreInput
    ? MORE_VALUE
    : parsed !== null && parsed >= min && parsed <= maxChip
      ? String(parsed)
      : "";

  function handleChipChange(next: string) {
    if (next === MORE_VALUE) {
      setMoreOpen(true);
      if (!isAboveChips) onChange(String(maxChip + 1));
      return;
    }
    setMoreOpen(false);
    onChange(next);
  }

  return (
    <div className="space-y-2">
      <OptionChips
        id={id}
        label={label}
        labelClassName={labelClassName}
        value={selected}
        onChange={handleChipChange}
        options={options}
        required={required}
        error={showMoreInput ? undefined : error}
        disabled={disabled}
      />
      {showMoreInput ? (
        <div className="space-y-1.5">
          <input
            id={`${id}-more`}
            type="number"
            inputMode="numeric"
            min={maxChip + 1}
            aria-label={label}
            value={value}
            disabled={disabled}
            onWheel={(e) => e.currentTarget.blur()}
            onKeyDown={(e) => {
              if (e.key === "-" || e.key === "e" || e.key === "E" || e.key === ".") {
                e.preventDefault();
              }
            }}
            onChange={(e) => onChange(e.target.value)}
            className={`${addPropertyInputClassName("px-3")} max-w-[8rem] ${error ? "border-destructive focus:border-destructive" : ""}`}
          />
          {error ? (
            <p className="text-xs text-destructive" role="alert">
              {error}
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
