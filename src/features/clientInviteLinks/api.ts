import axios from "axios";
import { getBearerAuthContext, requireApiBaseUrl } from "@/shared/lib/auth";
import { ApiError, parseStandardApiError } from "@/shared/lib/apiError";
import { normalizeClient } from "@/features/clients/normalizers";
import type { Client, CreateClientDto } from "@/features/clients/types";
import { ClientInviteLinkRequestError } from "@/features/clientInviteLinks/clientInviteLinkRequestError";
import type {
  ClientInviteCreatedResponse,
  ClientInviteLinksListResponse,
  CreateClientInviteLinkDto,
  PublicClientInviteGetResponse,
} from "@/features/clientInviteLinks/types";

const PUBLIC_INVITE_NOT_FOUND = "This invite link was not found.";
const PUBLIC_INVITE_GONE = "This link has expired or has already been used.";
const PUBLIC_INVITE_RATE_LIMIT =
  "Too many requests. Please wait a few minutes and try again.";
const PUBLIC_INVITE_CONFLICT =
  "This link was just used. Refresh the page or ask for a new link.";

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
          ? "You do not have permission to create invite links."
          : status === 401
            ? "You are not authenticated."
            : status === 429
              ? "Too many requests. Please wait and try again."
              : "Could not create this invite link right now.";
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
          ? "You do not have permission to view invite links."
          : status === 401
            ? "You are not authenticated."
            : status === 429
              ? "Too many requests. Please wait and try again."
              : "Could not load invite links right now.";
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

      const fallback = "Could not load this invite form right now.";
      const parsed = parseStandardApiError(error.response?.data, status, fallback);
      throw new ApiError(parsed, fallback);
    }
    throw error;
  }
}

export async function submitPublicClientInvite(
  token: string,
  dto: CreateClientDto,
): Promise<Client> {
  const baseUrl = requireApiBaseUrl();

  try {
    const res = await axios.post<Client>(
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
        const fallback = "Please check the form and try again.";
        const parsed = parseStandardApiError(error.response?.data, status, fallback);
        throw new ApiError(parsed, fallback);
      }

      const fallback = "Could not submit your details right now.";
      const parsed = parseStandardApiError(error.response?.data, status, fallback);
      throw new ApiError(parsed, fallback);
    }
    throw error;
  }
}
