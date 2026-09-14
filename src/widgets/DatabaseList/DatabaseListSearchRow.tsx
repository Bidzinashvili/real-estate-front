"use client";

import type { RecordColor } from "@/features/recordColor/recordColor";
import { DatabaseListSearchInput } from "@/widgets/DatabaseList/DatabaseListSearchInput";
import { RecordColorSearchChips } from "@/widgets/RecordColor/RecordColorSearchChips";

type DatabaseListSearchRowProps = {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder: string;
  searchClearAriaLabel: string;
  selectedColors: RecordColor[];
  onSelectedColorsChange: (colors: RecordColor[]) => void;
};

export function DatabaseListSearchRow({
  searchValue,
  onSearchChange,
  searchPlaceholder,
  searchClearAriaLabel,
  selectedColors,
  onSelectedColorsChange,
}: DatabaseListSearchRowProps) {
  return (
    <div className="flex w-full flex-wrap items-center gap-2">
      <div className="min-w-[min(100%,16rem)] flex-1">
        <DatabaseListSearchInput
          value={searchValue}
          onChange={onSearchChange}
          placeholder={searchPlaceholder}
          clearAriaLabel={searchClearAriaLabel}
        />
      </div>
      <RecordColorSearchChips
        selectedColors={selectedColors}
        onChange={onSelectedColorsChange}
      />
    </div>
  );
}
