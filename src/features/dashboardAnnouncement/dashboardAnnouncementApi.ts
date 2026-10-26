import axios from "axios";
import { getApiBaseUrl, getStoredAuthToken } from "@/shared/lib/auth";
import { ApiError, parseStandardApiError } from "@/shared/lib/apiError";
import { asString, isJsonObject } from "@/shared/lib/jsonValue";
import type { JsonValue } from "@/shared/lib/jsonValue";
import {
  DASHBOARD_ANNOUNCEMENT_API_PATH,
  type DashboardAnnouncement,
} from "@/features/dashboardAnnouncement/types";

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

function normalizeAnnouncementResponse(data: JsonValue): DashboardAnnouncement | null {
  if (!isJsonObject(data)) {
    return null;
  }
  return { message: asString(data.message) };
}

export async function getDashboardAnnouncement(): Promise<DashboardAnnouncement> {
  const { baseUrl, headers } = getAuthContext();

  try {
    const response = await axios.get<unknown>(
      `${baseUrl}${DASHBOARD_ANNOUNCEMENT_API_PATH}`,
      { headers },
    );
    const normalized = normalizeAnnouncementResponse(response.data as JsonValue);
    if (!normalized) {
      throw new Error("Unexpected dashboard announcement response shape");
    }
    return normalized;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status ?? 500;
      const parsed = parseStandardApiError(
        error.response?.data,
        status,
        "შეტყობინების ჩატვირთვა ვერ მოხერხდა.",
      );
      throw new ApiError(parsed, "შეტყობინების ჩატვირთვა ვერ მოხერხდა.");
    }
    throw error;
  }
}

export type UpdateDashboardAnnouncementPayload = {
  message: string;
};

export async function updateDashboardAnnouncement(
  payload: UpdateDashboardAnnouncementPayload,
): Promise<DashboardAnnouncement> {
  const { baseUrl, headers } = getAuthContext();

  try {
    const response = await axios.patch<unknown>(
      `${baseUrl}${DASHBOARD_ANNOUNCEMENT_API_PATH}`,
      payload,
      { headers },
    );
    const normalized = normalizeAnnouncementResponse(response.data as JsonValue);
    if (!normalized) {
      throw new Error("Unexpected dashboard announcement response shape");
    }
    return normalized;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status ?? 500;
      const parsed = parseStandardApiError(
        error.response?.data,
        status,
        "შეტყობინების შენახვა ვერ მოხერხდა.",
      );
      throw new ApiError(parsed, "შეტყობინების შენახვა ვერ მოხერხდა.");
    }
    throw error;
  }
}
