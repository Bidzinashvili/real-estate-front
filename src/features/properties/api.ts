import axios from "axios";
import { getApiBaseUrl, getStoredAuthToken } from "@/shared/lib/auth";
import type { Property, PropertyUpdatePayload } from "@/features/properties/types";
import { normalizePropertiesResponse } from "@/features/properties/normalizers";
import {
  getApiErrorMessage,
  hasJsonResponseBody,
  tryParseJson,
} from "@/features/properties/httpUtils";

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

export async function getProperties(): Promise<Property[]> {
  const { baseUrl, headers } = getAuthHeaders();

  try {
    const res = await axios.get<unknown>(`${baseUrl}/properties`, {
      headers,
    });

    return normalizePropertiesResponse(res.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = getApiErrorMessage(
        error.response?.data,
        "Could not load properties right now.",
      );
      throw new Error(message);
    }

    throw error;
  }
}

export async function updateProperty(
  id: string,
  payload: PropertyUpdatePayload,
): Promise<void> {
  const { baseUrl } = getAuthHeaders();
  const token = getStoredAuthToken();

  if (!token) {
    throw new Error("You are not authenticated.");
  }

  try {
    const response = await fetch(`${baseUrl}/properties/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const maybeJson = await tryParseJson<unknown>(response);
      const message = getApiErrorMessage(
        maybeJson,
        "Could not save property changes right now.",
      );
      throw new Error(message);
    }

    if (hasJsonResponseBody(response)) {
      await tryParseJson(response);
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Could not save property changes right now.");
  }
}

