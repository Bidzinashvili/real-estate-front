import axios from "axios";
import { getBearerAuthContext } from "@/shared/lib/auth";
import { ApiError, parseStandardApiError } from "@/shared/lib/apiError";
import {
  toGetClientProfilesSearchParams,
  type GetClientProfilesQuery,
} from "@/features/clientProfiles/getClientProfilesQuery";
import {
  CLIENT_PROFILE_IDENTITY_CONFLICT,
  IDENTITY_CONFLICT_MESSAGE,
} from "@/features/clientProfiles/identityConflict";
import {
  emptyLookupResult,
  normalizeClientProfile,
  normalizeClientProfileLookupResult,
  normalizeClientProfilesListResponse,
} from "@/features/clientProfiles/normalizers";
import type {
  BlacklistClientProfilePayload,
  ClientProfile,
  ClientProfileLookupResult,
  ClientProfilesListResponse,
  CreateClientProfilePhonePayload,
  LinkClientNotePayload,
  MergeClientProfilePayload,
  UpdateClientProfilePayload,
  UpdateClientProfilePhonePayload,
} from "@/features/clientProfiles/types";

export type GetClientProfilesRequestOptions = {
  signal?: AbortSignal;
};

function throwClientProfileApiError(
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
    const isIdentityConflict =
      parsed.error === CLIENT_PROFILE_IDENTITY_CONFLICT ||
      parsed.code === CLIENT_PROFILE_IDENTITY_CONFLICT;
    const message = isIdentityConflict
      ? IDENTITY_CONFLICT_MESSAGE
      : (fallbackByStatus[status] ?? fallback);
    throw new ApiError(
      {
        ...parsed,
        message: isIdentityConflict ? IDENTITY_CONFLICT_MESSAGE : parsed.message,
      },
      message,
    );
  }
  throw error;
}

async function readProfileFromResponse(
  data: unknown,
  profileId: string,
): Promise<ClientProfile> {
  const profile = normalizeClientProfile(data);
  if (profile) {
    return profile;
  }
  return getClientProfileById(profileId);
}

export async function getClientProfiles(
  query?: GetClientProfilesQuery,
  requestOptions?: GetClientProfilesRequestOptions,
): Promise<ClientProfilesListResponse> {
  const { baseUrl, headers } = getBearerAuthContext();
  const params = toGetClientProfilesSearchParams(query);

  try {
    const response = await axios.get(`${baseUrl}/client-profiles`, {
      headers,
      params,
      signal: requestOptions?.signal,
    });
    return normalizeClientProfilesListResponse(response.data);
  } catch (error) {
    throwClientProfileApiError(
      error,
      {
        403: "კლიენტის პროფილების ნახვის უფლება არ გაქვთ.",
      },
      "კლიენტის პროფილების ჩატვირთვა ვერ მოხერხდა.",
    );
  }
}

export async function getClientProfileById(
  profileId: string,
): Promise<ClientProfile> {
  const { baseUrl, headers } = getBearerAuthContext();

  try {
    const response = await axios.get(`${baseUrl}/client-profiles/${profileId}`, {
      headers,
    });
    const profile = normalizeClientProfile(response.data);
    if (!profile) {
      throw new ApiError(
        {
          message: "კლიენტის პროფილი ვერ მოიძებნა.",
          error: "Not Found",
          statusCode: 404,
        },
        "კლიენტის პროფილი ვერ მოიძებნა.",
      );
    }
    return profile;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throwClientProfileApiError(
      error,
      {
        403: "ამ კლიენტის პროფილზე წვდომა არ გაქვთ.",
        404: "კლიენტის პროფილი ვერ მოიძებნა.",
      },
      "კლიენტის პროფილის ჩატვირთვა ვერ მოხერხდა.",
    );
  }
}

