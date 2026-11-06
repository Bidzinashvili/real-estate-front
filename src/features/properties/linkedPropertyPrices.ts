import type { DealType } from "@/features/properties/dealType";

/** Public (საჯარო) price = internal (შიდა) price × this ratio for SALE. */
export const PROPERTY_PRICE_MARKUP_RATIO = 1.03;

export function roundPropertyPrice(value: number): number {
  return Math.round(value);
}

export function calculateInternalPriceFromPublic(publicPrice: number): number {
  return roundPropertyPrice(publicPrice / PROPERTY_PRICE_MARKUP_RATIO);
}

export function formatPropertyPriceForInput(value: number): string {
  return String(roundPropertyPrice(value));
}

export function parsePropertyPriceInput(rawValue: string): number | null {
  const trimmedValue = rawValue.trim();
  if (trimmedValue === "") {
    return null;
  }
  const parsedPrice = Number.parseInt(trimmedValue, 10);
  if (!Number.isFinite(parsedPrice)) {
    return null;
  }
  return parsedPrice;
}

/** SALE: public ÷ 1.03. RENT / DAILY_RENT: same as public. */
export function suggestInitialInternalPrice(
  publicPrice: number,
  dealType: DealType,
): number {
  if (dealType === "SALE") {
    return calculateInternalPriceFromPublic(publicPrice);
  }

  return roundPropertyPrice(publicPrice);
}

export type CreateInternalPriceSuggestion =
  | { kind: "apply"; internalInput: string }
  | { kind: "keepManual" }
  | { kind: "unchanged" };

/**
 * Create form: the public price is entered first and the internal price is
 * suggested from it until the agent edits the internal price by hand.
 */
export function resolveCreateInternalPriceSuggestion(options: {
  dealType: DealType;
  nextPublicInput: string;
  currentInternalInput: string;
  hasManuallyEditedInternalPrice: boolean;
  lastSuggestedInternalInput: string | null;
}): CreateInternalPriceSuggestion {
  if (options.hasManuallyEditedInternalPrice) {
    return { kind: "unchanged" };
  }

  const internalIsEmpty = options.currentInternalInput.trim() === "";
  const internalMatchesLastSuggestion =
    options.lastSuggestedInternalInput !== null &&
    options.currentInternalInput === options.lastSuggestedInternalInput;

  if (!internalIsEmpty && !internalMatchesLastSuggestion) {
    return { kind: "keepManual" };
  }

  const parsedPublicPrice = parsePropertyPriceInput(options.nextPublicInput);
  if (parsedPublicPrice === null) {
    if (internalIsEmpty) {
      return { kind: "unchanged" };
    }
    return { kind: "apply", internalInput: "" };
  }

  return {
    kind: "apply",
    internalInput: formatPropertyPriceForInput(
      suggestInitialInternalPrice(parsedPublicPrice, options.dealType),
    ),
  };
}
