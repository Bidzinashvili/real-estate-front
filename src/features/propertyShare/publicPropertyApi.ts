import axios from "axios";
import { requireApiBaseUrl } from "@/shared/lib/auth";
import { ApiError, parseStandardApiError } from "@/shared/lib/apiError";
import { normalizePublicProperty } from "@/features/propertyShare/normalizePublicProperty";
import { PublicPropertyRequestError } from "@/features/propertyShare/publicPropertyRequestError";
import type { PublicProperty } from "@/features/propertyShare/publicPropertyTypes";

export async function getPublicProperty(propertyId: string): Promise<PublicProperty> {
  const baseUrl = requireApiBaseUrl();

  try {
    const response = await axios.get<unknown>(
      `${baseUrl}/public/properties/${encodeURIComponent(propertyId)}`,
    );
    const normalized = normalizePublicProperty(response.data);
    if (!normalized) {
      throw new PublicPropertyRequestError("განცხადების ჩატვირთვა ვერ მოხერხდა.", 500);
    }
    return normalized;
  } catch (error) {
    if (error instanceof PublicPropertyRequestError) {
      throw error;
    }

    if (axios.isAxiosError(error)) {
      const status = error.response?.status ?? 500;
      if (status === 404) {
        throw new PublicPropertyRequestError("განცხადება ვერ მოიძებნა", 404);
      }
      if (status === 429) {
        throw new PublicPropertyRequestError(
          "ძალიან ბევრი მოთხოვნაა. გთხოვთ, ცოტა ხანში სცადოთ.",
          429,
        );
      }

      const fallback = "განცხადების ჩატვირთვა ვერ მოხერხდა.";
      const parsed = parseStandardApiError(error.response?.data, status, fallback);
      throw new ApiError(parsed, fallback);
    }

    throw error;
  }
}
