"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { convertCurrency } from "@/features/currency/currencyApi";
import { ApiError } from "@/shared/lib/apiError";

const DEBOUNCE_MS = 300;
const MAX_CONVERT_AMOUNT = 1e15;

type HintState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; result: number; rate: number; date: string }
  | { status: "error"; message: string };

const usdFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const rateFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 4,
  maximumFractionDigits: 6,
});

export function parseGelAmountForHint(raw: string): number | undefined {
  const trimmed = raw.trim();
  if (trimmed === "") return undefined;
  const parsed = Number(trimmed);
  if (!Number.isFinite(parsed) || parsed < 0 || parsed > MAX_CONVERT_AMOUNT) {
    return undefined;
  }
  return parsed;
}

type ListingPriceEquivalentHintProps = {
  amountGel: number | undefined;
  fetchMode?: "debounced" | "immediate";
};

export function ListingPriceEquivalentHint({
  amountGel,
  fetchMode = "debounced",
}: ListingPriceEquivalentHintProps) {
  const [hintState, setHintState] = useState<HintState>({ status: "idle" });

  useEffect(() => {
    if (amountGel === undefined) {
      setHintState({ status: "idle" });
      return;
    }

    const gelAmount = amountGel;
    const abortController = new AbortController();

    async function runConvertRequest() {
      setHintState({ status: "loading" });
      try {
        const response = await convertCurrency(
          { from: "GEL", to: "USD", amount: gelAmount },
          { signal: abortController.signal },
        );
        if (abortController.signal.aborted) return;
        setHintState({
          status: "success",
          result: response.result,
          rate: response.rate,
          date: response.date,
        });
      } catch (unknownError) {
        if (axios.isAxiosError(unknownError) && unknownError.code === "ERR_CANCELED") {
          return;
        }
        if (abortController.signal.aborted) return;
        if (unknownError instanceof ApiError) {
          setHintState({ status: "error", message: unknownError.message });
          return;
        }
        setHintState({
          status: "error",
          message: "Could not load the USD equivalent right now.",
        });
      }
    }

    if (fetchMode === "immediate") {
      void runConvertRequest();
      return () => {
        abortController.abort();
      };
    }

    setHintState({ status: "idle" });

    const timerId = window.setTimeout(() => {
      void runConvertRequest();
    }, DEBOUNCE_MS);

    return () => {
      window.clearTimeout(timerId);
      abortController.abort();
    };
  }, [amountGel, fetchMode]);

  if (amountGel === undefined) {
    return null;
  }

  if (hintState.status === "idle") {
    return null;
  }

  if (hintState.status === "loading") {
    return <p className="text-xs text-slate-500">USD equivalent…</p>;
  }

  if (hintState.status === "error") {
    return (
      <p className="text-xs text-red-600" role="status">
        {hintState.message}
      </p>
    );
  }

  return (
    <p className="text-xs text-slate-600">
      ≈ {usdFormatter.format(hintState.result)} ·{" "}
      <span className="tabular-nums">
        {rateFormatter.format(hintState.rate)} USD per 1 ₾
      </span>
      <span className="text-slate-500"> · NBG {hintState.date}</span>
    </p>
  );
}
