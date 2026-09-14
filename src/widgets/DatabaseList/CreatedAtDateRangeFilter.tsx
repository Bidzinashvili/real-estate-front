"use client";

import {
  createdDatePresetRange,
  resolveCreatedDateQuery,
  type CreatedDatePreset,
} from "@/features/databaseList/createdDateRange";

const DATE_INPUT_CLASS =
  "h-8 rounded-lg border border-border bg-card px-2 text-xs text-foreground outline-none focus:border-primary disabled:cursor-not-allowed disabled:opacity-60";

const PRESET_OPTIONS: ReadonlyArray<{ value: CreatedDatePreset; label: string }> = [
  { value: "today", label: "დღეს" },
  { value: "last7", label: "ბოლო 7 დღე" },
  { value: "last30", label: "ბოლო 30 დღე" },
];

type CreatedAtDateRangeFilterProps = {
  createdFrom: string;
  createdTo: string;
  onChange: (next: { createdFrom: string; createdTo: string }) => void;
  compact?: boolean;
  disabled?: boolean;
  label?: string;
  fromAriaLabel?: string;
  toAriaLabel?: string;
};

export function CreatedAtDateRangeFilter({
  createdFrom,
  createdTo,
  onChange,
  compact = false,
  disabled = false,
  label = "ატვირთვის თარიღი",
  fromAriaLabel = "ატვირთვის თარიღი დან",
  toAriaLabel = "ატვირთვის თარიღი მდე",
}: CreatedAtDateRangeFilterProps) {
  const dateQuery = resolveCreatedDateQuery(createdFrom, createdTo);

  function handlePreset(preset: CreatedDatePreset) {
    onChange(createdDatePresetRange(preset));
  }

  return (
    <div className={compact ? "space-y-1.5" : "space-y-2"}>
      <span className="block text-xs font-medium text-muted-foreground">
        {label}
      </span>
      <div className="flex flex-wrap items-center gap-2">
        <input
          type="date"
          value={createdFrom}
          max={createdTo || undefined}
          disabled={disabled}
          onChange={(event) =>
            onChange({ createdFrom: event.target.value, createdTo })
          }
          aria-label={fromAriaLabel}
          className={DATE_INPUT_CLASS}
        />
        <span className="text-xs text-muted-foreground">—</span>
        <input
          type="date"
          value={createdTo}
          min={createdFrom || undefined}
          disabled={disabled}
          onChange={(event) =>
            onChange({ createdFrom, createdTo: event.target.value })
          }
          aria-label={toAriaLabel}
          className={DATE_INPUT_CLASS}
        />
      </div>
      <div className="flex flex-wrap gap-1">
        {PRESET_OPTIONS.map((preset) => (
          <button
            key={preset.value}
            type="button"
            disabled={disabled}
            onClick={() => handlePreset(preset.value)}
            className="rounded-full border border-border bg-card px-2 py-0.5 text-[11px] font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-60"
          >
            {preset.label}
          </button>
        ))}
      </div>
      {dateQuery.error ? (
        <p className="text-xs text-destructive" role="alert">
          {dateQuery.error}
        </p>
      ) : null}
    </div>
  );
}
