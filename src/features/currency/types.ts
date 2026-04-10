export type SupportedListingCurrency = "USD" | "GEL";

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
