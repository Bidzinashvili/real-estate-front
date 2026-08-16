export const GEORGIAN_AGENT_PHONE_PREFIX = "+995";

const GEORGIAN_COUNTRY_DIGITS = "995";

export function normalizeGeorgianAgentPhone(rawValue: string): string {
  const compactInput = rawValue.replace(/\s/g, "");

  if (
    compactInput.length === 0 ||
    GEORGIAN_AGENT_PHONE_PREFIX.startsWith(compactInput) ||
    compactInput === GEORGIAN_COUNTRY_DIGITS
  ) {
    return GEORGIAN_AGENT_PHONE_PREFIX;
  }

  let digitsOnly = compactInput.replace(/\D/g, "");

  while (digitsOnly.startsWith(GEORGIAN_COUNTRY_DIGITS)) {
    digitsOnly = digitsOnly.slice(GEORGIAN_COUNTRY_DIGITS.length);
  }

  return `${GEORGIAN_AGENT_PHONE_PREFIX}${digitsOnly}`;
}
