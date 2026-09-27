import type { DistrictGroup } from "@/features/districts/districtTypes";

export const MAIN_NEIGHBORHOOD_NAMES = [
  "ვაკე",
  "საბურთალო",
  "ვერა",
  "ბაგები",
  "მთაწმინდა",
  "სოლოლაკი",
  "ავლაბარი",
  "დიდუბე",
  "ჩუღურეთი",
  "ისანი",
  "გლდანი",
  "ნაძალადევი",
  "ვარკეთილი",
  "სამგორი",
  "დიდი დიღომი",
  "თემქა",
  "ლისი",
  "კრწანისი",
] as const;

const MAIN_NEIGHBORHOOD_NAME_SET = new Set<string>(MAIN_NEIGHBORHOOD_NAMES);

export type NeighborhoodSelectionMode = "multiple" | "single";

export type NeighborhoodOptionGroups = {
  mainNeighborhoods: string[];
  otherNeighborhoods: string[];
  unknownSelectedNeighborhoods: string[];
};

export function excludeDistrictGroups(
  districtGroups: DistrictGroup[],
  excludedGroupNames: ReadonlySet<string>,
): DistrictGroup[] {
  if (excludedGroupNames.size === 0) {
    return districtGroups;
  }
  return districtGroups.filter(
    (districtGroup) => !excludedGroupNames.has(districtGroup.name),
  );
}

export function collectNeighborhoodNames(districtGroups: DistrictGroup[]): string[] {
  const seenNames = new Set<string>();
  const neighborhoodNames: string[] = [];

  for (const districtGroup of districtGroups) {
    for (const neighborhoodName of districtGroup.neighborhoods) {
      const trimmedName = neighborhoodName.trim();
      if (trimmedName === "" || seenNames.has(trimmedName)) {
        continue;
      }
      seenNames.add(trimmedName);
      neighborhoodNames.push(trimmedName);
    }
  }

  return neighborhoodNames;
}

export function groupNeighborhoodsForSelection(
  districtGroups: DistrictGroup[],
  selectedNeighborhoods: readonly string[],
): NeighborhoodOptionGroups {
  const catalogNames = collectNeighborhoodNames(districtGroups);
  const catalogNameSet = new Set(catalogNames);

  const mainNeighborhoods = MAIN_NEIGHBORHOOD_NAMES.filter((neighborhoodName) =>
    catalogNameSet.has(neighborhoodName),
  );
  const otherNeighborhoods = catalogNames.filter(
    (neighborhoodName) => !MAIN_NEIGHBORHOOD_NAME_SET.has(neighborhoodName),
  );

  const knownNameSet = new Set([...mainNeighborhoods, ...otherNeighborhoods]);
  const unknownSelectedNeighborhoods: string[] = [];
  const seenUnknownNames = new Set<string>();

  for (const selectedName of selectedNeighborhoods) {
    const trimmedName = selectedName.trim();
    if (
      trimmedName === "" ||
      knownNameSet.has(trimmedName) ||
      seenUnknownNames.has(trimmedName)
    ) {
      continue;
    }
    seenUnknownNames.add(trimmedName);
    unknownSelectedNeighborhoods.push(trimmedName);
  }

  return {
    mainNeighborhoods,
    otherNeighborhoods,
    unknownSelectedNeighborhoods,
  };
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
