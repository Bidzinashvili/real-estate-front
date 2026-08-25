import axios from "axios";
import { getBearerAuthContext } from "@/shared/lib/auth";
import { ApiError, parseStandardApiError } from "@/shared/lib/apiError";
import { formatCollaborationApiMessage } from "@/features/collaboration/collaborationLabels";
import type {
  CollaborationAgentOptionsResponse,
  CollaborationListQuery,
  CollaborationListResponse,
  CollaborationMonitorDto,
  CollaborationMonitorListQuery,
  CollaborationMonitorListResponse,
  CollaborationRequestDto,
  CreateCollaborationPayload,
} from "@/features/collaboration/collaborationApi.types";

type RequestOptions = {
  signal?: AbortSignal;
};

function collaborationFallback(status: number, defaultMessage: string): string {
  if (status === 401) {
    return "ავტორიზაცია საჭიროა.";
  }
  if (status === 403) {
    return "ამ მოქმედების უფლება არ გაქვთ.";
  }
  if (status === 404) {
    return "თანამშრომლობის ჩანაწერი ვერ მოიძებნა.";
  }
  if (status === 409) {
    return "მოთხოვნა უკვე დამუშავებულია ან დუბლირდება.";
  }
  return defaultMessage;
}

function throwCollaborationError(error: unknown, defaultMessage: string): never {
  if (axios.isAxiosError(error) && error.code === "ERR_CANCELED") {
    throw error;
  }
  if (axios.isAxiosError(error)) {
    const status = error.response?.status ?? 500;
    const fallback = collaborationFallback(status, defaultMessage);
    const parsed = parseStandardApiError(error.response?.data, status, fallback);
    const rawMessage =
      typeof parsed.message === "string"
        ? parsed.message
        : Array.isArray(parsed.message)
          ? parsed.message[0]
          : fallback;
    const localized = formatCollaborationApiMessage(rawMessage ?? fallback);
    throw new ApiError({ ...parsed, message: localized }, localized);
  }
  throw error;
}

function listParams(query: CollaborationListQuery = {}): Record<string, string | number> {
  const params: Record<string, string | number> = {
    page: query.page ?? 1,
    limit: query.limit ?? 20,
  };
  if (query.status) {
    params.status = query.status;
  }
  if (query.statusGroup) {
    params.statusGroup = query.statusGroup;
  }
  return params;
}

export async function fetchCollaborationAgentOptions(
  search?: string,
  requestOptions?: RequestOptions,
): Promise<CollaborationAgentOptionsResponse> {
  const { baseUrl, headers } = getBearerAuthContext();
  try {
    const response = await axios.get<CollaborationAgentOptionsResponse>(
      `${baseUrl}/collaborations/agent-options`,
      {
        headers,
        params: search?.trim() ? { search: search.trim() } : undefined,
        signal: requestOptions?.signal,
      },
    );
    return response.data;
  } catch (error) {
    throwCollaborationError(error, "აგენტების ჩატვირთვა ვერ მოხერხდა.");
  }
}

export async function createCollaboration(
  payload: CreateCollaborationPayload,
  requestOptions?: RequestOptions,
): Promise<CollaborationRequestDto> {
  const { baseUrl, headers } = getBearerAuthContext();
  try {
    const response = await axios.post<CollaborationRequestDto>(
      `${baseUrl}/collaborations`,
      payload,
      {
        headers: { ...headers, "Content-Type": "application/json" },
        signal: requestOptions?.signal,
      },
    );
    return response.data;
  } catch (error) {
    throwCollaborationError(error, "თანამშრომლობის მოთხოვნა ვერ გაიგზავნა.");
  }
}

export async function fetchCollaborations(
  query: CollaborationListQuery = {},
  requestOptions?: RequestOptions,
): Promise<CollaborationListResponse> {
  const { baseUrl, headers } = getBearerAuthContext();
  try {
    const response = await axios.get<CollaborationListResponse>(`${baseUrl}/collaborations`, {
      headers,
      params: listParams(query),
      signal: requestOptions?.signal,
    });
    return response.data;
  } catch (error) {
    throwCollaborationError(error, "თანამშრომლობის მოთხოვნების ჩატვირთვა ვერ მოხერხდა.");
  }
}

export async function fetchCollaborationById(
  collaborationId: string,
  requestOptions?: RequestOptions,
): Promise<CollaborationRequestDto> {
  const { baseUrl, headers } = getBearerAuthContext();
  try {
    const response = await axios.get<CollaborationRequestDto>(
      `${baseUrl}/collaborations/${collaborationId}`,
      {
        headers,
        signal: requestOptions?.signal,
      },
    );
    return response.data;
  } catch (error) {
    throwCollaborationError(error, "თანამშრომლობის მოთხოვნის ჩატვირთვა ვერ მოხერხდა.");
  }
}

