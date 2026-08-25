import axios from "axios";
import { getBearerAuthContext } from "@/shared/lib/auth";
import { ApiError, parseStandardApiError } from "@/shared/lib/apiError";
import {
  toGetPropertyOwnersSearchParams,
  type GetPropertyOwnersQuery,
} from "@/features/propertyOwners/getPropertyOwnersQuery";
import {
  normalizePropertyOwner,
  normalizePropertyOwnerLookupResult,
  normalizePropertyOwnersListResponse,
} from "@/features/propertyOwners/normalizers";
import type {
  CreatePropertyOwnerContactPayload,
  CreatePropertyOwnerPayload,
  PropertyOwner,
  PropertyOwnerLookupResult,
  PropertyOwnersListResponse,
  UpdatePropertyOwnerContactPayload,
  UpdatePropertyOwnerPayload,
} from "@/features/propertyOwners/types";

export type GetPropertyOwnersRequestOptions = {
  signal?: AbortSignal;
};

function throwOwnerApiError(
  error: unknown,
  fallbackByStatus: Record<number, string>,
  fallback: string,
): never {
  if (axios.isAxiosError(error) && error.code === "ERR_CANCELED") {
    throw error;
  }
  if (axios.isAxiosError(error)) {
    const status = error.response?.status ?? 500;
    const parsed = parseStandardApiError(
      error.response?.data,
      status,
      fallbackByStatus[status] ?? fallback,
    );
    throw new ApiError(parsed, fallbackByStatus[status] ?? fallback);
  }
  throw error;
}

export async function getPropertyOwners(
  query?: GetPropertyOwnersQuery,
  requestOptions?: GetPropertyOwnersRequestOptions,
): Promise<PropertyOwnersListResponse> {
  const { baseUrl, headers } = getBearerAuthContext();
  const params = toGetPropertyOwnersSearchParams(query);

  try {
    const response = await axios.get(`${baseUrl}/property-owners`, {
      headers,
      params,
      signal: requestOptions?.signal,
    });
    return normalizePropertyOwnersListResponse(response.data);
  } catch (error) {
    throwOwnerApiError(
      error,
      {
        403: "მეპატრონეების ნახვის უფლება არ გაქვთ.",
      },
      "მეპატრონეების ჩატვირთვა ვერ მოხერხდა.",
    );
  }
}

export async function getPropertyOwnerById(ownerId: string): Promise<PropertyOwner> {
  const { baseUrl, headers } = getBearerAuthContext();

  try {
    const response = await axios.get(`${baseUrl}/property-owners/${ownerId}`, {
      headers,
    });
    const owner = normalizePropertyOwner(response.data);
    if (!owner) {
      throw new ApiError(
        {
          message: "მეპატრონე ვერ მოიძებნა.",
          error: "Not Found",
          statusCode: 404,
        },
        "მეპატრონე ვერ მოიძებნა.",
      );
    }
    return owner;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throwOwnerApiError(
      error,
      {
        403: "ამ მეპატრონეზე წვდომა არ გაქვთ.",
        404: "მეპატრონე ვერ მოიძებნა.",
      },
      "მეპატრონის ჩატვირთვა ვერ მოხერხდა.",
    );
  }
}

export async function lookupPropertyOwnerByPhone(
  phone: string,
  requestOptions?: GetPropertyOwnersRequestOptions,
): Promise<PropertyOwnerLookupResult> {
  const { baseUrl, headers } = getBearerAuthContext();

  try {
    const response = await axios.get(`${baseUrl}/property-owners/lookup`, {
      headers,
      params: { phone },
      signal: requestOptions?.signal,
    });
    return normalizePropertyOwnerLookupResult(response.data);
  } catch (error) {
    if (axios.isAxiosError(error) && (error.response?.status === 404 || error.response?.status === 400)) {
      return { owner: null, matchedContact: null };
    }
    throwOwnerApiError(
      error,
      {
        403: "მეპატრონის ძებნის უფლება არ გაქვთ.",
      },
      "მეპატრონის ძებნა ვერ მოხერხდა.",
    );
  }
}

