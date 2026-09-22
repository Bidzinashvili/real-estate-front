export const BALCONY_COUNT_VERIFICATION_KEY = "balconyCount";
export const MAX_SELECTED_BALCONY_COUNT = 5;
export const BALCONY_TO_VERIFY_LABEL = "გადასამოწმებელი";
export const BALCONY_NONE_LABEL = "აივანი არ აქვს";
export const BALCONY_VERANDA_LABEL = "ვერანდა";
export const BALCONY_TOTAL_AREA_PREFIX = "სულ";
export const BALCONY_TOTAL_AREA_SUFFIX = "კვ";
export const BALCONY_FIELD_LABEL = "აივანი";

export const DEFAULT_NEW_BALCONY_NEEDS_VERIFICATION: string[] = [
  BALCONY_COUNT_VERIFICATION_KEY,
];

export type ListingBalconySelection = {
  balconyCount: number | null;
  needsVerification: string[];
  balconyArea: string;
  veranda: boolean;
};

export function isBalconyCountToVerify(
  needsVerification: readonly string[] | null | undefined,
): boolean {
  return (needsVerification ?? []).includes(BALCONY_COUNT_VERIFICATION_KEY);
}

export function isBalconyUiToVerify(
  balconyCount: number | null | undefined,
  needsVerification: readonly string[] | null | undefined,
): boolean {
  if (isBalconyCountToVerify(needsVerification)) {
    return true;
  }
  return balconyCount === null || balconyCount === undefined;
}

export function clampBalconyCount(count: number): number {
  if (!Number.isFinite(count)) {
    return 0;
  }
  const wholeCount = Math.trunc(count);
  if (wholeCount < 0) {
    return 0;
  }
  if (wholeCount > MAX_SELECTED_BALCONY_COUNT) {
    return MAX_SELECTED_BALCONY_COUNT;
  }
  return wholeCount;
}

export function parseBalconyCount(value: unknown): number | null {
  if (value === null || value === undefined) {
    return null;
  }
  if (typeof value === "boolean") {
    return null;
  }
  if (typeof value === "number" && Number.isFinite(value)) {
    return clampBalconyCount(value);
  }
  if (typeof value === "string" && value.trim() !== "") {
    const parsedNumber = Number(value.trim());
    if (Number.isFinite(parsedNumber)) {
      return clampBalconyCount(parsedNumber);
    }
  }
  return null;
}

export function remapBalconyNeedsVerification(
  fields: readonly string[],
): string[] {
  const hasAreaKey = fields.includes("balconyArea");
  const hasCountKey = fields.includes(BALCONY_COUNT_VERIFICATION_KEY);
  const withoutAreaKey = fields.filter((fieldKey) => fieldKey !== "balconyArea");
  if (hasAreaKey && !hasCountKey) {
    return [...withoutAreaKey, BALCONY_COUNT_VERIFICATION_KEY];
  }
  return withoutAreaKey;
}

export function withoutBalconyCountVerification(
  needsVerification: readonly string[],
): string[] {
  return needsVerification.filter(
    (fieldKey) => fieldKey !== BALCONY_COUNT_VERIFICATION_KEY,
  );
}

export function withBalconyCountVerification(
  needsVerification: readonly string[],
): string[] {
  if (needsVerification.includes(BALCONY_COUNT_VERIFICATION_KEY)) {
    return [...needsVerification];
  }
  return [...needsVerification, BALCONY_COUNT_VERIFICATION_KEY];
}

export function formatBalconyCountControlLabel(count: number): string {
  if (count >= MAX_SELECTED_BALCONY_COUNT) {
    return "5+ აივანი";
  }
  return `${count} აივანი`;
}

