import type { ClientPreferenceValue } from "@/features/matching/matchingEnums";

/** Form-level pet choice. "" means nothing chosen (e.g. legacy TO_VERIFY / NOT_SET records). */
export const PET_KIND_FORM_VALUES = ["", "NONE", "DOG", "CAT", "OTHER"] as const;

export type PetKindFormValue = (typeof PET_KIND_FORM_VALUES)[number];

export const PET_DESCRIPTION_PREFIX = "შინაური ცხოველი:";

export const PET_KIND_LABELS: Record<Exclude<PetKindFormValue, "">, string> = {
  NONE: "არა",
  DOG: "ძაღლი",
  CAT: "კატა",
  OTHER: "სხვა",
};

/** Maps the chosen pet kind to the backend pet preference (YES / NO). */
export function petKindToPreference(kind: Exclude<PetKindFormValue, "">): ClientPreferenceValue {
  return kind === "NONE" ? "NO" : "YES";
}

/** Derives the chip selection from a stored pet preference. YES alone does not say which pet. */
export function petKindFromPreference(value: ClientPreferenceValue | undefined): PetKindFormValue {
  return value === "NO" ? "NONE" : "";
}

function petDescriptionLine(kind: PetKindFormValue, otherText: string): string | null {
  if (kind === "" || kind === "NONE") {
    return null;
  }
  if (kind === "OTHER") {
    const trimmed = otherText.trim();
    return `${PET_DESCRIPTION_PREFIX} ${trimmed === "" ? PET_KIND_LABELS.OTHER : trimmed}`;
  }
  return `${PET_DESCRIPTION_PREFIX} ${PET_KIND_LABELS[kind]}`;
}

/**
 * Writes the pet choice into the free-text description, replacing any earlier pet line.
 * When the kind is unknown ("") the description is returned unchanged.
 */
export function descriptionWithPet(
  description: string,
  kind: PetKindFormValue,
  otherText: string,
): string {
  if (kind === "") {
    return description;
  }
  const keptLines = description
    .split("\n")
    .filter((line) => !line.trim().startsWith(PET_DESCRIPTION_PREFIX));
  const base = keptLines.join("\n").trim();
  const line = petDescriptionLine(kind, otherText);
  if (line === null) {
    return base;
  }
  return base === "" ? line : `${base}\n${line}`;
}
