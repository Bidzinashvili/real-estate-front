import {
  DEFAULT_LISTING_PARKING,
  isListingParking,
  isListingParkingType,
  type ListingParking,
  type ListingParkingType,
} from "@/features/properties/propertyModelTypes";
import {
  LISTING_PARKING_LABELS,
  LISTING_PARKING_TYPE_LABELS,
} from "@/shared/i18n/enumLabels";

export type ListingParkingSelection = {
  parking: ListingParking;
  parkingTypes: ListingParkingType[];
};

export const LISTING_PARKING_OPTIONS: ReadonlyArray<{
  value: ListingParking;
  label: string;
}> = [
  { value: "NO", label: LISTING_PARKING_LABELS.NO },
  { value: "YES", label: LISTING_PARKING_LABELS.YES },
  { value: "TO_VERIFY", label: LISTING_PARKING_LABELS.TO_VERIFY },
];

export const LISTING_PARKING_TYPE_OPTIONS: ReadonlyArray<{
  value: ListingParkingType;
  label: string;
}> = [
  { value: "SHARED_YARD", label: LISTING_PARKING_TYPE_LABELS.SHARED_YARD },
  { value: "PRIVATE_YARD", label: LISTING_PARKING_TYPE_LABELS.PRIVATE_YARD },
  { value: "UNDERGROUND", label: LISTING_PARKING_TYPE_LABELS.UNDERGROUND },
  { value: "GARAGE", label: LISTING_PARKING_TYPE_LABELS.GARAGE },
];

export function parseListingParking(value: unknown): ListingParking {
  const stringCandidate = typeof value === "string" ? value.trim() : "";
  return isListingParking(stringCandidate) ? stringCandidate : DEFAULT_LISTING_PARKING;
}

export function parseListingParkingTypes(value: unknown): ListingParkingType[] {
  if (!Array.isArray(value)) {
    return [];
  }

  const uniqueTypes: ListingParkingType[] = [];
  const seenTypes = new Set<ListingParkingType>();

  for (const item of value) {
    const stringCandidate = typeof item === "string" ? item.trim() : "";
    if (!isListingParkingType(stringCandidate) || seenTypes.has(stringCandidate)) {
      continue;
    }
    seenTypes.add(stringCandidate);
    uniqueTypes.push(stringCandidate);
  }

  return uniqueTypes;
}

export function parkingTypesForParking(
  parking: ListingParking,
  parkingTypes: readonly ListingParkingType[],
): ListingParkingType[] {
  if (parking !== "YES") {
    return [];
  }
  return parseListingParkingTypes([...parkingTypes]);
}

export function parseListingParkingSelection(input: {
  parking: unknown;
  parkingTypes: unknown;
}): ListingParkingSelection {
  const parking = parseListingParking(input.parking);
  return {
    parking,
    parkingTypes: parkingTypesForParking(parking, parseListingParkingTypes(input.parkingTypes)),
  };
}

export function nextListingParkingSelection(
  nextParking: ListingParking,
  currentParkingTypes: readonly ListingParkingType[],
): ListingParkingSelection {
  return {
    parking: nextParking,
    parkingTypes: parkingTypesForParking(nextParking, currentParkingTypes),
  };
}

export function listingParkingWriteFields(
  parking: ListingParking,
  parkingTypes: readonly ListingParkingType[],
): ListingParkingSelection | { parking: ListingParking } {
  if (parking === "YES") {
    return {
      parking,
      parkingTypes: parkingTypesForParking(parking, parkingTypes),
    };
  }
  return { parking };
}

export function omitParkingTypesUnlessYes<
  T extends { parking?: ListingParking; parkingTypes?: ListingParkingType[] },
>(patch: T, resolvedParking: ListingParking | undefined): T {
  if (resolvedParking === "YES" || patch.parkingTypes === undefined) {
    return patch;
  }

  const sanitizedPatch = { ...patch };
  delete sanitizedPatch.parkingTypes;
  return sanitizedPatch;
}

export function sanitizeListingParkingPatch<
  T extends { parking?: ListingParking; parkingTypes?: ListingParkingType[] },
>(
  patch: T | undefined,
  resolvedParking: ListingParking | undefined,
): T | undefined {
  if (!patch) {
    return undefined;
  }
  const sanitizedPatch = omitParkingTypesUnlessYes(patch, resolvedParking);
  return Object.keys(sanitizedPatch).length > 0 ? sanitizedPatch : undefined;
}

export function formatListingParkingLabel(
  parking: ListingParking | null | undefined,
): string | null {
  if (parking === null || parking === undefined) {
    return null;
  }
  return LISTING_PARKING_LABELS[parking];
}

export function formatListingParkingTypesLabel(
  parkingTypes: readonly ListingParkingType[],
): string | null {
  if (parkingTypes.length === 0) {
    return null;
  }
  return parkingTypes
    .map((parkingType) => LISTING_PARKING_TYPE_LABELS[parkingType])
    .join(", ");
}

export function formatListingParkingDisplay(
  parking: ListingParking,
  parkingTypes: readonly ListingParkingType[],
): string {
  const parkingLabel = LISTING_PARKING_LABELS[parking];
  if (parking !== "YES") {
    return parkingLabel;
  }
  const typesLabel = formatListingParkingTypesLabel(parkingTypes);
  if (!typesLabel) {
    return parkingLabel;
  }
  return `${parkingLabel} · ${typesLabel}`;
}

export function parseListingParkingFilterValue(raw: string): ListingParking | "" {
  if (raw === "") {
    return "";
  }
  return isListingParking(raw) ? raw : "";
}