export async function acceptCollaboration(
  collaborationId: string,
  requestOptions?: RequestOptions,
): Promise<CollaborationRequestDto> {
  const { baseUrl, headers } = getBearerAuthContext();
  try {
    const response = await axios.post<CollaborationRequestDto>(
      `${baseUrl}/collaborations/${collaborationId}/accept`,
      {},
      {
        headers,
        signal: requestOptions?.signal,
      },
    );
    return response.data;
  } catch (error) {
    throwCollaborationError(error, "თანამშრომლობის მიღება ვერ მოხერხდა.");
  }
}

export async function rejectCollaboration(
  collaborationId: string,
  requestOptions?: RequestOptions,
): Promise<CollaborationRequestDto> {
  const { baseUrl, headers } = getBearerAuthContext();
  try {
    const response = await axios.post<CollaborationRequestDto>(
      `${baseUrl}/collaborations/${collaborationId}/reject`,
      {},
      {
        headers,
        signal: requestOptions?.signal,
      },
    );
    return response.data;
  } catch (error) {
    throwCollaborationError(error, "თანამშრომლობის უარყოფა ვერ მოხერხდა.");
  }
}

export async function fetchAdminCollaborations(
  query: CollaborationListQuery = {},
  requestOptions?: RequestOptions,
): Promise<CollaborationListResponse> {
  const { baseUrl, headers } = getBearerAuthContext();
  try {
    const response = await axios.get<CollaborationListResponse>(
      `${baseUrl}/admin/collaborations`,
      {
        headers,
        params: listParams(query),
        signal: requestOptions?.signal,
      },
    );
    return response.data;
  } catch (error) {
    throwCollaborationError(error, "თანამშრომლობის მოთხოვნების ჩატვირთვა ვერ მოხერხდა.");
  }
}

export async function fetchAdminCollaborationById(
  collaborationId: string,
  requestOptions?: RequestOptions,
): Promise<CollaborationRequestDto> {
  const { baseUrl, headers } = getBearerAuthContext();
  try {
    const response = await axios.get<CollaborationRequestDto>(
      `${baseUrl}/admin/collaborations/${collaborationId}`,
      {
        headers,
        signal: requestOptions?.signal,
      },
    );
    return response.data;
  } catch (error) {
    throwCollaborationError(error, "თანამშრომლობის მოთხოვნის ჩატვირთვა ვერ მოხერხდა.");
  }
}

export async function approveAdminCollaboration(
  collaborationId: string,
  requestOptions?: RequestOptions,
): Promise<CollaborationRequestDto> {
  const { baseUrl, headers } = getBearerAuthContext();
  try {
    const response = await axios.post<CollaborationRequestDto>(
      `${baseUrl}/admin/collaborations/${collaborationId}/approve`,
      {},
      {
        headers,
        signal: requestOptions?.signal,
      },
    );
    return response.data;
  } catch (error) {
    throwCollaborationError(error, "თანამშრომლობის დამტკიცება ვერ მოხერხდა.");
  }
}

export async function rejectAdminCollaboration(
  collaborationId: string,
  requestOptions?: RequestOptions,
): Promise<CollaborationRequestDto> {
  const { baseUrl, headers } = getBearerAuthContext();
  try {
    const response = await axios.post<CollaborationRequestDto>(
      `${baseUrl}/admin/collaborations/${collaborationId}/reject`,
      {},
      {
        headers,
        signal: requestOptions?.signal,
      },
    );
    return response.data;
  } catch (error) {
    throwCollaborationError(error, "თანამშრომლობის უარყოფა ვერ მოხერხდა.");
  }
}

export async function fetchAdminCollaborationMonitors(
  query: CollaborationMonitorListQuery = {},
  requestOptions?: RequestOptions,
): Promise<CollaborationMonitorListResponse> {
  const { baseUrl, headers } = getBearerAuthContext();
  try {
    const response = await axios.get<CollaborationMonitorListResponse>(
      `${baseUrl}/admin/collaborations/monitors`,
      {
        headers,
        params: {
          page: query.page ?? 1,
          limit: query.limit ?? 20,
        },
        signal: requestOptions?.signal,
      },
    );
    return response.data;
  } catch (error) {
    throwCollaborationError(error, "მონიტორინგის ჩანაწერების ჩატვირთვა ვერ მოხერხდა.");
  }
}

export async function fetchAdminCollaborationMonitorById(
  monitorId: string,
  requestOptions?: RequestOptions,
): Promise<CollaborationMonitorDto> {
  const { baseUrl, headers } = getBearerAuthContext();
  try {
    const response = await axios.get<CollaborationMonitorDto>(
      `${baseUrl}/admin/collaborations/monitors/${monitorId}`,
      {
        headers,
        signal: requestOptions?.signal,
      },
    );
    return response.data;
  } catch (error) {
    throwCollaborationError(error, "მონიტორინგის ჩანაწერის ჩატვირთვა ვერ მოხერხდა.");
  }
}
