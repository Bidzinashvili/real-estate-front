import { APARTMENT_PROJECT_FIELD_LABEL } from "@/shared/i18n/enumLabels";

export const INTERNAL_NON_STANDARD_PROJECT = "Non-standard";

const NON_STANDARD_PROJECT_KEYS = new Set([
  "non-standard",
  "nonstandard",
  "non_standard",
  "არასტანდარტული",
]);

function projectLookupKey(value: string): string {
  return value
    .trim()
    .replace(/^#+/, "")
    .toLowerCase()
    .replace(/[\s-]+/g, "_");
}

export function isNonStandardProject(value: string): boolean {
  return NON_STANDARD_PROJECT_KEYS.has(projectLookupKey(value));
}

export function toStoredProjectName(value: string, currentStored?: string): string {
  const trimmedName = value.trim().replace(/^#+/, "");
  if (trimmedName === "") {
    return "";
  }
  if (isNonStandardProject(trimmedName)) {
    const currentName = currentStored?.trim() ?? "";
    if (currentName !== "" && isNonStandardProject(currentName)) {
      return currentName.replace(/^#+/, "");
    }
    return INTERNAL_NON_STANDARD_PROJECT;
  }
  return trimmedName;
}

export function formatProjectDisplayName(value: string | null | undefined): string {
  if (value === null || value === undefined) {
    return "";
  }
  const trimmedName = value.trim().replace(/^#+/, "");
  if (trimmedName === "") {
    return "";
  }
  if (isNonStandardProject(trimmedName)) {
    return APARTMENT_PROJECT_FIELD_LABEL;
  }
  return trimmedName;
}

export function formatProjectHashtag(value: string | null | undefined): string {
  const displayName = formatProjectDisplayName(value);
  return displayName === "" ? "" : `#${displayName}`;
}
