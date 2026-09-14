export const GEORGIAN_PHONE_PREFIX = "+995";

const GEORGIAN_COUNTRY_DIGITS = "995";

export function normalizeGeorgianPhone(rawValue: string): string {
  const compactInput = rawValue.replace(/\s/g, "");

  if (
    compactInput.length === 0 ||
    GEORGIAN_PHONE_PREFIX.startsWith(compactInput) ||
    compactInput === GEORGIAN_COUNTRY_DIGITS
  ) {
    return GEORGIAN_PHONE_PREFIX;
  }

  let digitsOnly = compactInput.replace(/\D/g, "");

  while (digitsOnly.startsWith(GEORGIAN_COUNTRY_DIGITS)) {
    digitsOnly = digitsOnly.slice(GEORGIAN_COUNTRY_DIGITS.length);
  }

  return `${GEORGIAN_PHONE_PREFIX}${digitsOnly}`;
}
