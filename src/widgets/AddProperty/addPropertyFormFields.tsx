"use client";

export function addPropertyInputClassName() {
  return "block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none ring-0 placeholder:text-slate-400 focus:border-slate-900";
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
}: FieldProps) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-slate-800">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        required={required}
        readOnly={readOnly}
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
};

export function SelectField<T extends string>({
  id,
  label,
  value,
  onChange,
  options,
  error,
}: SelectProps<T>) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-slate-800">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value as T)}
        className={`${addPropertyInputClassName()} ${error ? "border-red-500 focus:border-red-600" : ""}`}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
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