export async function lookupClientProfileByPhone(
  phone: string,
  requestOptions?: GetClientProfilesRequestOptions,
): Promise<ClientProfileLookupResult> {
  const { baseUrl, headers } = getBearerAuthContext();

  try {
    const response = await axios.get(`${baseUrl}/client-profiles/lookup`, {
      headers,
      params: { phone },
      signal: requestOptions?.signal,
    });
    return normalizeClientProfileLookupResult(response.data);
  } catch (error) {
    if (
      axios.isAxiosError(error) &&
      (error.response?.status === 404 || error.response?.status === 400)
    ) {
      return emptyLookupResult();
    }
    throwClientProfileApiError(
      error,
      {
        403: "კლიენტის პროფილის ძებნის უფლება არ გაქვთ.",
      },
      "კლიენტის პროფილის ძებნა ვერ მოხერხდა.",
    );
  }
}

export async function updateClientProfile(
  profileId: string,
  payload: UpdateClientProfilePayload,
): Promise<ClientProfile> {
  const { baseUrl, headers } = getBearerAuthContext();

  try {
    const response = await axios.patch(
      `${baseUrl}/client-profiles/${profileId}`,
      payload,
      {
        headers: { ...headers, "Content-Type": "application/json" },
      },
    );
    return readProfileFromResponse(response.data, profileId);
  } catch (error) {
    throwClientProfileApiError(
      error,
      {
        400: "პროფილის მონაცემები არასწორია.",
        403: "ამ კლიენტის პროფილის შეცვლის უფლება არ გაქვთ.",
        404: "კლიენტის პროფილი ვერ მოიძებნა.",
      },
      "კლიენტის პროფილის შენახვა ვერ მოხერხდა.",
    );
  }
}

export async function addClientProfilePhone(
  profileId: string,
  payload: CreateClientProfilePhonePayload,
): Promise<ClientProfile> {
  const { baseUrl, headers } = getBearerAuthContext();

  try {
    const response = await axios.post(
      `${baseUrl}/client-profiles/${profileId}/phones`,
      payload,
      {
        headers: { ...headers, "Content-Type": "application/json" },
      },
    );
    return readProfileFromResponse(response.data, profileId);
  } catch (error) {
    throwClientProfileApiError(
      error,
      {
        400: "ტელეფონის ნომერი არასწორია.",
        403: "ამ კლიენტის პროფილზე წვდომა არ გაქვთ.",
        404: "კლიენტის პროფილი ვერ მოიძებნა.",
        409: "ეს ნომერი უკვე სხვა კლიენტის პროფილთან არის დაკავშირებული.",
      },
      "ნომრის დამატება ვერ მოხერხდა.",
    );
  }
}

export async function updateClientProfilePhone(
  profileId: string,
  phoneId: string,
  payload: UpdateClientProfilePhonePayload,
): Promise<ClientProfile> {
  const { baseUrl, headers } = getBearerAuthContext();

  try {
    const response = await axios.patch(
      `${baseUrl}/client-profiles/${profileId}/phones/${phoneId}`,
      payload,
      {
        headers: { ...headers, "Content-Type": "application/json" },
      },
    );
    return readProfileFromResponse(response.data, profileId);
  } catch (error) {
    throwClientProfileApiError(
      error,
      {
        400: "ტელეფონის ნომერი არასწორია.",
        403: "ამ კლიენტის პროფილზე წვდომა არ გაქვთ.",
        404: "ნომერი ვერ მოიძებნა.",
        409: "ეს ნომერი უკვე სხვა კლიენტის პროფილთან არის დაკავშირებული.",
      },
      "ნომრის განახლება ვერ მოხერხდა.",
    );
  }
}

