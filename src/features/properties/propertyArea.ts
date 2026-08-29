export const CANONICAL_AREA_MISSING_LABEL = "ფართობი არ არის მითითებული";

export function positiveAreaOrNull(
  value: number | null | undefined,
): number | null {
  if (value === null || value === undefined) {
    return null;
  }
  if (!Number.isFinite(value) || value <= 0) {
    return null;
  }
  return value;
}

export function hydratePositiveArea(
  value: number | null | undefined,
): number | undefined {
  const area = positiveAreaOrNull(value);
  return area === null ? undefined : area;
}

export function formatAreaSquareMeters(
  value: number | null | undefined,
): string | null {
  const area = positiveAreaOrNull(value);
  if (area === null) {
    return null;
  }
  return `${area} მ²`;
}

export function canonicalPropertyArea(property: {
  apartment?: { totalArea?: number | null } | null;
  privateHouse?: { totalArea?: number | null } | null;
  landPlot?: { landArea?: number | null } | null;
  commercial?: { area?: number | null } | null;
}): number | null {
  if (property.apartment) {
    return positiveAreaOrNull(property.apartment.totalArea);
  }
  if (property.privateHouse) {
    return positiveAreaOrNull(property.privateHouse.totalArea);
  }
  if (property.landPlot) {
    return positiveAreaOrNull(property.landPlot.landArea);
  }
  if (property.commercial) {
    return positiveAreaOrNull(property.commercial.area);
  }
  return null;
}

export function nextPrivateHouseTotalArea(
  houseArea: number | undefined,
  yardArea: number | undefined,
): number | undefined {
  const combinedArea = (houseArea ?? 0) + (yardArea ?? 0);
  return combinedArea > 0 ? combinedArea : undefined;
}
