"use client";

import { useId } from "react";
import { cn } from "@/shared/lib/utils";

export type OptionChipItem<T extends string = string> = {
  value: T;
  label: string;
};

export const OPTION_CHIPS_FORM_LABEL_CLASS_NAME =
  "mb-1.5 block text-sm font-medium text-foreground";

type OptionChipsProps<T extends string> = {
  id?: string;
  options: ReadonlyArray<OptionChipItem<T>>;
  value: T;
  onChange: (value: T) => void;
  "aria-label"?: string;
  label?: string;
  labelClassName?: string;
  size?: "compact" | "default";
  disabled?: boolean;
  required?: boolean;
  allowDeselect?: boolean;
  emptyValue?: T;
  error?: string;
  className?: string;
};

const DEFAULT_LABEL_CLASS_NAME =
  "mb-1.5 block text-xs font-medium text-muted-foreground";

function optionChipButtonClassName(args: {
  isSelected: boolean;
  isCompact: boolean;
  hasError: boolean;
}): string {
  return cn(
    "inline-flex max-w-full items-center justify-center border text-left font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60",
    args.isCompact ? "rounded-lg px-3 py-1.5 text-xs" : "rounded-lg px-3 py-2 text-sm",
    args.isSelected
      ? "border-primary bg-primary text-primary-foreground shadow-sm"
      : args.hasError
        ? "border-destructive bg-card text-foreground hover:bg-accent"
        : "border-border bg-card text-foreground hover:border-primary/40 hover:bg-accent",
  );
}

export function OptionChips<T extends string>({
  id,
  options,
  value,
  onChange,
  "aria-label": ariaLabel,
  label,
  labelClassName,
  size = "default",
  disabled = false,
  required = false,
  allowDeselect = false,
  emptyValue,
  error,
  className,
}: OptionChipsProps<T>) {
  const generatedId = useId();
  const groupId = id ?? generatedId;
  const labelElementId = `${groupId}-label`;
  const errorElementId = `${groupId}-error`;
  const isCompact = size === "compact";

  return (
    <div className={className}>
      {label ? (
        <span id={labelElementId} className={cn(DEFAULT_LABEL_CLASS_NAME, labelClassName)}>
          {label}
          {required ? <span className="text-red-500"> *</span> : null}
        </span>
      ) : null}
      <div
        id={groupId}
        role="radiogroup"
        aria-label={label ? undefined : ariaLabel}
        aria-labelledby={label ? labelElementId : undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorElementId : undefined}
        className="flex flex-wrap gap-2"
      >
        {options.map((option) => {
          const isSelected = option.value === value;
          const optionKey = option.value === "" ? "empty" : option.value;

          return (
            <button
              key={optionKey}
              type="button"
              role="radio"
              aria-checked={isSelected}
              disabled={disabled}
              onClick={() => {
                if (allowDeselect && isSelected) {
                  onChange((emptyValue ?? "") as T);
                  return;
                }
                onChange(option.value);
              }}
              className={optionChipButtonClassName({
                isSelected,
                isCompact,
                hasError: Boolean(error),
              })}
            >
              {option.label}
            </button>
          );
        })}
      </div>
      {error ? (
        <p id={errorElementId} className="mt-1.5 text-xs text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

type MultiOptionChipsProps<T extends string> = {
  id?: string;
  options: ReadonlyArray<OptionChipItem<T>>;
  value: ReadonlyArray<T>;
  onChange: (value: T[]) => void;
  "aria-label"?: string;
  label?: string;
  labelClassName?: string;
  size?: "compact" | "default";
  disabled?: boolean;
  error?: string;
  className?: string;
};

export function MultiOptionChips<T extends string>({
  id,
  options,
  value,
  onChange,
  "aria-label": ariaLabel,
  label,
  labelClassName,
  size = "default",
  disabled = false,
  error,
  className,
}: MultiOptionChipsProps<T>) {
  const generatedId = useId();
  const groupId = id ?? generatedId;
  const labelElementId = `${groupId}-label`;
  const errorElementId = `${groupId}-error`;
  const isCompact = size === "compact";
  const selectedValues = new Set(value);

  return (
    <div className={className}>
      {label ? (
        <span id={labelElementId} className={cn(DEFAULT_LABEL_CLASS_NAME, labelClassName)}>
          {label}
        </span>
      ) : null}
      <div
        id={groupId}
        role="group"
        aria-label={label ? undefined : ariaLabel}
        aria-labelledby={label ? labelElementId : undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorElementId : undefined}
        className="flex flex-wrap gap-2"
      >
        {options.map((option) => {
          const isSelected = selectedValues.has(option.value);
          const optionKey = option.value === "" ? "empty" : option.value;

          return (
            <button
              key={optionKey}
              type="button"
              aria-pressed={isSelected}
              disabled={disabled}
              onClick={() => {
                if (isSelected) {
                  onChange(value.filter((selectedValue) => selectedValue !== option.value));
                  return;
                }
                onChange([...value, option.value]);
              }}
              className={optionChipButtonClassName({
                isSelected,
                isCompact,
                hasError: Boolean(error),
              })}
            >
              {option.label}
            </button>
          );
        })}
      </div>
      {error ? (
        <p id={errorElementId} className="mt-1.5 text-xs text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
