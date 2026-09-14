import {
  isRecordColor,
  RECORD_COLORS,
  type RecordColor,
} from "@/features/recordColor/recordColor";

export function normalizeRecordColors(
  colors: readonly RecordColor[] | undefined,
): RecordColor[] {
  if (!colors || colors.length === 0) {
    return [];
  }
  const selectedSet = new Set(colors);
  return RECORD_COLORS.filter((recordColor) => selectedSet.has(recordColor));
}

export function parseRecordColorsFromSearchParams(
  searchParams: URLSearchParams,
): RecordColor[] {
  const selectedSet = new Set<RecordColor>();
  for (const rawValue of searchParams.getAll("color")) {
    const pieces = rawValue.split(",");
    for (const piece of pieces) {
      const trimmedValue = piece.trim();
      if (isRecordColor(trimmedValue)) {
        selectedSet.add(trimmedValue);
      }
    }
  }
  return RECORD_COLORS.filter((recordColor) => selectedSet.has(recordColor));
}

export function appendRecordColorsToSearchParams(
  searchParams: URLSearchParams,
  colors: readonly RecordColor[] | undefined,
): void {
  for (const color of normalizeRecordColors(colors)) {
    searchParams.append("color", color);
  }
}

export function toggleSelectedRecordColor(
  selectedColors: readonly RecordColor[],
  color: RecordColor,
): RecordColor[] {
  const selectedSet = new Set(selectedColors);
  if (selectedSet.has(color)) {
    selectedSet.delete(color);
  } else {
    selectedSet.add(color);
  }
  return RECORD_COLORS.filter((recordColor) => selectedSet.has(recordColor));
}
