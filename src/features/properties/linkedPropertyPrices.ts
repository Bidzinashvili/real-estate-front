import type { DealType } from "@/features/properties/dealType";

export const PROPERTY_PRICE_MARKUP_RATIO = 1.03;

export function roundPropertyPrice(value: number): number {
  return Math.round(value);
}

export function calculatePublicPriceFromInternal(internalPrice: number): number {
  return roundPropertyPrice(internalPrice * PROPERTY_PRICE_MARKUP_RATIO);
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

export function suggestInitialPublicPrice(
  internalPrice: number,
  dealType: DealType,
): number {
  if (dealType === "SALE") {
    return calculatePublicPriceFromInternal(internalPrice);
  }

  return roundPropertyPrice(internalPrice);
}

export type CreatePublicPriceSuggestion =
  | { kind: "apply"; publicInput: string }
  | { kind: "keepManual" }
  | { kind: "unchanged" };

export function resolveCreatePublicPriceSuggestion(options: {
  dealType: DealType;
  nextInternalInput: string;
  currentPublicInput: string;
  hasManuallyEditedPublicPrice: boolean;
  lastSuggestedPublicInput: string | null;
}): CreatePublicPriceSuggestion {
  if (options.hasManuallyEditedPublicPrice) {
    return { kind: "unchanged" };
  }

  const publicIsEmpty = options.currentPublicInput.trim() === "";
  const publicMatchesLastSuggestion =
    options.lastSuggestedPublicInput !== null &&
    options.currentPublicInput === options.lastSuggestedPublicInput;

  if (!publicIsEmpty && !publicMatchesLastSuggestion) {
    return { kind: "keepManual" };
  }

  const parsedInternalPrice = parsePropertyPriceInput(options.nextInternalInput);
  if (parsedInternalPrice === null) {
    if (publicIsEmpty) {
      return { kind: "unchanged" };
    }
    return { kind: "apply", publicInput: "" };
  }

  return {
    kind: "apply",
    publicInput: formatPropertyPriceForInput(
      suggestInitialPublicPrice(parsedInternalPrice, options.dealType),
    ),
  };
}
