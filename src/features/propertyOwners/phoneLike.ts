const phoneLikePattern = /^\+?[\d\s\-()]{6,24}$/;

export function countPhoneDigits(value: string): number {
  return value.replace(/\D/g, "").length;
}

export function isPhoneLike(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) {
    return false;
  }
  const digitCount = countPhoneDigits(trimmed);
  if (digitCount < 6 || digitCount > 15) {
    return false;
  }
  return phoneLikePattern.test(trimmed);
}

export function lookupPhoneQueryValue(value: string): string | null {
  const trimmed = value.trim();
  if (!isPhoneLike(trimmed)) {
    return null;
  }
  return trimmed;
}