export async function deleteClientProfilePhone(
  profileId: string,
  phoneId: string,
): Promise<ClientProfile> {
  const { baseUrl, headers } = getBearerAuthContext();

  try {
    const response = await axios.delete(
      `${baseUrl}/client-profiles/${profileId}/phones/${phoneId}`,
      { headers },
    );
    return readProfileFromResponse(response.data, profileId);
  } catch (error) {
    throwClientProfileApiError(
      error,
      {
        400: "ბოლო ნომრის წაშლა შეუძლებელია.",
        403: "ამ კლიენტის პროფილზე წვდომა არ გაქვთ.",
        404: "ნომერი ვერ მოიძებნა.",
      },
      "ნომრის წაშლა ვერ მოხერხდა.",
    );
  }
}

export async function linkClientNoteToProfile(
  profileId: string,
  payload: LinkClientNotePayload,
): Promise<ClientProfile> {
  const { baseUrl, headers } = getBearerAuthContext();

  try {
    const response = await axios.post(
      `${baseUrl}/client-profiles/${profileId}/clients`,
      payload,
      {
        headers: { ...headers, "Content-Type": "application/json" },
      },
    );
    return readProfileFromResponse(response.data, profileId);
  } catch (error) {
    throwClientProfileApiError(
      error,
      {
        400: "კლიენტის მიბმა ვერ მოხერხდა.",
        403: "ამ კლიენტის პროფილთან მიბმის უფლება არ გაქვთ.",
        404: "კლიენტი ან პროფილი ვერ მოიძებნა.",
        409: "კლიენტის მიბმა ამ პროფილთან ვერ მოხერხდა.",
      },
      "კლიენტის პროფილთან მიბმა ვერ მოხერხდა.",
    );
  }
}

export async function blacklistClientProfile(
  profileId: string,
  payload: BlacklistClientProfilePayload,
): Promise<ClientProfile> {
  const { baseUrl, headers } = getBearerAuthContext();

  try {
    const response = await axios.post(
      `${baseUrl}/client-profiles/${profileId}/blacklist`,
      payload,
      {
        headers: { ...headers, "Content-Type": "application/json" },
      },
    );
    return readProfileFromResponse(response.data, profileId);
  } catch (error) {
    throwClientProfileApiError(
      error,
      {
        400: "შავ სიაში დასამატებლად მიზეზი სავალდებულოა.",
        403: "შავ სიაში დამატების უფლება არ გაქვთ.",
        404: "კლიენტის პროფილი ვერ მოიძებნა.",
      },
      "შავ სიაში დამატება ვერ მოხერხდა.",
    );
  }
}

export async function unblacklistClientProfile(
  profileId: string,
): Promise<ClientProfile> {
  const { baseUrl, headers } = getBearerAuthContext();

  try {
    const response = await axios.delete(
      `${baseUrl}/client-profiles/${profileId}/blacklist`,
      { headers },
    );
    return readProfileFromResponse(response.data, profileId);
  } catch (error) {
    throwClientProfileApiError(
      error,
      {
        403: "შავი სიიდან ამოღების უფლება არ გაქვთ.",
        404: "კლიენტის პროფილი ვერ მოიძებნა.",
      },
      "შავი სიიდან ამოღება ვერ მოხერხდა.",
    );
  }
}

export async function mergeClientProfiles(
  targetProfileId: string,
  payload: MergeClientProfilePayload,
): Promise<ClientProfile> {
  const { baseUrl, headers } = getBearerAuthContext();

  try {
    const response = await axios.post(
      `${baseUrl}/client-profiles/${targetProfileId}/merge`,
      payload,
      {
        headers: { ...headers, "Content-Type": "application/json" },
      },
    );
    return readProfileFromResponse(response.data, targetProfileId);
  } catch (error) {
    throwClientProfileApiError(
      error,
      {
        400: "პროფილების გაერთიანება ვერ მოხერხდა.",
        403: "პროფილების გაერთიანება მხოლოდ ადმინისტრატორს შეუძლია.",
        404: "კლიენტის პროფილი ვერ მოიძებნა.",
        409: "პროფილების გაერთიანება ვერ მოხერხდა.",
      },
      "პროფილების გაერთიანება ვერ მოხერხდა.",
    );
  }
}
