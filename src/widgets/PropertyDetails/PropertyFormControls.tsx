"use client";

import { useEffect, useState } from "react";
import type { InputHTMLAttributes } from "react";

const inputClassName =
  "block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none ring-0 placeholder:text-slate-400 disabled:cursor-not-allowed disabled:bg-slate-50";

export function EditableNumericTextInput({
  label,
  value,
  onValueChange,
  parse,
  disabled = false,
  inputMode = "decimal",
  placeholder,
}: {
  label: string;
  value: number | undefined;
  onValueChange: (next: number | undefined) => void;
  parse: (raw: string) => number | undefined;
  disabled?: boolean;
  inputMode?: InputHTMLAttributes<HTMLInputElement>["inputMode"];
  placeholder?: string;
}) {
  const [draft, setDraft] = useState<string | null>(null);

  useEffect(() => {
    setDraft(null);
  }, [value]);

  const display = draft !== null ? draft : value === undefined ? "" : String(value);

  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-slate-800">{label}</label>
      <input
        type="text"
        inputMode={inputMode}
        autoComplete="off"
        placeholder={placeholder}
        value={display}
        onChange={(event) => {
          const raw = event.target.value;
          setDraft(raw);
          if (raw.trim() === "") {
            onValueChange(undefined);
            return;
          }
          const parsed = parse(raw);
          if (parsed !== undefined) {
            onValueChange(parsed);
          }
        }}
        onBlur={() => {
          setDraft((currentDraft) => {
            if (currentDraft === null) return null;
            const trimmed = currentDraft.trim();
            if (trimmed === "") {
              onValueChange(undefined);
            } else {
              const parsed = parse(trimmed);
              if (parsed !== undefined) {
                onValueChange(parsed);
              }
            }
            return null;
          });
        }}
        disabled={disabled}
        className={inputClassName}
      />
    </div>
  );
}

export function EditableTextInput({
  label,
  value,
  onChange,
  disabled = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-slate-800">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
        className={inputClassName}
      />
    </div>
  );
}

export function EditableCheckbox({
  label,
  checked,
  onChange,
  disabled = false,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
      <label className="block text-sm font-medium text-slate-800">{label}</label>
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        disabled={disabled}
        className="h-4 w-4 accent-slate-900"
      />
    </div>
  );
}
