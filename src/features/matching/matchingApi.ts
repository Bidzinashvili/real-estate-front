import axios from "axios";
import { getBearerAuthContext } from "@/shared/lib/auth";
import { ApiError, parseStandardApiError } from "@/shared/lib/apiError";
import type {
  ClientToPropertyMatchResponse,
  MatchRequest,
  PropertyToClientMatchResponse,
} from "@/features/matching/matchingApi.types";

export type MatchingRequestOptions = {
  signal?: AbortSignal;
};

function matchingFallback(status: number, defaultMessage: string): string {
  if (status === 401) {
    return "You are not authenticated.";
  }
  if (status === 403) {
    return "You do not have access to this client";
  }
  return defaultMessage;
}

export async function fetchClientPropertyMatches(
  clientId: string,
  request: MatchRequest,
  requestOptions?: MatchingRequestOptions,
): Promise<ClientToPropertyMatchResponse> {
  const { baseUrl, headers } = getBearerAuthContext();

  try {
    const response = await axios.post<ClientToPropertyMatchResponse>(
      `${baseUrl}/clients/${clientId}/matches/properties`,
      request,
      {
        headers: { ...headers, "Content-Type": "application/json" },
        signal: requestOptions?.signal,
      },
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.code === "ERR_CANCELED") {
      throw error;
    }
    if (axios.isAxiosError(error)) {
      const status = error.response?.status ?? 500;
      const fallback = matchingFallback(status, "Could not load property matches right now.");
      const parsed = parseStandardApiError(error.response?.data, status, fallback);
      throw new ApiError(parsed, fallback);
    }
    throw error;
  }
}

export async function fetchPropertyClientMatches(
  propertyId: string,
  request: MatchRequest,
  requestOptions?: MatchingRequestOptions,
): Promise<PropertyToClientMatchResponse> {
  const { baseUrl, headers } = getBearerAuthContext();

  try {
    const response = await axios.post<PropertyToClientMatchResponse>(
      `${baseUrl}/properties/${propertyId}/matches/clients`,
      request,
      {
        headers: { ...headers, "Content-Type": "application/json" },
        signal: requestOptions?.signal,
      },
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.code === "ERR_CANCELED") {
      throw error;
    }
    if (axios.isAxiosError(error)) {
      const status = error.response?.status ?? 500;
      const fallback =
        status === 403
          ? "You do not have permission to run this match."
          : matchingFallback(status, "Could not load client matches right now.");
      const parsed = parseStandardApiError(error.response?.data, status, fallback);
      throw new ApiError(parsed, fallback);
    }
    throw error;
  }
}
