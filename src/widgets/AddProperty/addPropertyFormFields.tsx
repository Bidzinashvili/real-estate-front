"use client";

import { OptionChips, OPTION_CHIPS_FORM_LABEL_CLASS_NAME } from "@/shared/ui/OptionChips";

const addPropertyControlShellClassName = (horizontalPadClassName: string) =>
  `block w-full rounded-lg border border-border bg-card ${horizontalPadClassName} py-2 text-sm text-foreground shadow-sm outline-none ring-0 placeholder:text-muted-foreground focus:border-primary`;

export function addPropertyInputClassName(horizontalPadClassName = "px-3") {
  return addPropertyControlShellClassName(horizontalPadClassName);
}

type FieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (next: string) => void;
  onBlur?: () => void;
  type?: "text" | "number" | "tel";
  required?: boolean;
  error?: string;
  readOnly?: boolean;
  placeholder?: string;
  name?: string;
  leadingSymbol?: string;
};

export function TextField({
  id,
  label,
  value,
  onChange,
  onBlur,
  type = "text",
  required,
  error,
  readOnly,
  placeholder,
  name,
  leadingSymbol,
}: FieldProps) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-foreground">
        {label}
      </label>
      <div className="relative">
        {leadingSymbol ? (
          <span className="pointer-events-none absolute inset-y-0 left-0 flex w-8 items-center justify-center text-sm font-semibold text-foreground">
            {leadingSymbol}
          </span>
        ) : null}
        <input
          id={id}
          name={name}
          type={type}
          value={value}
          required={required}
          readOnly={readOnly}
          placeholder={placeholder}
          onChange={readOnly ? undefined : (event) => onChange(event.target.value)}
          onBlur={readOnly ? undefined : onBlur}
          className={`${addPropertyInputClassName(leadingSymbol ? "pl-8 pr-3" : "px-3")} ${error ? "border-destructive focus:border-destructive" : ""} ${readOnly ? "cursor-default bg-muted text-foreground" : ""}`}
        />
      </div>
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
    <OptionChips
      id={id}
      label={label}
      labelClassName={OPTION_CHIPS_FORM_LABEL_CLASS_NAME}
      value={value}
      onChange={onChange}
      options={options}
      disabled={disabled}
      required={required}
      error={error}
    />
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
