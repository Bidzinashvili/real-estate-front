"use client";

import type { NeighborhoodSelectionMode } from "@/features/districts/neighborhoodGroups";
import { TbilisiNeighborhoodSections } from "@/widgets/Districts/TbilisiNeighborhoodSections";

type NeighborhoodChecklistProps = {
  selectedNeighborhoods: readonly string[];
  onChange: (nextNeighborhoods: string[]) => void;
  selectionMode?: NeighborhoodSelectionMode;
  disabled?: boolean;
  compact?: boolean;
};

/** Client-side Tbilisi neighborhood selection (multi by default). */
export function NeighborhoodChecklist({
  selectedNeighborhoods,
  onChange,
  selectionMode = "multiple",
  disabled = false,
  compact = false,
}: NeighborhoodChecklistProps) {
  return (
    <TbilisiNeighborhoodSections
      selectedNeighborhoods={selectedNeighborhoods}
      onChange={onChange}
      selectionMode={selectionMode}
      disabled={disabled}
      compact={compact}
    />
  );
}
