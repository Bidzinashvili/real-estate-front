import { getUsdRate } from "@/features/currency/currencyApi";
import type { UsdRateResponse } from "@/features/currency/types";

let cachedUsdRate: UsdRateResponse | null = null;
let inflightUsdRate: Promise<UsdRateResponse> | null = null;

export function peekCachedUsdRate(): UsdRateResponse | null {
  return cachedUsdRate;
}

export function clearUsdRateCache(): void {
  cachedUsdRate = null;
  inflightUsdRate = null;
}

export function getCachedUsdRate(): Promise<UsdRateResponse> {
  if (cachedUsdRate) {
    return Promise.resolve(cachedUsdRate);
  }

  if (!inflightUsdRate) {
    inflightUsdRate = getUsdRate()
      .then((response) => {
        cachedUsdRate = response;
        return response;
      })
      .finally(() => {
        inflightUsdRate = null;
      });
  }

  return inflightUsdRate;
}
