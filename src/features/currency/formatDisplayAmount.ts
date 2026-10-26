import type { SupportedListingCurrency } from "@/features/currency/types";
import { listingCurrencySymbol } from "@/features/currency/types";

const gelWholeLariFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const usdListingCurrencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatGelDisplayNumber(amount: number): string {
  return gelWholeLariFormatter.format(amount);
}

export function formatGelListingLine(amount: number): string {
  return `${formatGelDisplayNumber(amount)} ${listingCurrencySymbol("GEL")}`;
}

export function formatUsdListingLine(amount: number): string {
  return usdListingCurrencyFormatter.format(amount);
}

export function formatListingDisplayAmount(
  amount: number,
  currency: SupportedListingCurrency,
): string {
  if (currency === "USD") {
    return `${listingCurrencySymbol("USD")} ${amount.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })}`;
  }
  return `${listingCurrencySymbol("GEL")} ${formatGelDisplayNumber(amount)}`;
}
