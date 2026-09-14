"use client";

import { Search, X } from "lucide-react";

type DatabaseListSearchInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  clearAriaLabel: string;
};

export function DatabaseListSearchInput({
  value,
  onChange,
  placeholder,
  clearAriaLabel,
}: DatabaseListSearchInputProps) {
  return (
    <div className="flex w-full items-center gap-1.5 rounded-full border border-border bg-card/90 px-3 py-1.5 shadow-sm">
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-8 min-w-0 w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
      />
      {value ? (
        <button
          type="button"
          onClick={() => onChange("")}
          className="inline-flex h-7 w-7 shrink-0 items-center justify-center text-muted-foreground transition hover:text-foreground"
          aria-label={clearAriaLabel}
        >
          <X className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      ) : null}
      <span
        className="inline-flex h-7 w-7 shrink-0 items-center justify-center text-muted-foreground"
        aria-hidden
      >
        <Search className="h-4 w-4" />
      </span>
    </div>
  );
}
