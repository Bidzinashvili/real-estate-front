import type { SupportedListingCurrency, UsdRateResponse } from "@/features/currency/types";

export function convertWithUsdRate(
  amount: number,
  fromCurrency: SupportedListingCurrency,
  usdRate: UsdRateResponse,
): number | null {
  if (!Number.isFinite(amount) || !Number.isFinite(usdRate.unitRate) || usdRate.unitRate <= 0) {
    return null;
  }

  if (fromCurrency === "GEL") {
    return amount / usdRate.unitRate;
  }

  return amount * usdRate.unitRate;
}
