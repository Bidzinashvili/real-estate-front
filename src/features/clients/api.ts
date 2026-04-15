import axios from "axios";
import { getBearerAuthContext } from "@/shared/lib/auth";
import { ApiError, parseStandardApiError } from "@/shared/lib/apiError";
import { toGetClientsSearchParams } from "@/features/clients/getClientsQuery";
import type { GetClientsQuery } from "@/features/clients/getClientsQuery";
import {
  normalizeClient,
  normalizeClientDetail,
  normalizeClientsListResponse,
} from "@/features/clients/normalizers";
import type {
  Client,
  ClientDetail,
  ClientsListResponse,
  Comment,
  CreateClientPayload,
  DeleteClientCommentResponse,
  DeleteClientResponse,
  UpdateClientPayload,
} from "@/features/clients/types";
import type {
  ClientApi,
  ClientDetailApi,
  GetClientsResponse,
} from "@/features/clients/clientApi.types";

export type GetClientsRequestOptions = {
  signal?: AbortSignal;
};

export async function getClients(
  query?: GetClientsQuery,
  requestOptions?: GetClientsRequestOptions,
): Promise<ClientsListResponse> {
  const { baseUrl, headers } = getBearerAuthContext();
  const params = toGetClientsSearchParams(query);

  try {
    const res = await axios.get<GetClientsResponse>(`${baseUrl}/clients`, {
      headers,
      params,
      signal: requestOptions?.signal,
    });
    return normalizeClientsListResponse(res.data);
  } catch (error) {
    if (axios.isAxiosError(error) && error.code === "ERR_CANCELED") {
      throw error;
    }
    if (axios.isAxiosError(error)) {
      const fallback = "Could not load clients right now.";
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

export async function getClientById(id: string): Promise<ClientDetail> {
  const { baseUrl, headers } = getBearerAuthContext();

  try {
    const res = await axios.get<ClientDetailApi>(`${baseUrl}/clients/${id}`, {
      headers,
    });
    return normalizeClientDetail(res.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const fallback = "Could not load this client right now.";
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

export async function createClient(dto: CreateClientPayload): Promise<Client> {
  const { baseUrl, headers } = getBearerAuthContext();

  try {
    const res = await axios.post<ClientApi>(`${baseUrl}/clients`, dto, {
      headers: { ...headers, "Content-Type": "application/json" },
    });
    return normalizeClient(res.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status ?? 500;
      const fallback =
        status === 403
          ? "You do not have permission to create clients."
          : status === 401
            ? "You are not authenticated."
            : "Could not create this client right now.";
      const parsed = parseStandardApiError(error.response?.data, status, fallback);
      throw new ApiError(parsed, fallback);
    }
    throw error;
  }
}

export async function updateClient(
  id: string,
  dto: UpdateClientPayload,
): Promise<Client> {
  const { baseUrl, headers } = getBearerAuthContext();

  try {
    const res = await axios.patch<ClientApi>(`${baseUrl}/clients/${id}`, dto, {
      headers: { ...headers, "Content-Type": "application/json" },
    });
    return normalizeClient(res.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const fallback = "Could not save client changes right now.";
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

export async function deleteClient(id: string): Promise<DeleteClientResponse> {
  const { baseUrl, headers } = getBearerAuthContext();

  try {
    const res = await axios.delete<DeleteClientResponse>(
      `${baseUrl}/clients/${id}`,
      { headers },
    );
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const fallback = "Could not delete this client right now.";
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

export async function addClientComment(
  clientId: string,
  text: string,
): Promise<Comment> {
  const { baseUrl, headers } = getBearerAuthContext();

  try {
    const res = await axios.post<Comment>(
      `${baseUrl}/clients/${clientId}/comments`,
      { text },
      { headers: { ...headers, "Content-Type": "application/json" } },
    );
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const fallback = "Could not post comment right now.";
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

export async function addClientInternalComment(
  clientId: string,
  text: string,
): Promise<Comment> {
  const { baseUrl, headers } = getBearerAuthContext();

  try {
    const res = await axios.post<Comment>(
      `${baseUrl}/clients/${clientId}/internal-comments`,
      { text },
      { headers: { ...headers, "Content-Type": "application/json" } },
    );
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const fallback = "Could not post internal comment right now.";
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

export async function deleteClientComment(
  clientId: string,
  commentId: string,
): Promise<DeleteClientCommentResponse> {
  const { baseUrl, headers } = getBearerAuthContext();
  const encodedCommentId = encodeURIComponent(commentId);

  try {
    const res = await axios.delete<DeleteClientCommentResponse>(
      `${baseUrl}/clients/${clientId}/comments/${encodedCommentId}`,
      { headers },
    );
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const fallback = "Could not delete this comment right now.";
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

