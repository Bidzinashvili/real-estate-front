import axios from "axios";
import { getBearerAuthContext } from "@/shared/lib/auth";
import { ApiError, parseStandardApiError } from "@/shared/lib/apiError";
import { emitRecordMutationEvents } from "@/features/lifecycle/recordsChangedEvent";
import type { PermanentDeleteResponse } from "@/features/lifecycle/softDeleteTypes";
import {
  normalizeTrashClient,
  normalizeTrashClientList,
  normalizeTrashProperty,
  normalizeTrashPropertyList,
  normalizeTrashSummary,
  readArchivedAt,
} from "@/features/adminTrash/normalizers";
import type {
  TrashClientRecord,
  TrashListQuery,
  TrashListResult,
  TrashPropertyRecord,
  TrashSummary,
} from "@/features/adminTrash/types";

function throwTrashError(
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
    throw new ApiError(parsed, fallbackByStatus[status] ?? fallback);
  }
  throw error;
}

function toTrashSearchParams(query?: TrashListQuery): Record<string, string | number> {
  const params: Record<string, string | number> = {};
  if (query?.page !== undefined) {
    params.page = query.page;
  }
  if (query?.limit !== undefined) {
    params.limit = query.limit;
  }
  if (query?.search && query.search.trim() !== "") {
    params.search = query.search.trim();
  }
  if (query?.sortBy) {
    params.sortBy = query.sortBy;
  }
  if (query?.order) {
    params.order = query.order;
  }
  return params;
}

export async function getAdminTrashSummary(options?: {
  signal?: AbortSignal;
}): Promise<TrashSummary> {
  const { baseUrl, headers } = getBearerAuthContext();

  try {
    const res = await axios.get(`${baseUrl}/admin/trash`, {
      headers,
      signal: options?.signal,
    });
    return normalizeTrashSummary(res.data);
  } catch (error) {
    throwTrashError(
      error,
      {
        403: "ნაგვის ყუთზე წვდომა არ გაქვთ",
      },
      "ნაგვის ყუთის ჩატვირთვა ვერ მოხერხდა.",
    );
  }
}

export async function getAdminTrashProperties(
  query?: TrashListQuery,
  options?: { signal?: AbortSignal },
): Promise<TrashListResult<TrashPropertyRecord>> {
  const { baseUrl, headers } = getBearerAuthContext();

  try {
    const res = await axios.get(`${baseUrl}/admin/trash/properties`, {
      headers,
      params: toTrashSearchParams(query),
      signal: options?.signal,
    });
    return normalizeTrashPropertyList(res.data);
  } catch (error) {
    throwTrashError(
      error,
      {
        403: "ნაგვის ყუთზე წვდომა არ გაქვთ",
      },
      "წაშლილი განცხადებების ჩატვირთვა ვერ მოხერხდა.",
    );
  }
}

export async function getAdminTrashClients(
  query?: TrashListQuery,
  options?: { signal?: AbortSignal },
): Promise<TrashListResult<TrashClientRecord>> {
  const { baseUrl, headers } = getBearerAuthContext();

  try {
    const res = await axios.get(`${baseUrl}/admin/trash/clients`, {
      headers,
      params: toTrashSearchParams(query),
      signal: options?.signal,
    });
    return normalizeTrashClientList(res.data);
  } catch (error) {
    throwTrashError(
      error,
      {
        403: "ნაგვის ყუთზე წვდომა არ გაქვთ",
      },
      "წაშლილი კლიენტების ჩატვირთვა ვერ მოხერხდა.",
    );
  }
}

export async function getAdminTrashPropertyById(
  id: string,
): Promise<TrashPropertyRecord> {
  const { baseUrl, headers } = getBearerAuthContext();

  try {
    const res = await axios.get(`${baseUrl}/admin/trash/properties/${id}`, {
      headers,
    });
    const normalized = normalizeTrashProperty(res.data);
    if (!normalized) {
      throw new Error("განცხადება ვერ მოიძებნა.");
    }
    return normalized;
  } catch (error) {
    throwTrashError(
      error,
      {
        403: "ნაგვის ყუთზე წვდომა არ გაქვთ",
        404: "განცხადება ვერ მოიძებნა.",
      },
      "წაშლილი განცხადების ჩატვირთვა ვერ მოხერხდა.",
    );
  }
}

