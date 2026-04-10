import { convertCurrency } from "@/features/currency/currencyApi";
import type { ConvertCurrencyResponse } from "@/features/currency/types";

const MAX_CONVERT_AMOUNT = 1e15;

const resultCache = new Map<string, ConvertCurrencyResponse>();
const inflightByKey = new Map<string, Promise<ConvertCurrencyResponse>>();
const cacheListeners = new Set<() => void>();

let gelToUsdCacheVersion = 0;

function gelAmountCacheKey(gelAmount: number): string {
  return String(gelAmount);
}

function emitGelToUsdCacheUpdate() {
  gelToUsdCacheVersion += 1;
  for (const listener of cacheListeners) {
    listener();
  }
}

export function getGelToUsdCacheVersion(): number {
  return gelToUsdCacheVersion;
}

export function subscribeGelToUsdCache(onStoreChange: () => void): () => void {
  cacheListeners.add(onStoreChange);
  return () => {
    cacheListeners.delete(onStoreChange);
  };
}

export function peekCachedGelToUsd(gelAmount: number): ConvertCurrencyResponse | undefined {
  if (
    !Number.isFinite(gelAmount) ||
    gelAmount < 0 ||
    gelAmount > MAX_CONVERT_AMOUNT
  ) {
    return undefined;
  }
  return resultCache.get(gelAmountCacheKey(gelAmount));
}

export function prefetchGelToUsdForAmounts(
  gelAmounts: ReadonlyArray<number>,
): Promise<void> {
  const uniqueAmounts = new Set<number>();
  for (const amount of gelAmounts) {
    if (
      Number.isFinite(amount) &&
      amount >= 0 &&
      amount <= MAX_CONVERT_AMOUNT
    ) {
      uniqueAmounts.add(amount);
    }
  }

  const conversionTasks = [...uniqueAmounts].map((amount) =>
    getCachedGelToUsd(amount).catch(() => undefined),
  );

  return Promise.all(conversionTasks).then(() => undefined);
}

export function getCachedGelToUsd(gelAmount: number): Promise<ConvertCurrencyResponse> {
  if (
    !Number.isFinite(gelAmount) ||
    gelAmount < 0 ||
    gelAmount > MAX_CONVERT_AMOUNT
  ) {
    return Promise.reject(new Error("Invalid GEL amount for conversion."));
  }

  const cacheKey = gelAmountCacheKey(gelAmount);
  const cached = resultCache.get(cacheKey);
  if (cached) {
    return Promise.resolve(cached);
  }

  let pending = inflightByKey.get(cacheKey);
  if (!pending) {
    pending = convertCurrency({ from: "GEL", to: "USD", amount: gelAmount })
      .then((response) => {
        resultCache.set(cacheKey, response);
        emitGelToUsdCacheUpdate();
        return response;
      })
      .finally(() => {
        inflightByKey.delete(cacheKey);
      });
    inflightByKey.set(cacheKey, pending);
  }

  return pending;
}
