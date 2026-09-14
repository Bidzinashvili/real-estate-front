import axios from "axios";
import { getBearerAuthContext } from "@/shared/lib/auth";
import { ApiError, parseStandardApiError } from "@/shared/lib/apiError";
import {
  CLIENT_PROFILE_IDENTITY_CONFLICT,
  IDENTITY_CONFLICT_MESSAGE,
} from "@/features/clientProfiles/identityConflict";
import { toGetClientsSearchParams, type GetClientsQuery } from "@/features/clients/getClientsQuery";
import { requestedAdminModeQuery } from "@/features/adminMode/requestedAdminModeQuery";
import {
  normalizeClient,
  normalizeClientDetail,
  normalizeClientsListResponse,
} from "@/features/clients/normalizers";
import { emitRecordMutationEvents } from "@/features/lifecycle/recordsChangedEvent";
import { emitNoteOpenedEvent } from "@/features/noteLastOpened/noteOpenedEvent";
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

function throwClientMutationError(
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
    throw new ApiError(
      {
        ...parsed,
        message: isIdentityConflict ? IDENTITY_CONFLICT_MESSAGE : parsed.message,
      },
      isIdentityConflict
        ? IDENTITY_CONFLICT_MESSAGE
        : (fallbackByStatus[status] ?? fallback),
    );
  }
  throw error;
}

export async function getClients(
  query?: GetClientsQuery,
  requestOptions?: GetClientsRequestOptions,
): Promise<ClientsListResponse> {
  const { baseUrl, headers } = getBearerAuthContext();
  const params = toGetClientsSearchParams({
    ...query,
    ...requestedAdminModeQuery(),
  });

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
      const fallback = "კლიენტების ჩატვირთვა ვერ მოხერხდა.";
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
      params: requestedAdminModeQuery(),
    });
    return normalizeClientDetail(res.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status ?? 500;
      const fallback =
        status === 403
          ? "ამ კლიენტზე წვდომა არ გაქვთ"
          : "კლიენტის ჩატვირთვა ვერ მოხერხდა.";
      const parsed = parseStandardApiError(
        error.response?.data,
        status,
        fallback,
      );
      throw new ApiError(parsed, fallback);
    }
    throw error;
  }
}

