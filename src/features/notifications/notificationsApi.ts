import axios from "axios";
import { normalizeNotificationsList } from "@/features/notifications/notificationsNormalizer";
import type { NotificationsListResult } from "@/features/notifications/notificationsApi.types";
import { getBearerAuthContext } from "@/shared/lib/auth";
import { ApiError, parseStandardApiError } from "@/shared/lib/apiError";

type RequestOptions = {
  signal?: AbortSignal;
};

export async function fetchNotifications(
  requestOptions?: RequestOptions,
): Promise<NotificationsListResult> {
  const { baseUrl, headers } = getBearerAuthContext();

  try {
    const response = await axios.get(`${baseUrl}/notifications`, {
      headers,
      signal: requestOptions?.signal,
    });
    return {
      notifications: normalizeNotificationsList(response.data),
    };
  } catch (error) {
    if (axios.isAxiosError(error) && error.code === "ERR_CANCELED") {
      throw error;
    }
    if (axios.isAxiosError(error)) {
      const status = error.response?.status ?? 500;
      const fallback =
        status === 401
          ? "ავტორიზაცია საჭიროა."
          : "შეტყობინებების ჩატვირთვა ვერ მოხერხდა.";
      const parsed = parseStandardApiError(error.response?.data, status, fallback);
      throw new ApiError(parsed, fallback);
    }
    throw error;
  }
}
