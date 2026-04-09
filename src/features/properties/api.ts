import axios from "axios";
import { getApiBaseUrl, getStoredAuthToken } from "@/shared/lib/auth";
import type {
  GetPropertiesQuery,
  PropertiesListResult,
} from "@/features/properties/getPropertiesQuery";
import { toGetPropertiesSearchParams } from "@/features/properties/getPropertiesQuery";
import type {
  CreatePropertyDto,
  CreatePropertyResponse,
  Property,
  PropertyListResponse,
  PropertyUpdatePayload,
} from "@/features/properties/types";
import {
  normalizeCreatePropertyResponse,
  normalizePropertiesListResponse,
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

const PROPERTY_LIST_PAGE_SCAN = 100;
const PROPERTY_LIST_SCAN_MAX_PAGES = 500;

export type GetPropertiesRequestOptions = {
  signal?: AbortSignal;
};

export async function getProperties(
  query?: GetPropertiesQuery,
  requestOptions?: GetPropertiesRequestOptions,
): Promise<PropertiesListResult> {
  const { baseUrl, headers } = getAuthHeaders();
  const params = toGetPropertiesSearchParams(query);

  try {
    const res = await axios.get<PropertyListResponse>(`${baseUrl}/properties`, {
      headers,
      params,
      signal: requestOptions?.signal,
    });

    return normalizePropertiesListResponse(res.data);
  } catch (error) {
    if (axios.isAxiosError(error) && error.code === "ERR_CANCELED") {
      throw error;
    }
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

export async function getPropertyFromListById(
  id: string,
): Promise<Property | null> {
  let page = 1;

  while (page <= PROPERTY_LIST_SCAN_MAX_PAGES) {
    const { properties, total, limit } = await getProperties({
      page,
      limit: PROPERTY_LIST_PAGE_SCAN,
    });

    const found = properties.find((p) => p.id === id) ?? null;
    if (found) return found;

    const seenEnd = page * limit >= total || properties.length === 0;
    if (seenEnd) return null;

    page += 1;
  }

  return null;
}

export async function getPropertiesBulk(options?: {
  maxItems?: number;
}): Promise<Property[]> {
  const maxItems = options?.maxItems ?? 2500;
  const pageLimit = 100;
  const acc: Property[] = [];
  let page = 1;

  while (
    acc.length < maxItems &&
    page <= PROPERTY_LIST_SCAN_MAX_PAGES
  ) {
    const { properties, total } = await getProperties({
      page,
      limit: pageLimit,
    });

    acc.push(...properties);

    if (acc.length >= total || properties.length === 0) break;
    page += 1;
  }

  return acc;
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

export async function deletePropertyImage(
  propertyId: string,
  imageId: string,
): Promise<void> {
  const { baseUrl, headers } = getAuthHeaders();
  const encodedImageId = encodeURIComponent(imageId);

  try {
    await axios.delete(
      `${baseUrl}/properties/${propertyId}/images/${encodedImageId}`,
      {
        headers,
      },
    );
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const fallback = "Could not delete this image right now.";
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
      ? await axios.post<CreatePropertyResponse>(
          `${baseUrl}/properties`,
          buildCreatePropertyFormData(payload, images as File[]),
          { headers },
        )
      : await axios.post<CreatePropertyResponse>(`${baseUrl}/properties`, payload, {
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
