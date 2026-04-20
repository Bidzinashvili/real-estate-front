import axios from "axios";
import { getApiBaseUrl, getStoredAuthToken } from "@/shared/lib/auth";
import { ApiError, parseStandardApiError } from "@/shared/lib/apiError";
import type { LabelsAutocompleteResponse } from "@/features/labels/labelTypes";

type FetchLabelsAutocompleteArgs = {
  query: string;
  limit?: number;
};

type FetchLabelsAutocompleteOptions = {
  signal?: AbortSignal;
};

function getAuthContext() {
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

export async function fetchLabelsAutocomplete(
  args: FetchLabelsAutocompleteArgs,
  options?: FetchLabelsAutocompleteOptions,
): Promise<LabelsAutocompleteResponse> {
  const { baseUrl, headers } = getAuthContext();
  const trimmedQuery = args.query.trim();

  try {
    const response = await axios.get<LabelsAutocompleteResponse>(
      `${baseUrl}/labels/autocomplete`,
      {
        headers,
        params: {
          q: trimmedQuery,
          limit: args.limit ?? 15,
        },
        signal: options?.signal,
      },
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.code === "ERR_CANCELED") {
      throw error;
    }

    if (axios.isAxiosError(error)) {
      const fallback = "Could not load label suggestions right now.";
      const parsed = parseStandardApiError(
        error.response?.data,
        error.response?.status ?? 500,
        fallback,
      );
      throw new ApiError(parsed, fallback);
    }

    throw error;
  }
}
