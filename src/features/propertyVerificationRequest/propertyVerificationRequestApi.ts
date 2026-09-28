import axios from "axios";
import { getBearerAuthContext } from "@/shared/lib/auth";
import type { PropertyVerificationRequestDto } from "@/features/propertyVerificationRequest/propertyVerificationRequestApi.types";
import {
  PROPERTY_VERIFICATION_REQUEST_ERROR,
  PROPERTY_VERIFICATION_REQUEST_ERROR_BY_STATUS,
} from "@/features/propertyVerificationRequest/propertyVerificationRequestErrorMessages";
import { emitNotificationsChangedEvent } from "@/features/notifications/notificationEvents";
import { ApiError, parseStandardApiError } from "@/shared/lib/apiError";
import type { JsonObject } from "@/shared/lib/jsonValue";
import { asNullableString, asString } from "@/shared/lib/jsonValue";

function normalizePropertyVerificationRequest(
  payload: unknown,
): PropertyVerificationRequestDto {
  if (typeof payload !== "object" || payload === null) {
    throw new Error(PROPERTY_VERIFICATION_REQUEST_ERROR.generic);
  }
  const record = payload as JsonObject;
  const statusRaw = asString(record.status).trim();
  const status =
    statusRaw === "PENDING" || statusRaw === "RESOLVED" || statusRaw === "CANCELLED"
      ? statusRaw
      : "PENDING";

  return {
    id: asString(record.id).trim(),
    propertyId: asString(record.propertyId).trim(),
    requesterId: asString(record.requesterId).trim(),
    ownerUserId: asString(record.ownerUserId).trim(),
    status,
    createdAt: asString(record.createdAt).trim(),
    resolvedAt: asNullableString(record.resolvedAt),
  };
}

export async function requestPropertyVerification(
  propertyId: string,
): Promise<PropertyVerificationRequestDto> {
  const { baseUrl, headers } = getBearerAuthContext();

  try {
    const response = await axios.post(
      `${baseUrl}/properties/${propertyId}/request-verification`,
      undefined,
      { headers },
    );
    emitNotificationsChangedEvent();
    return normalizePropertyVerificationRequest(response.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status ?? 500;
      const fallback =
        PROPERTY_VERIFICATION_REQUEST_ERROR_BY_STATUS[status] ??
        PROPERTY_VERIFICATION_REQUEST_ERROR.generic;
      const parsed = parseStandardApiError(error.response?.data, status, fallback);
      throw new ApiError(parsed, fallback);
    }
    throw error;
  }
}
