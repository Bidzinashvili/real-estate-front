import axios from "axios";
import { getApiBaseUrl, getStoredAuthToken } from "@/shared/lib/auth";
import type {
  CreatePropertyDto,
  Property,
  PropertyUpdatePayload,
} from "@/features/properties/types";
import {
  normalizeCreatePropertyResponse,
  normalizePropertiesResponse,
} from "@/features/properties/normalizers";
import { ApiError, parseStandardApiError } from "@/shared/lib/apiError";

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
      const fallback = "Could not load properties right now.";
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

export async function updateProperty(
  id: string,
  payload: PropertyUpdatePayload,
): Promise<void> {
  const { baseUrl, headers } = getAuthHeaders();

  try {
    await axios.patch(`${baseUrl}/properties/${id}`, payload, {
      headers: {
        ...headers,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const fallback = "Could not save property changes right now.";
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

function buildCreatePropertyFormData(
  payload: CreatePropertyDto,
  images: File[],
): FormData {
  const formData = new FormData();
  formData.append("data", JSON.stringify(payload));
  for (const image of images) {
    formData.append("images", image);
  }
  return formData;
}

export async function createProperty(
  payload: CreatePropertyDto,
  images?: File[],
): Promise<Property | null> {
  const { baseUrl, headers } = getAuthHeaders();
  const hasImages = Array.isArray(images) && images.length > 0;

  try {
    const res = hasImages
      ? await axios.post<unknown>(
          `${baseUrl}/properties`,
          buildCreatePropertyFormData(payload, images as File[]),
          { headers },
        )
      : await axios.post<unknown>(`${baseUrl}/properties`, payload, {
          headers: {
            ...headers,
            "Content-Type": "application/json",
          },
        });

    return normalizeCreatePropertyResponse(res.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status ?? 500;
      const fallback =
        status === 409
          ? "This external property ID is already used."
          : status === 403
            ? "You do not have permission to create properties."
            : status === 401
              ? "You are not authenticated."
              : "Could not create this property right now.";
      const parsed = parseStandardApiError(
        error.response?.data,
        status,
        fallback,
      );
      throw new ApiError(parsed, fallback);
    }

    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Could not create this property right now.");
  }
}