export function formatBalconyCountDisplay(options: {
  balconyCount: number | null | undefined;
  needsVerification?: readonly string[] | null;
}): string {
  if (isBalconyUiToVerify(options.balconyCount, options.needsVerification)) {
    return BALCONY_TO_VERIFY_LABEL;
  }
  const balconyCount = options.balconyCount ?? 0;
  if (balconyCount <= 0) {
    return BALCONY_NONE_LABEL;
  }
  return formatBalconyCountControlLabel(balconyCount);
}

export function nextBalconyCountAfterIncrease(options: {
  balconyCount: number | null | undefined;
  needsVerification: readonly string[];
}): { balconyCount: number; needsVerification: string[] } {
  const nextNeedsVerification = withoutBalconyCountVerification(
    options.needsVerification,
  );
  if (isBalconyUiToVerify(options.balconyCount, options.needsVerification)) {
    return { balconyCount: 1, needsVerification: nextNeedsVerification };
  }
  return {
    balconyCount: clampBalconyCount((options.balconyCount ?? 0) + 1),
    needsVerification: nextNeedsVerification,
  };
}

export function nextBalconyCountAfterDecrease(options: {
  balconyCount: number | null | undefined;
  needsVerification: readonly string[];
}): { balconyCount: number; needsVerification: string[] } {
  const nextNeedsVerification = withoutBalconyCountVerification(
    options.needsVerification,
  );
  if (isBalconyUiToVerify(options.balconyCount, options.needsVerification)) {
    return { balconyCount: 0, needsVerification: nextNeedsVerification };
  }
  return {
    balconyCount: clampBalconyCount((options.balconyCount ?? 0) - 1),
    needsVerification: nextNeedsVerification,
  };
}

export function applyBalconyToVerify(
  needsVerification: readonly string[],
): string[] {
  return withBalconyCountVerification(needsVerification);
}

export function canDecreaseBalconyCount(
  balconyCount: number | null | undefined,
  needsVerification: readonly string[],
): boolean {
  return isBalconyUiToVerify(balconyCount, needsVerification) || (balconyCount ?? 0) > 0;
}

export function canIncreaseBalconyCount(
  balconyCount: number | null | undefined,
  needsVerification: readonly string[],
): boolean {
  if (isBalconyUiToVerify(balconyCount, needsVerification)) {
    return true;
  }
  return (balconyCount ?? 0) < MAX_SELECTED_BALCONY_COUNT;
}

export function listingBalconyCreateFields(input: {
  balconyCount: number | null | undefined;
  needsVerification: readonly string[];
  balconyArea?: number;
  veranda: boolean;
}): {
  balconyCount?: number;
  balconyArea?: number;
  veranda?: boolean;
} {
  const fields: {
    balconyCount?: number;
    balconyArea?: number;
    veranda?: boolean;
  } = {};

  if (!isBalconyUiToVerify(input.balconyCount, input.needsVerification)) {
    fields.balconyCount = clampBalconyCount(input.balconyCount ?? 0);
  }
  if (input.balconyArea !== undefined) {
    fields.balconyArea = input.balconyArea;
  }
  if (input.veranda) {
    fields.veranda = true;
  }

  return fields;
}

export function balconyAreaDraftValue(value: number | null | undefined): string {
  if (value === null || value === undefined) {
    return "";
  }
  return String(value);
}

export function parseBalconyAreaDraft(rawValue: string): number | null | undefined {
  const trimmedValue = rawValue.trim();
  if (trimmedValue === "") {
    return null;
  }
  const parsedNumber = Number(trimmedValue);
  if (!Number.isFinite(parsedNumber)) {
    return undefined;
  }
  return parsedNumber;
}

export function omitBalconyCountIfToVerify<
  T extends { balconyCount?: number | null },
>(patch: T, currentNeedsVerification: readonly string[]): T {
  if (!isBalconyCountToVerify(currentNeedsVerification)) {
    return patch;
  }
  if (!Object.prototype.hasOwnProperty.call(patch, "balconyCount")) {
    return patch;
  }
  const sanitizedPatch = { ...patch };
  delete sanitizedPatch.balconyCount;
  return sanitizedPatch;
}
