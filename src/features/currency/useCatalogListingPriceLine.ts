"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { convertWithUsdRate } from "@/features/currency/convertWithUsdRate";
import {
  getCachedGelToUsd,
  peekCachedGelToUsd,
} from "@/features/currency/gelToUsdConvertCache";
import { getCachedUsdRate, peekCachedUsdRate } from "@/features/currency/usdRateCache";
import type { SupportedListingCurrency } from "@/features/currency/types";
import { listingCurrencySymbol } from "@/features/currency/types";
import { ApiError } from "@/shared/lib/apiError";

const MAX_CONVERT_AMOUNT = 1e15;

const usdCurrencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const gelAmountFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

export type CatalogListingPriceLineState =
  | { status: "ready"; primaryLine: string }
  | { status: "loading"; primaryLine: string }
  | { status: "error"; primaryLine: string; message: string };

function formatNativeListingAmount(
  amount: number,
  listingCurrency: SupportedListingCurrency,
): string {
  if (listingCurrency === "USD") {
    return usdCurrencyFormatter.format(amount);
  }
  return `${gelAmountFormatter.format(amount)} ${listingCurrencySymbol("GEL")}`;
}

function isConvertibleAmount(amount: number): boolean {
  return (
    Number.isFinite(amount) &&
    amount >= 0 &&
    amount <= MAX_CONVERT_AMOUNT
  );
}

export function useCatalogListingPriceLine(
  pricePublic: number,
  listingCurrency: SupportedListingCurrency,
  displayCurrency: SupportedListingCurrency,
): CatalogListingPriceLineState {
  const [state, setState] = useState<CatalogListingPriceLineState>(() => {
    if (listingCurrency === displayCurrency) {
      return {
        status: "ready",
        primaryLine: formatNativeListingAmount(pricePublic, listingCurrency),
      };
    }
    if (displayCurrency === "USD" && listingCurrency === "GEL") {
      const cached = peekCachedGelToUsd(pricePublic);
      if (cached) {
        return {
          status: "ready",
          primaryLine: usdCurrencyFormatter.format(cached.result),
        };
      }
      return {
        status: "loading",
        primaryLine: formatNativeListingAmount(pricePublic, listingCurrency),
      };
    }
    if (displayCurrency === "GEL" && listingCurrency === "USD") {
      const cachedRate = peekCachedUsdRate();
      if (cachedRate) {
        const converted = convertWithUsdRate(pricePublic, "USD", cachedRate);
        if (converted !== null) {
          return {
            status: "ready",
            primaryLine: `${gelAmountFormatter.format(converted)} ${listingCurrencySymbol("GEL")}`,
          };
        }
      }
      return {
        status: "loading",
        primaryLine: formatNativeListingAmount(pricePublic, listingCurrency),
      };
    }
    return {
      status: "ready",
      primaryLine: formatNativeListingAmount(pricePublic, listingCurrency),
    };
  });

  useEffect(() => {
    if (listingCurrency === displayCurrency) {
      setState({
        status: "ready",
        primaryLine: formatNativeListingAmount(pricePublic, listingCurrency),
      });
      return;
    }

    if (!isConvertibleAmount(pricePublic)) {
      setState({
        status: "error",
        primaryLine: formatNativeListingAmount(pricePublic, listingCurrency),
        message: "ამ ფასის კონვერტაცია შეუძლებელია.",
      });
      return;
    }

    if (displayCurrency === "USD" && listingCurrency === "GEL") {
      const cached = peekCachedGelToUsd(pricePublic);
      if (cached) {
        setState({
          status: "ready",
          primaryLine: usdCurrencyFormatter.format(cached.result),
        });
        return;
      }

      let isActive = true;
      setState({
        status: "loading",
        primaryLine: formatNativeListingAmount(pricePublic, listingCurrency),
      });

      getCachedGelToUsd(pricePublic)
        .then((response) => {
          if (!isActive) return;
          setState({
            status: "ready",
            primaryLine: usdCurrencyFormatter.format(response.result),
          });
        })
        .catch((unknownError) => {
          if (!isActive) return;
          if (axios.isAxiosError(unknownError) && unknownError.code === "ERR_CANCELED") {
            return;
          }
          const message =
            unknownError instanceof ApiError
              ? unknownError.message
              : "დოლარის ფასის ჩატვირთვა ვერ მოხერხდა.";
          setState({
            status: "error",
            primaryLine: formatNativeListingAmount(pricePublic, listingCurrency),
            message,
          });
        });

      return () => {
        isActive = false;
      };
    }

    if (displayCurrency === "GEL" && listingCurrency === "USD") {
      const cachedRate = peekCachedUsdRate();
      if (cachedRate) {
        const converted = convertWithUsdRate(pricePublic, "USD", cachedRate);
        if (converted !== null) {
          setState({
            status: "ready",
            primaryLine: `${gelAmountFormatter.format(converted)} ${listingCurrencySymbol("GEL")}`,
          });
          return;
        }
      }

      let isActive = true;
      setState({
        status: "loading",
        primaryLine: formatNativeListingAmount(pricePublic, listingCurrency),
      });

      getCachedUsdRate()
        .then((usdRate) => {
          if (!isActive) return;
          const converted = convertWithUsdRate(pricePublic, "USD", usdRate);
          if (converted === null) {
            setState({
              status: "error",
              primaryLine: formatNativeListingAmount(pricePublic, listingCurrency),
              message: "თანხის კონვერტაცია ვერ მოხერხდა.",
            });
            return;
          }
          setState({
            status: "ready",
            primaryLine: `${gelAmountFormatter.format(converted)} ${listingCurrencySymbol("GEL")}`,
          });
        })
        .catch((unknownError) => {
          if (!isActive) return;
          if (axios.isAxiosError(unknownError) && unknownError.code === "ERR_CANCELED") {
            return;
          }
          const message =
            unknownError instanceof ApiError
              ? unknownError.message
              : "ლარის ეკვივალენტის ჩატვირთვა ვერ მოხერხდა.";
          setState({
            status: "error",
            primaryLine: formatNativeListingAmount(pricePublic, listingCurrency),
            message,
          });
        });

      return () => {
        isActive = false;
      };
    }

    setState({
      status: "ready",
      primaryLine: formatNativeListingAmount(pricePublic, listingCurrency),
    });
  }, [displayCurrency, listingCurrency, pricePublic]);

  return state;
}
