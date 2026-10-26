import { formatGelDisplayNumber } from "@/features/currency/formatDisplayAmount";
import {
  isSupportedListingCurrency,
  listingCurrencySymbol,
  type SupportedListingCurrency,
} from "@/features/currency/types";

export type ClientBudgetCurrency = SupportedListingCurrency;

export const DEFAULT_CLIENT_BUDGET_CURRENCY: ClientBudgetCurrency = "USD";

export function parseClientBudgetCurrency(value: unknown): ClientBudgetCurrency {
  const candidate = typeof value === "string" ? value.trim() : "";
  return isSupportedListingCurrency(candidate) ? candidate : DEFAULT_CLIENT_BUDGET_CURRENCY;
}

export function formatClientBudgetAmount(
  amount: number,
  currency: ClientBudgetCurrency,
): string {
  if (currency === "USD") {
    return `$${amount.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })}`;
  }
  return `${formatGelDisplayNumber(amount)} ${listingCurrencySymbol("GEL")}`;
}

export function formatClientBudgetRange(
  budgetMin: number | null,
  budgetMax: number | null,
  currency: ClientBudgetCurrency,
): string | null {
  if (budgetMin === null && budgetMax === null) {
    return null;
  }
  if (budgetMin !== null && budgetMax !== null) {
    return `${formatClientBudgetAmount(budgetMin, currency)} – ${formatClientBudgetAmount(budgetMax, currency)}`;
  }
  if (budgetMin !== null) {
    return `${formatClientBudgetAmount(budgetMin, currency)}+`;
  }
  if (budgetMax !== null) {
    return `მდე ${formatClientBudgetAmount(budgetMax, currency)}`;
  }
  return null;
}