export async function getAdminTrashClientById(
  id: string,
): Promise<TrashClientRecord> {
  const { baseUrl, headers } = getBearerAuthContext();

  try {
    const res = await axios.get(`${baseUrl}/admin/trash/clients/${id}`, {
      headers,
    });
    const normalized = normalizeTrashClient(res.data);
    if (!normalized) {
      throw new Error("კლიენტი ვერ მოიძებნა.");
    }
    return normalized;
  } catch (error) {
    throwTrashError(
      error,
      {
        403: "ნაგვის ყუთზე წვდომა არ გაქვთ",
        404: "კლიენტი ვერ მოიძებნა.",
      },
      "წაშლილი კლიენტის ჩატვირთვა ვერ მოხერხდა.",
    );
  }
}

export async function restoreAdminTrashProperty(
  id: string,
): Promise<{ archivedAt: string | null }> {
  const { baseUrl, headers } = getBearerAuthContext();

  try {
    const res = await axios.post(
      `${baseUrl}/admin/trash/properties/${id}/restore`,
      {},
      {
        headers: {
          ...headers,
          "Content-Type": "application/json",
        },
      },
    );
    emitRecordMutationEvents();
    return { archivedAt: readArchivedAt(res.data) };
  } catch (error) {
    throwTrashError(
      error,
      {
        403: "ამ განცხადების აღდგენის უფლება არ გაქვთ",
        404: "განცხადება ვერ მოიძებნა.",
      },
      "განცხადების აღდგენა ვერ მოხერხდა.",
    );
  }
}

export async function restoreAdminTrashClient(
  id: string,
): Promise<{ archivedAt: string | null }> {
  const { baseUrl, headers } = getBearerAuthContext();

  try {
    const res = await axios.post(
      `${baseUrl}/admin/trash/clients/${id}/restore`,
      {},
      {
        headers: {
          ...headers,
          "Content-Type": "application/json",
        },
      },
    );
    emitRecordMutationEvents();
    return { archivedAt: readArchivedAt(res.data) };
  } catch (error) {
    throwTrashError(
      error,
      {
        403: "ამ კლიენტის აღდგენის უფლება არ გაქვთ",
        404: "კლიენტი ვერ მოიძებნა.",
      },
      "კლიენტის აღდგენა ვერ მოხერხდა.",
    );
  }
}

export async function permanentlyDeleteAdminTrashProperty(
  id: string,
): Promise<PermanentDeleteResponse> {
  const { baseUrl, headers } = getBearerAuthContext();

  try {
    const res = await axios.delete<PermanentDeleteResponse>(
      `${baseUrl}/admin/trash/properties/${id}/permanent`,
      { headers },
    );
    emitRecordMutationEvents();
    return res.data;
  } catch (error) {
    throwTrashError(
      error,
      {
        403: "სამუდამოდ წაშლის უფლება არ გაქვთ",
        404: "განცხადება ვერ მოიძებნა.",
        409: "ჩანაწერი ჯერ ნაგვის ყუთში უნდა იყოს.",
      },
      "განცხადების სამუდამოდ წაშლა ვერ მოხერხდა.",
    );
  }
}

export async function permanentlyDeleteAdminTrashClient(
  id: string,
): Promise<PermanentDeleteResponse> {
  const { baseUrl, headers } = getBearerAuthContext();

  try {
    const res = await axios.delete<PermanentDeleteResponse>(
      `${baseUrl}/admin/trash/clients/${id}/permanent`,
      { headers },
    );
    emitRecordMutationEvents();
    return res.data;
  } catch (error) {
    throwTrashError(
      error,
      {
        403: "სამუდამოდ წაშლის უფლება არ გაქვთ",
        404: "კლიენტი ვერ მოიძებნა.",
        409: "ჩანაწერი ჯერ ნაგვის ყუთში უნდა იყოს.",
      },
      "კლიენტის სამუდამოდ წაშლა ვერ მოხერხდა.",
    );
  }
}
