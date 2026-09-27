"use client";

import { useId, useMemo } from "react";
import { useDistricts } from "@/features/districts/useDistricts";
import {
  excludeDistrictGroups,
  groupNeighborhoodsForSelection,
  toggleSelectedNeighborhood,
  type NeighborhoodSelectionMode,
} from "@/features/districts/neighborhoodGroups";
import { cn } from "@/shared/lib/utils";

const EMPTY_EXCLUDED_GROUP_NAMES: ReadonlyArray<string> = [];

type NeighborhoodChecklistProps = {
  selectedNeighborhoods: readonly string[];
  onChange: (nextNeighborhoods: string[]) => void;
  selectionMode?: NeighborhoodSelectionMode;
  disabled?: boolean;
  compact?: boolean;
  excludeGroupNames?: ReadonlyArray<string>;
};

function neighborhoodItemClassName(args: {
  isSelected: boolean;
  isCompact: boolean;
}): string {
  return cn(
    "flex cursor-pointer items-center gap-2 rounded-lg border text-foreground",
    args.isCompact ? "px-2.5 py-1.5 text-xs" : "px-3 py-2 text-sm",
    args.isSelected
      ? "border-primary bg-primary/10"
      : "border-border bg-card hover:border-primary/40 hover:bg-accent",
  );
}

function NeighborhoodCheckboxGroup({
  title,
  neighborhoodNames,
  selectedNameSet,
  onToggle,
  disabled,
  compact,
  groupId,
  scrollable,
}: {
  title: string;
  neighborhoodNames: readonly string[];
  selectedNameSet: Set<string>;
  onToggle: (neighborhoodName: string, isSelected: boolean) => void;
  disabled: boolean;
  compact: boolean;
  groupId: string;
  scrollable?: boolean;
}) {
  if (neighborhoodNames.length === 0) {
    return null;
  }

  const headingId = `${groupId}-heading`;

  return (
    <div className="space-y-2">
      <p id={headingId} className="text-xs font-medium text-muted-foreground">
        {title}
      </p>
      <div
        role="group"
        aria-labelledby={headingId}
        className={cn(
          "grid grid-cols-1 gap-2 sm:grid-cols-2",
          scrollable && "max-h-64 overflow-y-auto pr-1",
        )}
      >
        {neighborhoodNames.map((neighborhoodName, neighborhoodIndex) => {
          const isSelected = selectedNameSet.has(neighborhoodName);
          const optionId = `${groupId}-${neighborhoodIndex}`;

          return (
            <label
              key={neighborhoodName}
              htmlFor={optionId}
              className={neighborhoodItemClassName({
                isSelected,
                isCompact: compact,
              })}
            >
              <input
                id={optionId}
                type="checkbox"
                checked={isSelected}
                disabled={disabled}
                onChange={(event) => {
                  onToggle(neighborhoodName, event.target.checked);
                }}
                className="h-4 w-4 shrink-0 rounded border-border text-foreground"
              />
              <span>{neighborhoodName}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}

export function NeighborhoodChecklist({
  selectedNeighborhoods,
  onChange,
  selectionMode = "multiple",
  disabled = false,
  compact = false,
  excludeGroupNames = EMPTY_EXCLUDED_GROUP_NAMES,
}: NeighborhoodChecklistProps) {
  const generatedId = useId();
  const { districts, isLoading, error: loadError, retry } = useDistricts();
  const excludedGroupNameSet = useMemo(
    () => new Set(excludeGroupNames),
    [excludeGroupNames],
  );
  const availableDistricts = useMemo(
    () => excludeDistrictGroups(districts ?? [], excludedGroupNameSet),
    [districts, excludedGroupNameSet],
  );
  const groupedNeighborhoods = useMemo(
    () => groupNeighborhoodsForSelection(availableDistricts, selectedNeighborhoods),
    [availableDistricts, selectedNeighborhoods],
  );
  const selectedNameSet = useMemo(
    () => new Set(selectedNeighborhoods.map((neighborhoodName) => neighborhoodName.trim())),
    [selectedNeighborhoods],
  );

  const handleToggle = (neighborhoodName: string, isSelected: boolean) => {
    onChange(
      toggleSelectedNeighborhood(
        selectedNeighborhoods,
        neighborhoodName,
        isSelected,
        selectionMode,
      ),
    );
  };

  if (loadError) {
    return (
      <div className="rounded-lg border border-red-200 bg-destructive/10 px-3 py-2 text-sm text-destructive">
        <p>უბნების ჩატვირთვა ვერ მოხერხდა.</p>
        <button
          type="button"
          onClick={retry}
          className="mt-2 inline-flex items-center rounded-full border border-red-200 bg-card px-3 py-1.5 text-sm font-medium text-destructive transition hover:bg-destructive/15"
        >
          ხელახლა
        </button>
      </div>
    );
  }

  if (isLoading && districts === null) {
    return <p className="text-sm text-muted-foreground">იტვირთება...</p>;
  }

  if (availableDistricts.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-muted px-3 py-2 text-sm text-muted-foreground">
        <p>უბნები არ არის.</p>
        <button
          type="button"
          onClick={retry}
          className="mt-2 inline-flex items-center rounded-full border border-border bg-card px-3 py-1.5 text-sm font-medium text-foreground transition hover:bg-muted"
        >
          ხელახლა
        </button>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", compact && "max-h-72 overflow-y-auto pr-1")}>
      <NeighborhoodCheckboxGroup
        title="მთავარი უბნები"
        neighborhoodNames={groupedNeighborhoods.mainNeighborhoods}
        selectedNameSet={selectedNameSet}
        onToggle={handleToggle}
        disabled={disabled}
        compact={compact}
        groupId={`${generatedId}-main`}
      />
      <NeighborhoodCheckboxGroup
        title="სხვა უბნები"
        neighborhoodNames={groupedNeighborhoods.otherNeighborhoods}
        selectedNameSet={selectedNameSet}
        onToggle={handleToggle}
        disabled={disabled}
        compact={compact}
        groupId={`${generatedId}-other`}
        scrollable={!compact}
      />
      <NeighborhoodCheckboxGroup
        title="არჩეული (სიაში არ არის)"
        neighborhoodNames={groupedNeighborhoods.unknownSelectedNeighborhoods}
        selectedNameSet={selectedNameSet}
        onToggle={handleToggle}
        disabled={disabled}
        compact={compact}
        groupId={`${generatedId}-unknown`}
      />
    </div>
  );
}
