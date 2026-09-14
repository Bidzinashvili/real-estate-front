"use client";

import { NOTE_LAST_OPENED_COPY } from "@/features/noteLastOpened/noteLastOpenedCopy";

type NeverOpenedFilterProps = {
  checked: boolean;
  onChange: (nextChecked: boolean) => void;
};

export function NeverOpenedFilter({
  checked,
  onChange,
}: NeverOpenedFilterProps) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm text-foreground">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
      />
      {NOTE_LAST_OPENED_COPY.neverOpenedFilter}
    </label>
  );
}
