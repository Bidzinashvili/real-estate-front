"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { convertWithUsdRate } from "@/features/currency/convertWithUsdRate";
import { getCachedUsdRate, peekCachedUsdRate } from "@/features/currency/usdRateCache";
import type { SupportedListingCurrency, UsdRateResponse } from "@/features/currency/types";
import { listingCurrencySymbol } from "@/features/currency/types";
import { ApiError } from "@/shared/lib/apiError";

const MAX_CONVERT_AMOUNT = 1e15;

type HintState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; result: number; usdRate: UsdRateResponse }
  | { status: "error"; message: string };

const usdFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const gelFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const rateFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 4,
  maximumFractionDigits: 6,
});

export function parseGelAmountForHint(raw: string): number | undefined {
  return parseListingAmountForHint(raw);
}

export function parseListingAmountForHint(raw: string): number | undefined {
  const trimmed = raw.trim();
  if (trimmed === "") return undefined;
  const parsed = Number(trimmed);
  if (!Number.isFinite(parsed) || parsed < 0 || parsed > MAX_CONVERT_AMOUNT) {
    return undefined;
  }
  return parsed;
}

type ListingPriceEquivalentHintProps = {
  amount: number | undefined;
  fromCurrency: SupportedListingCurrency;
};

function formatConvertedAmount(
  result: number,
  fromCurrency: SupportedListingCurrency,
): string {
  if (fromCurrency === "GEL") {
    return usdFormatter.format(result);
  }
  return `${gelFormatter.format(result)} ${listingCurrencySymbol("GEL")}`;
}

function hintFromRate(
  amount: number,
  fromCurrency: SupportedListingCurrency,
  usdRate: UsdRateResponse,
): HintState {
  const convertedAmount = convertWithUsdRate(amount, fromCurrency, usdRate);
  if (convertedAmount === null) {
    return {
      status: "error",
      message: "თანხის კონვერტაცია ვერ მოხერხდა.",
    };
  }
  return {
    status: "success",
    result: convertedAmount,
    usdRate,
  };
}

export function ListingPriceEquivalentHint({
  amount,
  fromCurrency,
}: ListingPriceEquivalentHintProps) {
  const [hintState, setHintState] = useState<HintState>(() => {
    if (amount === undefined) {
      return { status: "idle" };
    }
    const cachedRate = peekCachedUsdRate();
    if (!cachedRate) {
      return { status: "loading" };
    }
    return hintFromRate(amount, fromCurrency, cachedRate);
  });

  useEffect(() => {
    if (amount === undefined) {
      setHintState({ status: "idle" });
      return;
    }

    const cachedRate = peekCachedUsdRate();
    if (cachedRate) {
      setHintState(hintFromRate(amount, fromCurrency, cachedRate));
      return;
    }

    let isActive = true;
    setHintState({ status: "loading" });

    getCachedUsdRate()
      .then((usdRate) => {
        if (!isActive) return;
        setHintState(hintFromRate(amount, fromCurrency, usdRate));
      })
      .catch((unknownError) => {
        if (!isActive) return;
        if (axios.isAxiosError(unknownError) && unknownError.code === "ERR_CANCELED") {
          return;
        }
        if (unknownError instanceof ApiError) {
          setHintState({ status: "error", message: unknownError.message });
          return;
        }
        setHintState({
          status: "error",
          message: "დოლარის ეკვივალენტის ჩატვირთვა ვერ მოხერხდა.",
        });
      });

    return () => {
      isActive = false;
    };
  }, [amount, fromCurrency]);

  if (amount === undefined) {
    return null;
  }

  if (hintState.status === "idle") {
    return null;
  }

  if (hintState.status === "loading") {
    return <p className="text-xs text-muted-foreground">ვალუტის ეკვივალენტი…</p>;
  }

  if (hintState.status === "error") {
    return (
      <p className="text-xs text-destructive" role="status">
        {hintState.message}
      </p>
    );
  }

  return (
    <p className="text-xs text-muted-foreground">
      ≈ {formatConvertedAmount(hintState.result, fromCurrency)} ·{" "}
      <span className="tabular-nums">
        {rateFormatter.format(hintState.usdRate.unitRate)} ₾ / 1 $
      </span>
      <span className="text-muted-foreground"> · NBG {hintState.usdRate.date}</span>
    </p>
  );
}
