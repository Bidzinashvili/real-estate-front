"use client";

import { useId, useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import { useDistricts } from "@/features/districts/useDistricts";
import {
  findUnknownSelectedNeighborhoods,
  toggleSelectedNeighborhood,
  type NeighborhoodSelectionMode,
} from "@/features/districts/neighborhoodGroups";
import type { TbilisiNeighborhoodSection } from "@/features/districts/districtTypes";
import { MultiOptionChips, type OptionChipItem } from "@/shared/ui/OptionChips";
import { cn } from "@/shared/lib/utils";

type TbilisiNeighborhoodSectionsProps = {
  selectedNeighborhoods: readonly string[];
  onChange: (nextNeighborhoods: string[]) => void;
  selectionMode?: NeighborhoodSelectionMode;
  disabled?: boolean;
  compact?: boolean;
};

const UNKNOWN_SECTION_KEY = "unknown";

function toChipOptions(neighborhoodNames: readonly string[]): OptionChipItem[] {
  return neighborhoodNames.map((neighborhoodName) => ({
    value: neighborhoodName,
    label: neighborhoodName,
  }));
}

function CollapsibleSection({
  sectionId,
  title,
  neighborhoodNames,
  selectedNeighborhoods,
  isOpen,
  onToggleOpen,
  onToggleNeighborhood,
  disabled,
  compact,
}: {
  sectionId: string;
  title: string;
  neighborhoodNames: readonly string[];
  selectedNeighborhoods: readonly string[];
  isOpen: boolean;
  onToggleOpen: () => void;
  onToggleNeighborhood: (neighborhoodName: string, isSelected: boolean) => void;
  disabled: boolean;
  compact: boolean;
}) {
  const nameSet = new Set(neighborhoodNames);
  const selectedInSection = selectedNeighborhoods.filter((name) => nameSet.has(name));
  const panelId = `${sectionId}-panel`;

  return (
    <div className="rounded-lg border border-border bg-card">
      <button
        type="button"
        onClick={onToggleOpen}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className={cn(
          "flex w-full items-center justify-between gap-2 rounded-lg text-left font-medium text-foreground hover:bg-muted",
          compact ? "px-2.5 py-1.5 text-xs" : "px-3 py-2 text-sm",
        )}
      >
        <span>
          {title}
          {selectedInSection.length > 0 ? (
            <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
              {selectedInSection.length}
            </span>
          ) : null}
        </span>
        <ChevronDown
          className={cn("h-4 w-4 shrink-0 transition-transform", isOpen && "rotate-180")}
          aria-hidden
        />
      </button>
      {isOpen ? (
        <div id={panelId} className={cn("border-t border-border", compact ? "p-2" : "p-3")}>
          <MultiOptionChips
            aria-label={title}
            value={selectedInSection}
            onChange={(nextSelectedInSection) => {
              const added = nextSelectedInSection.find(
                (name) => !selectedInSection.includes(name),
              );
              if (added !== undefined) {
                onToggleNeighborhood(added, true);
                return;
              }
              const removed = selectedInSection.find(
                (name) => !nextSelectedInSection.includes(name),
              );
              if (removed !== undefined) {
                onToggleNeighborhood(removed, false);
              }
            }}
            options={toChipOptions(neighborhoodNames)}
            disabled={disabled}
            size={compact ? "compact" : "default"}
          />
        </div>
      ) : null}
    </div>
  );
}

/**
 * Tbilisi neighborhood picker: three expandable categories in fixed order
 * (მთავარი / დანარჩენი / შემოგარენი) served by GET /districts. Values that are
 * not in the catalog (legacy records) appear in an extra section so they stay removable.
 */
export function TbilisiNeighborhoodSections({
  selectedNeighborhoods,
  onChange,
  selectionMode = "multiple",
  disabled = false,
  compact = false,
}: TbilisiNeighborhoodSectionsProps) {
  const generatedId = useId();
  const { districts, isLoading, error: loadError, retry } = useDistricts();
  const [openOverrides, setOpenOverrides] = useState<Record<string, boolean>>({});

  const sections: TbilisiNeighborhoodSection[] = useMemo(
    () => districts?.sections ?? [],
    [districts],
  );
  const trimmedSelected = useMemo(
    () =>
      selectedNeighborhoods
        .map((neighborhoodName) => neighborhoodName.trim())
        .filter((neighborhoodName) => neighborhoodName !== ""),
    [selectedNeighborhoods],
  );
  const unknownSelected = useMemo(
    () => findUnknownSelectedNeighborhoods(sections, trimmedSelected),
    [sections, trimmedSelected],
  );

  const handleToggleNeighborhood = (neighborhoodName: string, isSelected: boolean) => {
    onChange(
      toggleSelectedNeighborhood(trimmedSelected, neighborhoodName, isSelected, selectionMode),
    );
  };

  const isSectionOpen = (key: string, neighborhoodNames: readonly string[]) => {
    const override = openOverrides[key];
    if (override !== undefined) {
      return override;
    }
    return key === "main" || neighborhoodNames.some((name) => trimmedSelected.includes(name));
  };

  const toggleSectionOpen = (key: string, neighborhoodNames: readonly string[]) => {
    const currentlyOpen = isSectionOpen(key, neighborhoodNames);
    setOpenOverrides((previous) => ({ ...previous, [key]: !currentlyOpen }));
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

  if (sections.length === 0) {
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
    <div className="space-y-2">
      {sections.map((section) => (
        <CollapsibleSection
          key={section.key}
          sectionId={`${generatedId}-${section.key}`}
          title={section.title}
          neighborhoodNames={section.neighborhoods}
          selectedNeighborhoods={trimmedSelected}
          isOpen={isSectionOpen(section.key, section.neighborhoods)}
          onToggleOpen={() => toggleSectionOpen(section.key, section.neighborhoods)}
          onToggleNeighborhood={handleToggleNeighborhood}
          disabled={disabled}
          compact={compact}
        />
      ))}
      {unknownSelected.length > 0 ? (
        <CollapsibleSection
          sectionId={`${generatedId}-${UNKNOWN_SECTION_KEY}`}
          title="არჩეული (სიაში არ არის)"
          neighborhoodNames={unknownSelected}
          selectedNeighborhoods={trimmedSelected}
          isOpen={isSectionOpen(UNKNOWN_SECTION_KEY, unknownSelected)}
          onToggleOpen={() => toggleSectionOpen(UNKNOWN_SECTION_KEY, unknownSelected)}
          onToggleNeighborhood={handleToggleNeighborhood}
          disabled={disabled}
          compact={compact}
        />
      ) : null}
    </div>
  );
}
