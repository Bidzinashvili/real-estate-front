"use client";

import { NativeSelectSurface } from "@/shared/ui/NativeSelectSurface";

const addPropertyControlShellClassName = (horizontalPadClassName: string) =>
  `block w-full rounded-lg border border-slate-200 bg-white ${horizontalPadClassName} py-2 text-sm text-slate-900 shadow-sm outline-none ring-0 placeholder:text-slate-400 focus:border-slate-900`;

export function addPropertyInputClassName() {
  return addPropertyControlShellClassName("px-3");
}

export function addPropertySelectClassName() {
  return `${addPropertyControlShellClassName("pl-3 pr-10")} appearance-none`;
}

type FieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (next: string) => void;
  type?: "text" | "number" | "tel";
  required?: boolean;
  error?: string;
  readOnly?: boolean;
  placeholder?: string;
  name?: string;
};

export function TextField({
  id,
  label,
  value,
  onChange,
  type = "text",
  required,
  error,
  readOnly,
  placeholder,
  name,
}: FieldProps) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-slate-800">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        required={required}
        readOnly={readOnly}
        placeholder={placeholder}
        onChange={readOnly ? undefined : (event) => onChange(event.target.value)}
        className={`${addPropertyInputClassName()} ${error ? "border-red-500 focus:border-red-600" : ""} ${readOnly ? "cursor-default bg-slate-50 text-slate-700" : ""}`}
      />
      {error ? (
        <p className="text-xs text-red-600" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

type SelectProps<T extends string> = {
  id: string;
  label: string;
  value: T;
  onChange: (next: T) => void;
  options: ReadonlyArray<{ value: T; label: string }>;
  error?: string;
  disabled?: boolean;
};

export function SelectField<T extends string>({
  id,
  label,
  value,
  onChange,
  options,
  error,
  disabled = false,
}: SelectProps<T>) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-slate-800">
        {label}
      </label>
      <NativeSelectSurface>
        <select
          id={id}
          value={value}
          disabled={disabled}
          onChange={(event) => onChange(event.target.value as T)}
          className={`${addPropertySelectClassName()} ${error ? "border-red-500 focus:border-red-600" : ""} ${disabled ? "cursor-not-allowed opacity-60" : ""}`}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </NativeSelectSurface>
      {error ? (
        <p className="text-xs text-red-600" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

type CheckboxProps = {
  id: string;
  label: string;
  checked: boolean;
  onChange: (next: boolean) => void;
};

export function CheckboxField({ id, label, checked, onChange }: CheckboxProps) {
  return (
    <label
      htmlFor={id}
      className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800"
    >
      <span>{label}</span>
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="h-4 w-4 rounded border-slate-300 text-slate-900"
      />
    </label>
  );
}

const counterButtonClassName =
  "flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-slate-200 bg-white text-base font-medium text-slate-800 shadow-sm outline-none hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40";

type NonNegativeCounterFieldProps = {
  id: string;
  label: string;
  value: number;
  onDecrease: () => void;
  onIncrease: () => void;
};

export function NonNegativeCounterField({
  id,
  label,
  value,
  onDecrease,
  onIncrease,
}: NonNegativeCounterFieldProps) {
  const decreaseButtonId = `${id}Decrease`;
  const increaseButtonId = `${id}Increase`;
  return (
    <div className="space-y-1.5">
      <p className="block text-sm font-medium text-slate-800" id={`${id}Label`}>
        {label}
      </p>
      <div
        className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm"
        role="group"
        aria-labelledby={`${id}Label`}
      >
        <button
          id={decreaseButtonId}
          type="button"
          className={counterButtonClassName}
          aria-label="Decrease"
          disabled={value <= 0}
          onClick={onDecrease}
        >
          −
        </button>
        <span className="min-w-[2ch] text-center text-base font-semibold tabular-nums text-slate-900">
          {value}
        </span>
        <button
          id={increaseButtonId}
          type="button"
          className={counterButtonClassName}
          aria-label="Increase"
          onClick={onIncrease}
        >
          +
        </button>
      </div>
    </div>
  );
}
