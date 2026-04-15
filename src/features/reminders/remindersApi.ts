import axios from "axios";
import { getApiBaseUrl, getStoredAuthToken } from "@/shared/lib/auth";
import { ApiError, parseStandardApiError } from "@/shared/lib/apiError";
import {
  normalizeDashboardRemindersList,
  type DashboardReminderRow,
} from "@/features/reminders/dashboardReminderNormalizer";
import type {
  GetRemindersQuery,
  GetRemindersResponse,
  ISODateString,
  PatchReminderBody,
  UUID,
} from "@/features/reminders/remindersApiTypes";

export type CreateRentalEndingReminderPayload = {
  propertyId: UUID;
  kind: "RENTAL_PERIOD_ENDING";
  notifyAt: ISODateString;
  rentalDurationMonths: number;
  rentalPeriodStartedAt: ISODateString;
  rentalPeriodEndsAt: ISODateString;
};

export type CreateCustomPropertyReminderPayload = {
  propertyId: UUID;
  kind: "CUSTOM";
  notifyAt: ISODateString;
  note?: string | null;
};

export type CreateReminderPayload =
  | CreateRentalEndingReminderPayload
  | CreateCustomPropertyReminderPayload;

export type { GetRemindersQuery } from "@/features/reminders/remindersApiTypes";

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

function toRemindersSearchParams(
  query: GetRemindersQuery | undefined,
): Record<string, string | number> | undefined {
  if (query === undefined) {
    return undefined;
  }

  const params: Record<string, string | number> = {};

  if (query.timing !== undefined) {
    params.timing = query.timing;
  }
  if (query.targetType !== undefined) {
    params.targetType = query.targetType;
  }
  if (query.propertyId !== undefined && query.propertyId.trim() !== "") {
    params.propertyId = query.propertyId.trim();
  }
  if (query.clientId !== undefined && query.clientId.trim() !== "") {
    params.clientId = query.clientId.trim();
  }
  if (query.page !== undefined) {
    params.page = query.page;
  }
  if (query.limit !== undefined) {
    params.limit = query.limit;
  }

  return Object.keys(params).length > 0 ? params : undefined;
}

function encodeReminderPathSegment(reminderId: string): string {
  return encodeURIComponent(reminderId);
}

export async function getReminders(
  query?: GetRemindersQuery,
): Promise<DashboardReminderRow[]> {
  const { baseUrl, headers } = getAuthContext();

  try {
    const response = await axios.get<GetRemindersResponse>(`${baseUrl}/reminders`, {
      headers,
      params: toRemindersSearchParams(query),
    });
    return normalizeDashboardRemindersList(response.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const fallback = "Could not load reminders right now.";
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

export async function createReminder(
  payload: CreateReminderPayload,
): Promise<void> {
  const { baseUrl, headers } = getAuthContext();

  try {
    await axios.post(`${baseUrl}/reminders`, payload, {
      headers: {
        ...headers,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const fallback = "Could not schedule this reminder right now.";
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

export async function patchReminder(
  reminderId: string,
  body: PatchReminderBody,
): Promise<void> {
  const { baseUrl, headers } = getAuthContext();
  const encodedId = encodeReminderPathSegment(reminderId);

  try {
    await axios.patch(`${baseUrl}/reminders/${encodedId}`, body, {
      headers: {
        ...headers,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const fallback = "Could not update this reminder right now.";
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

export async function deleteReminder(reminderId: string): Promise<void> {
  const { baseUrl, headers } = getAuthContext();
  const encodedId = encodeReminderPathSegment(reminderId);

  try {
    await axios.delete(`${baseUrl}/reminders/${encodedId}`, {
      headers,
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const fallback = "Could not remove this reminder right now.";
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
