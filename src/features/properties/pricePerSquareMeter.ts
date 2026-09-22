import { listingCurrencySymbol } from "@/features/currency/types";
import type { SupportedListingCurrency } from "@/features/currency/types";

export function calculatePricePerSquareMeter(
  pricePublic: number | null | undefined,
  areaSquareMeters: number | null | undefined,
): number | null {
  if (
    pricePublic === null ||
    pricePublic === undefined ||
    areaSquareMeters === null ||
    areaSquareMeters === undefined ||
    !Number.isFinite(pricePublic) ||
    !Number.isFinite(areaSquareMeters) ||
    areaSquareMeters <= 0
  ) {
    return null;
  }

  return Math.round(pricePublic / areaSquareMeters);
}

export function formatPricePerSquareMeter(
  pricePerSquareMeter: number,
  currency: SupportedListingCurrency = "GEL",
): string {
  return `${pricePerSquareMeter.toLocaleString()} ${listingCurrencySymbol(currency)} / m²`;
}
