import type { TbilisiNeighborhoodSection } from "@/features/districts/districtTypes";

export type NeighborhoodSelectionMode = "multiple" | "single";

/** Selected values that are not in the current catalog (legacy records). */
export function findUnknownSelectedNeighborhoods(
  sections: readonly TbilisiNeighborhoodSection[],
  selectedNeighborhoods: readonly string[],
): string[] {
  const knownNames = new Set(sections.flatMap((section) => section.neighborhoods));
  const unknownNames: string[] = [];
  for (const selectedName of selectedNeighborhoods) {
    const trimmedName = selectedName.trim();
    if (trimmedName === "" || knownNames.has(trimmedName) || unknownNames.includes(trimmedName)) {
      continue;
    }
    unknownNames.push(trimmedName);
  }
  return unknownNames;
}

export function toggleSelectedNeighborhood(
  selectedNeighborhoods: readonly string[],
  neighborhoodName: string,
  isSelected: boolean,
  selectionMode: NeighborhoodSelectionMode,
): string[] {
  if (selectionMode === "single") {
    return isSelected ? [neighborhoodName] : [];
  }

  if (isSelected) {
    if (selectedNeighborhoods.includes(neighborhoodName)) {
      return [...selectedNeighborhoods];
    }
    return [...selectedNeighborhoods, neighborhoodName];
  }

  return selectedNeighborhoods.filter(
    (currentName) => currentName !== neighborhoodName,
  );
}
