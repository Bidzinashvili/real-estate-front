"use client";

import { Check } from "lucide-react";
import {
  RECORD_COLOR_LABELS,
  RECORD_COLORS,
  type RecordColor,
} from "@/features/recordColor/recordColor";
import {
  RECORD_COLOR_SWATCH_CLASS,
  recordColorSwatchCheckClassName,
} from "@/features/recordColor/recordColorSurface";
import { cn } from "@/shared/lib/utils";

type RecordColorSwatchesProps = {
  value: RecordColor;
  disabled?: boolean;
  onSelect: (color: RecordColor) => void;
};

export function RecordColorSwatches({
  value,
  disabled = false,
  onSelect,
}: RecordColorSwatchesProps) {
  return (
    <div
      role="listbox"
      aria-label="ჩანაწერის ფერი"
      className="grid w-[11.25rem] grid-cols-5 gap-1.5"
    >
      {RECORD_COLORS.map((color) => {
        const isSelected = color === value;
        const label = RECORD_COLOR_LABELS[color];
        return (
          <button
            key={color}
            type="button"
            role="option"
            aria-selected={isSelected}
            aria-label={label}
            title={label}
            disabled={disabled}
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              if (color === value) {
                return;
              }
              onSelect(color);
            }}
            className={cn(
              "relative h-7 w-7 rounded-full shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-60",
              RECORD_COLOR_SWATCH_CLASS[color],
              isSelected
                ? "ring-2 ring-foreground ring-offset-2 ring-offset-card"
                : "hover:scale-105",
            )}
          >
            {color === "DEFAULT" ? (
              <span
                className="pointer-events-none absolute inset-[3px] overflow-hidden rounded-full"
                aria-hidden
              >
                <span className="absolute left-1/2 top-[-20%] h-[140%] w-px -translate-x-1/2 rotate-45 bg-destructive/80" />
              </span>
            ) : null}
            {isSelected ? (
              <Check
                className={cn(
                  "absolute inset-0 m-auto h-3.5 w-3.5",
                  recordColorSwatchCheckClassName(color),
                )}
                aria-hidden
              />
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
