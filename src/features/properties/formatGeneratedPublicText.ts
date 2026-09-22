import type { DealType } from "@/features/properties/dealType";

export const RENT_LISTING_PREPAID_MONTHS_PHRASE =
  "(პირველი და ბოლო თვის წინასწარი გადახდით)";

export function formatGeneratedPublicText(
  generatedText: string,
  dealType: DealType,
): string {
  if (dealType !== "RENT") {
    return generatedText;
  }

  const trimmedText = generatedText.trim();
  if (trimmedText === "") {
    return generatedText;
  }

  if (trimmedText.includes(RENT_LISTING_PREPAID_MONTHS_PHRASE)) {
    return trimmedText;
  }

  return `${trimmedText} ${RENT_LISTING_PREPAID_MONTHS_PHRASE}`;
}
