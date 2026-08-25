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
import { normalizeProperty } from "@/features/properties/propertyRecordNormalizer";
import { ApiError, parseStandardApiError } from "@/shared/lib/apiError";
import { emitRecordsChangedEvent } from "@/features/lifecycle/recordsChangedEvent";
import { emitRemindersChangedEvent } from "@/features/reminders/reminderEvents";

function getAuthHeaders() {
  const baseUrl = getApiBaseUrl();
  const token = getStoredAuthToken();

  if (!baseUrl) {
    throw new Error("API მისამართი არ არის კონფიგურირებული");
  }

  if (!token) {
    throw new Error("ავტორიზაცია საჭიროა.");
  }

  return {
    baseUrl,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
}

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
      const fallback = "განცხადებების ჩატვირთვა ვერ მოხერხდა.";
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

export async function getPropertyById(id: string): Promise<Property | null> {
  const { baseUrl, headers } = getAuthHeaders();

  try {
    const res = await axios.get(`${baseUrl}/properties/${id}`, {
      headers,
    });
    return normalizeProperty(res.data);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null;
    }
    if (axios.isAxiosError(error)) {
      const status = error.response?.status ?? 500;
      const fallback =
        status === 403
          ? "ამ განცხადებაზე წვდომა არ გაქვთ"
          : "განცხადების ჩატვირთვა ვერ მოხერხდა.";
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

export async function getPropertyFromListById(
  id: string,
): Promise<Property | null> {
  return getPropertyById(id);
}

export async function getPropertiesBulk(options?: {
  maxItems?: number;
  archived?: boolean;
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
      archived: options?.archived ?? false,
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
): Promise<Property | null> {
  const { baseUrl, headers } = getAuthHeaders();

  try {
    const res = await axios.patch(`${baseUrl}/properties/${id}`, payload, {
      headers: {
        ...headers,
        "Content-Type": "application/json",
      },
    });
    emitRemindersChangedEvent();
    emitRecordsChangedEvent();
    return normalizeProperty(res.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status ?? 500;
      const fallback =
        status === 403
          ? "ამ განცხადების შეცვლის უფლება არ გაქვთ"
          : "განცხადების ცვლილებების შენახვა ვერ მოხერხდა.";
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

export async function verifyProperty(id: string): Promise<Property | null> {
  const { baseUrl, headers } = getAuthHeaders();

  try {
    const res = await axios.post(
      `${baseUrl}/properties/${id}/verify`,
      {},
      {
        headers: {
          ...headers,
          "Content-Type": "application/json",
        },
      },
    );
    emitRemindersChangedEvent();
    emitRecordsChangedEvent();
    return normalizeProperty(res.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status ?? 500;
      const fallback =
        status === 403
          ? "ამ განცხადების გადამოწმების უფლება არ გაქვთ"
          : "განცხადების გადამოწმება ვერ მოხერხდა.";
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

async function postPropertyArchiveAction(
  id: string,
  action: "archive" | "unarchive",
): Promise<Property | null> {
  const { baseUrl, headers } = getAuthHeaders();
  const isRestore = action === "unarchive";
  const fallbackByStatus: Record<number, string> = {
    403: isRestore
      ? "ამ განცხადების არქივიდან დაბრუნების უფლება არ გაქვთ"
      : "ამ განცხადების დაარქივების უფლება არ გაქვთ",
    404: "განცხადება ვერ მოიძებნა.",
  };

  try {
    const res = await axios.post(
      `${baseUrl}/properties/${id}/${action}`,
      {},
      {
        headers: {
          ...headers,
          "Content-Type": "application/json",
        },
      },
    );
    emitRemindersChangedEvent();
    emitRecordsChangedEvent();
    return normalizeProperty(res.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status ?? 500;
      const fallback =
        fallbackByStatus[status] ??
        (isRestore
          ? "განცხადების არქივიდან დაბრუნება ვერ მოხერხდა."
          : "განცხადების დაარქივება ვერ მოხერხდა.");
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

export async function archiveProperty(id: string): Promise<Property | null> {
  return postPropertyArchiveAction(id, "archive");
}

export async function unarchiveProperty(id: string): Promise<Property | null> {
  return postPropertyArchiveAction(id, "unarchive");
}

export async function addPropertyExternalId(
  propertyId: string,
  payload: { platform: "MYHOME" | "SSGE"; value: string; enteredAt?: string },
): Promise<void> {
  const { baseUrl, headers } = getAuthHeaders();

  await axios.post(`${baseUrl}/properties/${propertyId}/external-ids`, payload, {
    headers: {
      ...headers,
      "Content-Type": "application/json",
    },
  });
}

export async function archivePropertyExternalId(
  propertyId: string,
  externalId: string,
): Promise<void> {
  const { baseUrl, headers } = getAuthHeaders();

  await axios.patch(
    `${baseUrl}/properties/${propertyId}/external-ids/${externalId}/archive`,
    {},
    { headers },
  );
}

export async function deletePropertyExternalId(
  propertyId: string,
  externalId: string,
): Promise<void> {
  const { baseUrl, headers } = getAuthHeaders();

  await axios.delete(
    `${baseUrl}/properties/${propertyId}/external-ids/${externalId}`,
    { headers },
  );
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
      const fallback = "ფოტოს წაშლა ვერ მოხერხდა.";
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
          ? "ეს გარე ID უკვე გამოყენებულია."
          : status === 403
            ? "განცხადების შექმნის უფლება არ გაქვთ."
            : status === 401
              ? "ავტორიზაცია საჭიროა."
              : "განცხადების შექმნა ვერ მოხერხდა.";
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
    throw new Error("განცხადების შექმნა ვერ მოხერხდა.");
  }
}
