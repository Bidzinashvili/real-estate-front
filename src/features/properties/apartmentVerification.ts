import type { ApartmentVerifiableField } from "@/features/matching/matchingEnums";
import {
  APARTMENT_VERIFIABLE_FIELDS,
  isApartmentVerifiableField,
} from "@/features/matching/matchingEnums";

export type VerifiableBooleanUiState = "unknown" | "toBeVerified" | "yes" | "no";

const APARTMENT_BOOLEAN_VERIFIABLE_FIELDS = [
  "elevator",
  "centralHeating",
  "airConditioner",
  "furnished",
  "petsAllowed",
  "goodView",
] as const satisfies readonly ApartmentVerifiableField[];

export type ApartmentBooleanVerifiableField =
  (typeof APARTMENT_BOOLEAN_VERIFIABLE_FIELDS)[number];

export function sanitizeNeedsVerification(
  fields: string[] | undefined,
): ApartmentVerifiableField[] {
  if (!fields) {
    return [];
  }
  return fields.filter(isApartmentVerifiableField);
}

export function booleanUiStateFromApartment(
  value: boolean | null | undefined,
  needsVerification: string[],
  fieldKey: ApartmentBooleanVerifiableField,
): VerifiableBooleanUiState {
  if (needsVerification.includes(fieldKey)) {
    return "toBeVerified";
  }
  if (value === true) {
    return "yes";
  }
  if (value === false) {
    return "no";
  }
  return "unknown";
}

export function applyBooleanUiState(
  currentNeedsVerification: string[],
  fieldKey: ApartmentBooleanVerifiableField,
  nextState: VerifiableBooleanUiState,
): { value: boolean | null; needsVerification: string[] } {
  const withoutKey = currentNeedsVerification.filter(
    (activeField) => activeField !== fieldKey,
  );
  if (nextState === "yes") {
    return { value: true, needsVerification: withoutKey };
  }
  if (nextState === "no") {
    return { value: false, needsVerification: withoutKey };
  }
  if (nextState === "toBeVerified") {
    return {
      value: null,
      needsVerification: [...withoutKey, fieldKey],
    };
  }
  return { value: null, needsVerification: withoutKey };
}

export function omitUnspecifiedBoolean(value: boolean | null | undefined): boolean | undefined {
  if (value === true || value === false) {
    return value;
  }
  return undefined;
}

export function buildCreateNeedsVerification(
  explicitFields: string[] | undefined,
): ApartmentVerifiableField[] | undefined {
  const sanitized = sanitizeNeedsVerification(explicitFields);
  return sanitized.length > 0 ? sanitized : undefined;
}

function sameStringList(left: string[], right: string[]): boolean {
  if (left.length !== right.length) {
    return false;
  }
  const sortedLeft = [...left].sort();
  const sortedRight = [...right].sort();
  return sortedLeft.every((item, index) => item === sortedRight[index]);
}

export function buildPatchNeedsVerification(options: {
  initialNeedsVerification: string[];
  currentNeedsVerification: string[];
  verifiedKeysInPatch: string[];
}): string[] | undefined {
  const currentSanitized = sanitizeNeedsVerification(options.currentNeedsVerification);
  const withoutVerified = currentSanitized.filter(
    (fieldKey) => !options.verifiedKeysInPatch.includes(fieldKey),
  );
  const initialSanitized = sanitizeNeedsVerification(options.initialNeedsVerification);
  const expectedAfterVerifiedValues = initialSanitized.filter(
    (fieldKey) => !options.verifiedKeysInPatch.includes(fieldKey),
  );

  if (sameStringList(withoutVerified, expectedAfterVerifiedValues)) {
    return undefined;
  }

  return withoutVerified;
}

export { APARTMENT_VERIFIABLE_FIELDS, APARTMENT_BOOLEAN_VERIFIABLE_FIELDS };