export async function createPropertyOwner(
  payload: CreatePropertyOwnerPayload,
): Promise<PropertyOwner> {
  const { baseUrl, headers } = getBearerAuthContext();

  try {
    const response = await axios.post(`${baseUrl}/property-owners`, payload, {
      headers: { ...headers, "Content-Type": "application/json" },
    });
    const owner = normalizePropertyOwner(response.data);
    if (!owner) {
      throw new Error("მეპატრონის შექმნა ვერ მოხერხდა.");
    }
    return owner;
  } catch (error) {
    throwOwnerApiError(
      error,
      {
        403: "მეპატრონის შექმნის უფლება არ გაქვთ.",
        409: "ამ ნომრით მეპატრონის პროფილი უკვე არსებობს",
      },
      "მეპატრონის შექმნა ვერ მოხერხდა.",
    );
  }
}

export async function updatePropertyOwner(
  ownerId: string,
  payload: UpdatePropertyOwnerPayload,
): Promise<PropertyOwner> {
  const { baseUrl, headers } = getBearerAuthContext();

  try {
    const response = await axios.patch(
      `${baseUrl}/property-owners/${ownerId}`,
      payload,
      {
        headers: { ...headers, "Content-Type": "application/json" },
      },
    );
    const owner = normalizePropertyOwner(response.data);
    if (!owner) {
      throw new Error("მეპატრონის ცვლილებების შენახვა ვერ მოხერხდა.");
    }
    return owner;
  } catch (error) {
    throwOwnerApiError(
      error,
      {
        403: "ამ მეპატრონეზე წვდომა არ გაქვთ.",
        404: "მეპატრონე ვერ მოიძებნა.",
      },
      "მეპატრონის ცვლილებების შენახვა ვერ მოხერხდა.",
    );
  }
}

export async function addPropertyOwnerContact(
  ownerId: string,
  payload: CreatePropertyOwnerContactPayload,
): Promise<PropertyOwner> {
  const { baseUrl, headers } = getBearerAuthContext();

  try {
    const response = await axios.post(
      `${baseUrl}/property-owners/${ownerId}/contacts`,
      payload,
      {
        headers: { ...headers, "Content-Type": "application/json" },
      },
    );
    const owner = normalizePropertyOwner(response.data);
    if (owner) {
      return owner;
    }
    return getPropertyOwnerById(ownerId);
  } catch (error) {
    throwOwnerApiError(
      error,
      {
        403: "ამ მეპატრონეზე წვდომა არ გაქვთ.",
        404: "მეპატრონე ვერ მოიძებნა.",
        409: "ამ ნომრით კონტაქტი უკვე არსებობს.",
      },
      "კონტაქტის დამატება ვერ მოხერხდა.",
    );
  }
}

export async function updatePropertyOwnerContact(
  ownerId: string,
  contactId: string,
  payload: UpdatePropertyOwnerContactPayload,
): Promise<PropertyOwner> {
  const { baseUrl, headers } = getBearerAuthContext();

  try {
    const response = await axios.patch(
      `${baseUrl}/property-owners/${ownerId}/contacts/${contactId}`,
      payload,
      {
        headers: { ...headers, "Content-Type": "application/json" },
      },
    );
    const owner = normalizePropertyOwner(response.data);
    if (owner) {
      return owner;
    }
    return getPropertyOwnerById(ownerId);
  } catch (error) {
    throwOwnerApiError(
      error,
      {
        403: "ამ მეპატრონეზე წვდომა არ გაქვთ.",
        404: "კონტაქტი ვერ მოიძებნა.",
        409: "ამ ნომრით კონტაქტი უკვე არსებობს.",
      },
      "კონტაქტის განახლება ვერ მოხერხდა.",
    );
  }
}

export async function deletePropertyOwnerContact(
  ownerId: string,
  contactId: string,
): Promise<PropertyOwner> {
  const { baseUrl, headers } = getBearerAuthContext();

  try {
    const response = await axios.delete(
      `${baseUrl}/property-owners/${ownerId}/contacts/${contactId}`,
      { headers },
    );
    const owner = normalizePropertyOwner(response.data);
    if (owner) {
      return owner;
    }
    return getPropertyOwnerById(ownerId);
  } catch (error) {
    throwOwnerApiError(
      error,
      {
        400: "ბოლო კონტაქტის წაშლა შეუძლებელია.",
        403: "ამ მეპატრონეზე წვდომა არ გაქვთ.",
        404: "კონტაქტი ვერ მოიძებნა.",
      },
      "კონტაქტის წაშლა ვერ მოხერხდა.",
    );
  }
}
