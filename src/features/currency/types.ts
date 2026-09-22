export type SupportedListingCurrency = "USD" | "GEL";

export const DEFAULT_PROPERTY_CURRENCY: SupportedListingCurrency = "GEL";

export function isSupportedListingCurrency(
  value: string,
): value is SupportedListingCurrency {
  return value === "USD" || value === "GEL";
}

export function parseSupportedListingCurrency(value: unknown): SupportedListingCurrency {
  const candidate = typeof value === "string" ? value.trim() : "";
  return isSupportedListingCurrency(candidate) ? candidate : DEFAULT_PROPERTY_CURRENCY;
}

export function listingCurrencySymbol(currency: SupportedListingCurrency): string {
  return currency === "USD" ? "$" : "₾";
}

export type UsdRateResponse = {
  code: "USD";
  quantity: number;
  rate: number;
  unitRate: number;
  date: string;
};

export type ConvertCurrencyResponse = {
  from: SupportedListingCurrency;
  to: SupportedListingCurrency;
  amount: number;
  rate: number;
  result: number;
  date: string;
};

export type GetUsdRateParams = {
  date?: string;
};

export type ConvertCurrencyParams = {
  from: SupportedListingCurrency;
  to: SupportedListingCurrency;
  amount: number;
  date?: string;
};
