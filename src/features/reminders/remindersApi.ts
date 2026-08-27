import axios from "axios";
import { getApiBaseUrl, getStoredAuthToken } from "@/shared/lib/auth";
import { ApiError, parseStandardApiError } from "@/shared/lib/apiError";
import {
  normalizeDashboardRemindersList,
  type NormalizedRemindersList,
} from "@/features/reminders/dashboardReminderNormalizer";
import { emitRemindersChangedEvent } from "@/features/reminders/reminderEvents";
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

export type CreateClientReminderPayload = {
  clientId: UUID;
  notifyAt: ISODateString;
  note?: string | null;
};

export type CreateReminderPayload =
  | CreateRentalEndingReminderPayload
  | CreateCustomPropertyReminderPayload
  | CreateClientReminderPayload;

export type { GetRemindersQuery } from "@/features/reminders/remindersApiTypes";
export type { NormalizedRemindersList };

function getAuthContext() {
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

async function throwReminderApiError(error: unknown, fallback: string): Promise<never> {
  if (axios.isAxiosError(error)) {
    const parsed = parseStandardApiError(
      error.response?.data,
      error.response?.status ?? 500,
      fallback,
    );
    throw new ApiError(parsed, fallback);
  }

  throw error;
}

export async function getReminders(
  query?: GetRemindersQuery,
): Promise<NormalizedRemindersList> {
  const { baseUrl, headers } = getAuthContext();

  try {
    const response = await axios.get<GetRemindersResponse>(`${baseUrl}/reminders`, {
      headers,
      params: toRemindersSearchParams(query),
    });
    return normalizeDashboardRemindersList(response.data);
  } catch (error) {
    return throwReminderApiError(error, "შეხსენებების ჩატვირთვა ვერ მოხერხდა.");
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
    emitRemindersChangedEvent();
  } catch (error) {
    return throwReminderApiError(error, "შეხსენების დაყენება ვერ მოხერხდა.");
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
    emitRemindersChangedEvent();
  } catch (error) {
    return throwReminderApiError(error, "შეხსენების განახლება ვერ მოხერხდა.");
  }
}

export async function deleteReminder(reminderId: string): Promise<void> {
  const { baseUrl, headers } = getAuthContext();
  const encodedId = encodeReminderPathSegment(reminderId);

  try {
    await axios.delete(`${baseUrl}/reminders/${encodedId}`, {
      headers,
    });
    emitRemindersChangedEvent();
  } catch (error) {
    return throwReminderApiError(error, "შეხსენების წაშლა ვერ მოხერხდა.");
  }
}

export async function dismissReminder(reminderId: string): Promise<void> {
  const { baseUrl, headers } = getAuthContext();
  const encodedId = encodeReminderPathSegment(reminderId);

  try {
    await axios.post(`${baseUrl}/reminders/${encodedId}/dismiss`, undefined, {
      headers,
    });
    emitRemindersChangedEvent();
  } catch (error) {
    return throwReminderApiError(error, "შეხსენების დამალვა ვერ მოხერხდა.");
  }
}

export async function snoozeReminder(
  reminderId: string,
  minutes: number,
): Promise<void> {
  const { baseUrl, headers } = getAuthContext();
  const encodedId = encodeReminderPathSegment(reminderId);
  const roundedMinutes = Math.round(minutes);

  try {
    await axios.post(
      `${baseUrl}/reminders/${encodedId}/snooze`,
      { minutes: roundedMinutes },
      {
        headers: {
          ...headers,
          "Content-Type": "application/json",
        },
      },
    );
    emitRemindersChangedEvent();
  } catch (error) {
    return throwReminderApiError(error, "შეხსენების გადადება ვერ მოხერხდა.");
  }
}
