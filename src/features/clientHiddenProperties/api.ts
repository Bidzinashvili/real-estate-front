import axios from "axios";
import { HIDDEN_PROPERTY_COPY } from "@/features/clientHiddenProperties/hiddenPropertyCopy";
import {
  normalizeHiddenPropertiesList,
  normalizeUnhideResponse,
} from "@/features/clientHiddenProperties/normalizers";
import type {
  HiddenPropertiesListResponse,
  UnhideClientPropertyResponse,
} from "@/features/clientHiddenProperties/types";
import { getBearerAuthContext } from "@/shared/lib/auth";
import { ApiError, parseStandardApiError } from "@/shared/lib/apiError";

export type HiddenPropertiesRequestOptions = {
  signal?: AbortSignal;
};

function throwHiddenPropertyError(error: unknown, fallback: string): never {
  if (axios.isAxiosError(error) && error.code === "ERR_CANCELED") {
    throw error;
  }
  if (axios.isAxiosError(error)) {
    const status = error.response?.status ?? 500;
    const fallbackByStatus: Record<number, string> = {
      401: HIDDEN_PROPERTY_COPY.unauthorized,
      403: HIDDEN_PROPERTY_COPY.noAccess,
      404: HIDDEN_PROPERTY_COPY.notFound,
    };
    const parsed = parseStandardApiError(
      error.response?.data,
      status,
      fallbackByStatus[status] ?? fallback,
    );
    throw new ApiError(parsed, fallbackByStatus[status] ?? fallback);
  }
  throw error;
}

export async function getClientHiddenProperties(
  clientId: string,
  requestOptions?: HiddenPropertiesRequestOptions,
): Promise<HiddenPropertiesListResponse> {
  const { baseUrl, headers } = getBearerAuthContext();

  try {
    const response = await axios.get(`${baseUrl}/clients/${clientId}/hidden-properties`, {
      headers,
      signal: requestOptions?.signal,
    });
    return normalizeHiddenPropertiesList(response.data);
  } catch (error) {
    throwHiddenPropertyError(error, HIDDEN_PROPERTY_COPY.loadError);
  }
}

export async function hideClientProperty(
  clientId: string,
  propertyId: string,
): Promise<void> {
  const { baseUrl, headers } = getBearerAuthContext();

  try {
    await axios.post(
      `${baseUrl}/clients/${clientId}/hidden-properties/${propertyId}`,
      {},
      {
        headers: { ...headers, "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    throwHiddenPropertyError(error, HIDDEN_PROPERTY_COPY.hideError);
  }
}

export async function unhideClientProperty(
  clientId: string,
  propertyId: string,
): Promise<UnhideClientPropertyResponse> {
  const { baseUrl, headers } = getBearerAuthContext();

  try {
    const response = await axios.delete(
      `${baseUrl}/clients/${clientId}/hidden-properties/${propertyId}`,
      { headers },
    );
    return normalizeUnhideResponse(response.data, propertyId);
  } catch (error) {
    throwHiddenPropertyError(error, HIDDEN_PROPERTY_COPY.unhideError);
  }
}