export async function markClientOpened(
  id: string,
): Promise<{ id: string; noteLastOpenedAt: string | null }> {
  const { baseUrl, headers } = getBearerAuthContext();

  try {
    const res = await axios.post(`${baseUrl}/clients/${id}/opened`, undefined, {
      headers,
    });
    emitNoteOpenedEvent();
    const payload = res.data as { id?: unknown; noteLastOpenedAt?: unknown };
    return {
      id: typeof payload.id === "string" ? payload.id : id,
      noteLastOpenedAt:
        typeof payload.noteLastOpenedAt === "string" ? payload.noteLastOpenedAt : null,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status ?? 500;
      const fallback =
        status === 403
          ? "ამ კლიენტის გახსნის აღნიშვნის უფლება არ გაქვთ"
          : "კლიენტის გახსნის აღნიშვნა ვერ მოხერხდა.";
      const parsed = parseStandardApiError(
        error.response?.data,
        status,
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
    emitRecordMutationEvents();
    return normalizeClient(res.data);
  } catch (error) {
    throwClientMutationError(
      error,
      {
        400: "კლიენტის მონაცემები არასწორია.",
        401: "ავტორიზაცია საჭიროა.",
        403: "კლიენტების შექმნის უფლება არ გაქვთ.",
        409: "ეს ნომერი უკვე სხვა კლიენტის პროფილთან არის დაკავშირებული.",
      },
      "კლიენტის შექმნა ვერ მოხერხდა.",
    );
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
    emitRecordMutationEvents();
    return normalizeClient(res.data);
  } catch (error) {
    throwClientMutationError(
      error,
      {
        400: "კლიენტის მონაცემები არასწორია.",
        403: "ამ კლიენტზე წვდომა არ გაქვთ",
        404: "კლიენტი ვერ მოიძებნა.",
        409: "ეს ნომერი უკვე სხვა კლიენტის პროფილთან არის დაკავშირებული.",
      },
      "კლიენტის ცვლილებების შენახვა ვერ მოხერხდა.",
    );
  }
}

export async function verifyClient(id: string): Promise<Client> {
  const { baseUrl, headers } = getBearerAuthContext();

  try {
    const res = await axios.post<ClientApi>(
      `${baseUrl}/clients/${id}/verify`,
      {},
      {
        headers: { ...headers, "Content-Type": "application/json" },
      },
    );
    emitRecordMutationEvents();
    return normalizeClient(res.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status ?? 500;
      const fallback =
        status === 403
          ? "ამ კლიენტის გადამოწმების უფლება არ გაქვთ"
          : "კლიენტის გადამოწმება ვერ მოხერხდა.";
      const parsed = parseStandardApiError(
        error.response?.data,
        status,
        fallback,
      );
      throw new ApiError(parsed, fallback);
    }
    throw error;
  }
}

async function postClientArchiveAction(
  id: string,
  action: "archive" | "unarchive",
): Promise<Client> {
  const { baseUrl, headers } = getBearerAuthContext();
  const isRestore = action === "unarchive";
  const fallbackByStatus: Record<number, string> = {
    403: isRestore
      ? "ამ კლიენტის არქივიდან დაბრუნების უფლება არ გაქვთ"
      : "ამ კლიენტის დაარქივების უფლება არ გაქვთ",
    404: "კლიენტი ვერ მოიძებნა.",
  };

  try {
    const res = await axios.post<ClientApi>(
      `${baseUrl}/clients/${id}/${action}`,
      {},
      {
        headers: {
          ...headers,
          "Content-Type": "application/json",
        },
      },
    );
    emitRecordMutationEvents();
    return normalizeClient(res.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status ?? 500;
      const fallback =
        fallbackByStatus[status] ??
        (isRestore
          ? "კლიენტის არქივიდან დაბრუნება ვერ მოხერხდა."
          : "კლიენტის დაარქივება ვერ მოხერხდა.");
      const parsed = parseStandardApiError(
        error.response?.data,
        status,
        fallback,
      );
      throw new ApiError(parsed, fallback);
    }
    throw error;
  }
}

export async function archiveClient(id: string): Promise<Client> {
  return postClientArchiveAction(id, "archive");
}

export async function unarchiveClient(id: string): Promise<Client> {
  return postClientArchiveAction(id, "unarchive");
}

export async function deleteClient(id: string): Promise<DeleteClientResponse> {
  const { baseUrl, headers } = getBearerAuthContext();

  try {
    const res = await axios.delete<DeleteClientResponse>(
      `${baseUrl}/clients/${id}`,
      { headers },
    );
    emitRecordMutationEvents();
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status ?? 500;
      const fallbackByStatus: Record<number, string> = {
        403: "ამ კლიენტის წაშლის უფლება არ გაქვთ",
        404: "კლიენტი ვერ მოიძებნა.",
      };
      const fallback = fallbackByStatus[status] ?? "კლიენტის წაშლა ვერ მოხერხდა.";
      const parsed = parseStandardApiError(
        error.response?.data,
        status,
        fallback,
      );
      throw new ApiError(parsed, fallback);
    }
    throw error;
  }
}

export async function restoreClient(id: string): Promise<Client> {
  const { baseUrl, headers } = getBearerAuthContext();

  try {
    const res = await axios.post<ClientApi>(
      `${baseUrl}/clients/${id}/restore`,
      {},
      {
        headers: {
          ...headers,
          "Content-Type": "application/json",
        },
      },
    );
    emitRecordMutationEvents();
    return normalizeClient(res.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status ?? 500;
      const fallbackByStatus: Record<number, string> = {
        403: "ამ კლიენტის აღდგენის უფლება არ გაქვთ",
        404: "კლიენტი ვერ მოიძებნა.",
      };
      const fallback = fallbackByStatus[status] ?? "კლიენტის აღდგენა ვერ მოხერხდა.";
      const parsed = parseStandardApiError(
        error.response?.data,
        status,
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
      const fallback = "კომენტარის გაგზავნა ვერ მოხერხდა.";
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
      const fallback = "შიდა კომენტარის გაგზავნა ვერ მოხერხდა.";
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
      const fallback = "კომენტარის წაშლა ვერ მოხერხდა.";
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

