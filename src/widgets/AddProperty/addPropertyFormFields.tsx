"use client";

import { NativeSelectSurface } from "@/shared/ui/NativeSelectSurface";

const addPropertyControlShellClassName = (horizontalPadClassName: string) =>
  `block w-full rounded-lg border border-border bg-card ${horizontalPadClassName} py-2 text-sm text-foreground shadow-sm outline-none ring-0 placeholder:text-muted-foreground focus:border-primary`;

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
      <label htmlFor={id} className="block text-sm font-medium text-foreground">
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
        className={`${addPropertyInputClassName()} ${error ? "border-destructive focus:border-destructive" : ""} ${readOnly ? "cursor-default bg-muted text-foreground" : ""}`}
      />
      {error ? (
        <p className="text-xs text-destructive" role="alert">
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
  required?: boolean;
};

export function SelectField<T extends string>({
  id,
  label,
  value,
  onChange,
  options,
  error,
  disabled = false,
  required = false,
}: SelectProps<T>) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-foreground">
        {label}
      </label>
      <NativeSelectSurface>
        <select
          id={id}
          value={value}
          disabled={disabled}
          required={required}
          onChange={(event) => onChange(event.target.value as T)}
          className={`${addPropertySelectClassName()} ${error ? "border-destructive focus:border-destructive" : ""} ${disabled ? "cursor-not-allowed opacity-60" : ""}`}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </NativeSelectSurface>
      {error ? (
        <p className="text-xs text-destructive" role="alert">
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
      className="flex items-center justify-between rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground"
    >
      <span>{label}</span>
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="h-4 w-4 rounded border-border text-foreground"
      />
    </label>
  );
}

const counterButtonClassName =
  "flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border bg-card text-base font-medium text-foreground shadow-sm outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40";

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
      <p className="block text-sm font-medium text-foreground" id={`${id}Label`}>
        {label}
      </p>
      <div
        className="flex items-center justify-between gap-3 rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground shadow-sm"
        role="group"
        aria-labelledby={`${id}Label`}
      >
        <button
          id={decreaseButtonId}
          type="button"
          className={counterButtonClassName}
          aria-label="შემცირება"
          disabled={value <= 0}
          onClick={onDecrease}
        >
          −
        </button>
        <span className="min-w-[2ch] text-center text-base font-semibold tabular-nums text-foreground">
          {value}
        </span>
        <button
          id={increaseButtonId}
          type="button"
          className={counterButtonClassName}
          aria-label="გაზრდა"
          onClick={onIncrease}
        >
          +
        </button>
      </div>
    </div>
  );
}
