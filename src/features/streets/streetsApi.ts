import axios from "axios";
import { getApiBaseUrl, getStoredAuthToken } from "@/shared/lib/auth";
import { ApiError, parseStandardApiError } from "@/shared/lib/apiError";
import {
  asNumber,
  asString,
  isJsonObject,
} from "@/shared/lib/jsonValue";
import type { JsonValue } from "@/shared/lib/jsonValue";
import type {
  GetStreetsQuery,
  GetStreetsResponse,
  Street,
} from "@/features/streets/streetTypes";

const STREETS_QUERY_MAX_LENGTH = 200;
const STREETS_DEFAULT_LIMIT = 15;
const STREETS_MAX_LIMIT = 50;

function getAuthHeaders() {
  const baseUrl = getApiBaseUrl();
  const token = getStoredAuthToken();

  if (!baseUrl) {
    throw new Error("API base URL is not configured");
  }

  if (!token) {
    throw new Error("You are not authenticated.");
  }

  return {
    baseUrl,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
}

function normalizeStreetRecord(value: JsonValue): Street | null {
  if (!isJsonObject(value)) return null;

  const id = asString(value.id).trim();
  const name = asString(value.name).trim();
  if (!id || !name) return null;

  return {
    id,
    name,
    normalizedName: asString(value.normalizedName).trim(),
    usageCount: asNumber(value.usageCount, 0),
    createdAt: asString(value.createdAt),
    updatedAt: asString(value.updatedAt),
  };
}

function normalizeGetStreetsResponse(data: JsonValue): GetStreetsResponse {
  if (!isJsonObject(data)) {
    return { streets: [] };
  }

  const rawStreets = data.streets;
  if (!Array.isArray(rawStreets)) {
    return { streets: [] };
  }

  const streets = rawStreets
    .map((item) => normalizeStreetRecord(item))
    .filter((item): item is Street => item !== null);

  return { streets };
}

export type SearchStreetsOptions = {
  signal?: AbortSignal;
};

export async function searchStreets(
  query: GetStreetsQuery,
  requestOptions?: SearchStreetsOptions,
): Promise<GetStreetsResponse> {
  const trimmedQuery = query.query.trim();
  if (trimmedQuery.length === 0) {
    return { streets: [] };
  }

  const cappedQuery =
    trimmedQuery.length > STREETS_QUERY_MAX_LENGTH
      ? trimmedQuery.slice(0, STREETS_QUERY_MAX_LENGTH)
      : trimmedQuery;

  const limitRaw = query.limit ?? STREETS_DEFAULT_LIMIT;
  const limit = Math.min(
    Math.max(1, Number.isFinite(limitRaw) ? limitRaw : STREETS_DEFAULT_LIMIT),
    STREETS_MAX_LIMIT,
  );

  const { baseUrl, headers } = getAuthHeaders();

  try {
    const res = await axios.get<unknown>(`${baseUrl}/streets`, {
      headers,
      signal: requestOptions?.signal,
      params: {
        query: cappedQuery,
        limit,
        ...(query.fuzzy ? { fuzzy: true } : {}),
      },
    });

    return normalizeGetStreetsResponse(res.data as JsonValue);
  } catch (error) {
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

      const fallback =
        status === 401
          ? "Your session expired. Sign in again."
          : status === 400
            ? "Invalid search. Try a different query."
            : "Could not load street suggestions right now.";

      const parsed = parseStandardApiError(
        error.response?.data,
        status,
        fallback,
      );
      throw new ApiError(parsed, fallback);
    }

    throw error;
  }
}
