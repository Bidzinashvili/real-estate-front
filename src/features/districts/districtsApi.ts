import axios from "axios";
import { ApiError, parseStandardApiError } from "@/shared/lib/apiError";
import { requireApiBaseUrl } from "@/shared/lib/auth";
import type { DistrictsResponse } from "@/features/districts/districtTypes";

export async function fetchDistricts(
  signal?: AbortSignal,
): Promise<DistrictsResponse> {
  const baseUrl = requireApiBaseUrl();

  try {
    const response = await axios.get<DistrictsResponse>(`${baseUrl}/districts`, {
      signal,
    });

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const response = error.response;
      const fallbackMessage = response
        ? `უბნების ჩატვირთვა ვერ მოხერხდა: ${response.status} ${response.statusText ?? ""}`.trim()
        : "უბნების ჩატვირთვა ვერ მოხერხდა: ქსელის შეცდომა";
      const parsedError = parseStandardApiError(
        response?.data,
        response?.status ?? 500,
        fallbackMessage,
      );
      throw new ApiError(parsedError, fallbackMessage);
    }

    throw error;
  }
}
