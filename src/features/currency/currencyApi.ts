import axios from "axios";
import { getApiBaseUrl } from "@/shared/lib/auth";
import { ApiError, parseStandardApiError } from "@/shared/lib/apiError";
import {
  asNumber,
  asString,
  isJsonObject,
} from "@/shared/lib/jsonValue";
import type { JsonValue } from "@/shared/lib/jsonValue";
import type {
  ConvertCurrencyParams,
  ConvertCurrencyResponse,
  GetUsdRateParams,
  SupportedListingCurrency,
  UsdRateResponse,
} from "@/features/currency/types";

const MAX_CONVERT_AMOUNT = 1e15;

function getCurrencyApiBaseUrl(): string {
  const baseUrl = getApiBaseUrl();
  if (!baseUrl) {
    throw new Error("API base URL is not configured");
  }
  return baseUrl;
}

function isSupportedCurrency(value: string): value is SupportedListingCurrency {
  return value === "USD" || value === "GEL";
}

function normalizeUsdRateResponse(data: JsonValue): UsdRateResponse | null {
  if (!isJsonObject(data)) return null;
  const code = asString(data.code);
  if (code !== "USD") return null;
  return {
    code: "USD",
    quantity: asNumber(data.quantity, Number.NaN),
    rate: asNumber(data.rate, Number.NaN),
    unitRate: asNumber(data.unitRate, Number.NaN),
    date: asString(data.date),
  };
}

function normalizeConvertResponse(data: JsonValue): ConvertCurrencyResponse | null {
  if (!isJsonObject(data)) return null;
  const fromRaw = asString(data.from);
  const toRaw = asString(data.to);
  if (!isSupportedCurrency(fromRaw) || !isSupportedCurrency(toRaw)) return null;
  return {
    from: fromRaw,
    to: toRaw,
    amount: asNumber(data.amount, Number.NaN),
    rate: asNumber(data.rate, Number.NaN),
    result: asNumber(data.result, Number.NaN),
    date: asString(data.date),
  };
}

function assertValidUsdRate(response: UsdRateResponse): UsdRateResponse {
  if (
    !Number.isFinite(response.quantity) ||
    !Number.isFinite(response.rate) ||
    !Number.isFinite(response.unitRate) ||
    response.date.trim() === ""
  ) {
    throw new Error("Unexpected USD rate response shape");
  }
  return response;
}

function assertValidConvert(response: ConvertCurrencyResponse): ConvertCurrencyResponse {
  if (
    !Number.isFinite(response.amount) ||
    !Number.isFinite(response.rate) ||
    !Number.isFinite(response.result) ||
    response.date.trim() === ""
  ) {
    throw new Error("Unexpected convert response shape");
  }
  return response;
}

export type CurrencyRequestOptions = {
  signal?: AbortSignal;
};

export async function getUsdRate(
  params: GetUsdRateParams = {},
  requestOptions?: CurrencyRequestOptions,
): Promise<UsdRateResponse> {
  const baseUrl = getCurrencyApiBaseUrl();
  const trimmedDate = params.date?.trim();

  try {
    const res = await axios.get<unknown>(`${baseUrl}/currency/usd-rate`, {
      signal: requestOptions?.signal,
      ...(trimmedDate ? { params: { date: trimmedDate } } : {}),
    });

    const normalized = normalizeUsdRateResponse(res.data as JsonValue);
    if (!normalized) {
      throw new Error("Unexpected USD rate response shape");
    }
    return assertValidUsdRate(normalized);
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.code === "ERR_CANCELED") {
      throw error;
    }

    if (axios.isAxiosError(error)) {
      const status = error.response?.status ?? 500;
      const isNetworkFailure = error.code === "ERR_NETWORK" || !error.response;

      if (isNetworkFailure) {
        throw new ApiError(
          {
            message: "Network error. Check your connection and try again.",
            error: "NetworkError",
            statusCode: status,
          },
          "Network error. Check your connection and try again.",
        );
      }

      if (status === 503) {
        const fallback =
          "Official exchange rates are temporarily unavailable. Try again shortly.";
        const parsed = parseStandardApiError(error.response?.data, status, fallback);
        throw new ApiError(parsed, fallback);
      }

      const fallback =
        status === 400
          ? "Check the date and try again."
          : "Could not load the official USD rate right now.";
      const parsed = parseStandardApiError(error.response?.data, status, fallback);
      throw new ApiError(parsed, fallback);
    }

    throw error;
  }
}

export async function convertCurrency(
  params: ConvertCurrencyParams,
  requestOptions?: CurrencyRequestOptions,
): Promise<ConvertCurrencyResponse> {
  const baseUrl = getCurrencyApiBaseUrl();

  if (params.from === params.to) {
    throw new ApiError(
      {
        message: "Choose two different currencies.",
        error: "BadRequest",
        statusCode: 400,
      },
      "Choose two different currencies.",
    );
  }

  if (
    !Number.isFinite(params.amount) ||
    params.amount < 0 ||
    params.amount > MAX_CONVERT_AMOUNT
  ) {
    throw new ApiError(
      {
        message: `Enter an amount between 0 and ${MAX_CONVERT_AMOUNT}.`,
        error: "BadRequest",
        statusCode: 400,
      },
      `Enter an amount between 0 and ${MAX_CONVERT_AMOUNT}.`,
    );
  }

  const trimmedDate = params.date?.trim();

  try {
    const res = await axios.get<unknown>(`${baseUrl}/currency/convert`, {
      signal: requestOptions?.signal,
      params: {
        from: params.from,
        to: params.to,
        amount: params.amount,
        ...(trimmedDate ? { date: trimmedDate } : {}),
      },
    });

    const normalized = normalizeConvertResponse(res.data as JsonValue);
    if (!normalized) {
      throw new Error("Unexpected convert response shape");
    }
    return assertValidConvert(normalized);
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.code === "ERR_CANCELED") {
      throw error;
    }

    if (axios.isAxiosError(error)) {
      const status = error.response?.status ?? 500;
      const isNetworkFailure = error.code === "ERR_NETWORK" || !error.response;

      if (isNetworkFailure) {
        throw new ApiError(
          {
            message: "Network error. Check your connection and try again.",
            error: "NetworkError",
            statusCode: status,
          },
          "Network error. Check your connection and try again.",
        );
      }

      if (status === 503) {
        const fallback =
          "Official exchange rates are temporarily unavailable. Try again shortly.";
        const parsed = parseStandardApiError(error.response?.data, status, fallback);
        throw new ApiError(parsed, fallback);
      }

      const fallback =
        status === 400
          ? "Check the amount, currencies, and date, then try again."
          : "Could not convert this amount right now.";
      const parsed = parseStandardApiError(error.response?.data, status, fallback);
      throw new ApiError(parsed, fallback);
    }

    throw error;
  }
}
