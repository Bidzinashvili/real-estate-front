"use client";

import { useId } from "react";
import { cn } from "@/shared/lib/utils";
import { optionChipClassName } from "@/shared/ui/chipStyles";
import { typography } from "@/shared/ui/typography";

export type OptionChipItem<T extends string = string> = {
  value: T;
  label: string;
};

export const OPTION_CHIPS_FORM_LABEL_CLASS_NAME = cn(
  "mb-2 block",
  typography.fieldLabel,
  "text-foreground",
);

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

const DEFAULT_LABEL_CLASS_NAME = cn("mb-2 block", typography.fieldLabel);

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
              className={optionChipClassName({
                isSelected,
                isCompact,
                hasError: Boolean(error),
                isDisabled: disabled,
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
              className={optionChipClassName({
                isSelected,
                isCompact,
                hasError: Boolean(error),
                isDisabled: disabled,
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
