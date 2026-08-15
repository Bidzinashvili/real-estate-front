import axios from "axios";
import { getBearerAuthContext, requireApiBaseUrl } from "@/shared/lib/auth";
import { ApiError, parseStandardApiError } from "@/shared/lib/apiError";
import { normalizeClient } from "@/features/clients/normalizers";
import type { Client, CreateClientPayload } from "@/features/clients/types";
import type { ClientApi } from "@/features/clients/clientApi.types";
import { ClientInviteLinkRequestError } from "@/features/clientInviteLinks/clientInviteLinkRequestError";
import type {
  ClientInviteCreatedResponse,
  ClientInviteLinksListResponse,
  CreateClientInviteLinkDto,
  PublicClientInviteGetResponse,
} from "@/features/clientInviteLinks/types";

const PUBLIC_INVITE_NOT_FOUND = "მოწვევის ბმული ვერ მოიძებნა.";
const PUBLIC_INVITE_GONE = "ეს ბმული ვადაგასულია ან უკვე გამოყენებულია.";
const PUBLIC_INVITE_RATE_LIMIT =
  "ძალიან ბევრი მოთხოვნაა. გთხოვთ, ცოტა ხანში სცადოთ.";
const PUBLIC_INVITE_CONFLICT =
  "ეს ბმული ახლახან გამოიყენეს. განაახლეთ გვერდი ან სთხოვეთ ახალი ბმული.";

function throwIfPublicInviteAxiosStatus(status: number, submit: boolean): void {
  switch (status) {
    case 404:
      throw new ClientInviteLinkRequestError(PUBLIC_INVITE_NOT_FOUND, status);
    case 410:
      throw new ClientInviteLinkRequestError(PUBLIC_INVITE_GONE, status);
    case 429:
      throw new ClientInviteLinkRequestError(PUBLIC_INVITE_RATE_LIMIT, status);
    case 409:
      if (submit) {
        throw new ClientInviteLinkRequestError(PUBLIC_INVITE_CONFLICT, status);
      }
      return;
    default:
      return;
  }
}

export async function createClientInviteLink(
  dto: CreateClientInviteLinkDto,
): Promise<ClientInviteCreatedResponse> {
  const { baseUrl, headers } = getBearerAuthContext();

  try {
    const res = await axios.post<ClientInviteCreatedResponse>(
      `${baseUrl}/client-invite-links`,
      dto,
      {
        headers: { ...headers, "Content-Type": "application/json" },
      },
    );
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status ?? 500;
      const fallback =
        status === 403
          ? "მოწვევის ბმულების შექმნის უფლება არ გაქვთ."
          : status === 401
            ? "ავტორიზაცია საჭიროა."
            : status === 429
              ? "ძალიან ბევრი მოთხოვნაა. გთხოვთ, ცოტა ხანში სცადოთ."
              : "მოწვევის ბმულის შექმნა ვერ მოხერხდა.";
      const parsed = parseStandardApiError(error.response?.data, status, fallback);
      throw new ApiError(parsed, fallback);
    }
    throw error;
  }
}

export type GetClientInviteLinksQuery = {
  page?: number;
  limit?: number;
};

export async function getClientInviteLinks(
  query?: GetClientInviteLinksQuery,
): Promise<ClientInviteLinksListResponse> {
  const { baseUrl, headers } = getBearerAuthContext();

  try {
    const res = await axios.get<ClientInviteLinksListResponse>(`${baseUrl}/client-invite-links`, {
      headers,
      params: {
        page: query?.page ?? 1,
        limit: query?.limit ?? 20,
      },
    });
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status ?? 500;
      const fallback =
        status === 403
          ? "მოწვევის ბმულების ნახვის უფლება არ გაქვთ."
          : status === 401
            ? "ავტორიზაცია საჭიროა."
            : status === 429
              ? "ძალიან ბევრი მოთხოვნაა. გთხოვთ, ცოტა ხანში სცადოთ."
              : "მოწვევის ბმულების ჩატვირთვა ვერ მოხერხდა.";
      const parsed = parseStandardApiError(error.response?.data, status, fallback);
      throw new ApiError(parsed, fallback);
    }
    throw error;
  }
}

export async function getPublicClientInvite(
  token: string,
): Promise<PublicClientInviteGetResponse> {
  const baseUrl = requireApiBaseUrl();

  try {
    const res = await axios.get<PublicClientInviteGetResponse>(
      `${baseUrl}/public/client-invite-links/${encodeURIComponent(token)}`,
    );
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status ?? 500;
      throwIfPublicInviteAxiosStatus(status, false);

      const fallback = "მოწვევის ფორმის ჩატვირთვა ვერ მოხერხდა.";
      const parsed = parseStandardApiError(error.response?.data, status, fallback);
      throw new ApiError(parsed, fallback);
    }
    throw error;
  }
}

export async function submitPublicClientInvite(
  token: string,
  dto: CreateClientPayload,
): Promise<Client> {
  const baseUrl = requireApiBaseUrl();

  try {
    const res = await axios.post<ClientApi>(
      `${baseUrl}/public/client-invite-links/${encodeURIComponent(token)}/submit`,
      dto,
      {
        headers: { "Content-Type": "application/json" },
      },
    );
    return normalizeClient(res.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status ?? 500;
      throwIfPublicInviteAxiosStatus(status, true);

      if (status === 400) {
        const fallback = "შეამოწმეთ ფორმა და სცადეთ ხელახლა.";
        const parsed = parseStandardApiError(error.response?.data, status, fallback);
        throw new ApiError(parsed, fallback);
      }

      const fallback = "მონაცემების გაგზავნა ვერ მოხერხდა.";
      const parsed = parseStandardApiError(error.response?.data, status, fallback);
      throw new ApiError(parsed, fallback);
    }
    throw error;
  }
}
