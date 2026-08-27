import axios from "axios";
import { getApiBaseUrl, getStoredAuthToken } from "@/shared/lib/auth";
import type {
  Agent,
  AgentDetails,
  AgentsResponse,
  AgentCreatePayload,
  AgentCreateResult,
  AgentUpdatePayload,
} from "@/features/agents/types";
import { ApiError, parseStandardApiError } from "@/shared/lib/apiError";

export type GetAgentsListParams = {
  search?: string;
  sortBy?: "fullName" | "email" | "createdAt";
  order?: "asc" | "desc";
};

function getAuthHeaders() {
  const baseUrl = getApiBaseUrl();
  const token = getStoredAuthToken();

  if (!baseUrl) {
    throw new Error("API მისამართი არ არის კონფიგურირებული");
  }

  if (!token) {
    throw new Error("ავტორიზაცია საჭიროა.");
  }

  return {
    baseUrl,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
}

export async function getAgentsList(
  params: GetAgentsListParams = {},
): Promise<Agent[]> {
  const { baseUrl, headers } = getAuthHeaders();

  try {
    const res = await axios.get<AgentsResponse>(`${baseUrl}/admin/agents`, {
      headers,
      params: {
        search: params.search || undefined,
        sortBy: params.sortBy || undefined,
        order: params.order || undefined,
      },
    });
    return res.data.agents ?? res.data.items ?? [];
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const fallback = "აგენტების ჩატვირთვა ვერ მოხერხდა.";
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

export async function getAgentById(id: string): Promise<AgentDetails> {
  const { baseUrl, headers } = getAuthHeaders();

  try {
    const res = await axios.get<AgentDetails>(`${baseUrl}/admin/agents/${id}`, {
      headers,
    });
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const fallback = "აგენტის ჩატვირთვა ვერ მოხერხდა.";
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

export async function createAgent(payload: AgentCreatePayload): Promise<AgentCreateResult> {
  const { baseUrl, headers } = getAuthHeaders();

  try {
    const res = await axios.post<AgentCreateResult>(`${baseUrl}/admin/agents`, payload, {
      headers,
    });
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const fallback = "აგენტის შექმნა ვერ მოხერხდა.";
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

export async function updateAgent(
  id: string,
  payload: AgentUpdatePayload,
): Promise<AgentDetails> {
  const { baseUrl, headers } = getAuthHeaders();

  try {
    const res = await axios.patch<AgentDetails>(
      `${baseUrl}/admin/agents/${id}`,
      payload,
      {
        headers,
      },
    );
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const fallback = "აგენტის ცვლილებების შენახვა ვერ მოხერხდა.";
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

export async function deleteAgents(
  ids: string[],
): Promise<{ message: string; count: number }> {
  const { baseUrl, headers } = getAuthHeaders();

  try {
    const res = await axios.post<{ message: string; count: number }>(
      `${baseUrl}/admin/agents/deletion`,
      {
        ids,
      },
      { headers },
    );
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const fallback = "აგენტის წაშლა ვერ მოხერხდა.";
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

export async function resendAgentSetupEmail(
  agentId: string,
): Promise<{ message?: string }> {
  const { baseUrl, headers } = getAuthHeaders();

  try {
    const res = await axios.post<{ message?: string }>(
      `${baseUrl}/admin/agents/${agentId}/resend-setup`,
      {},
      { headers },
    );
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const fallback = "პაროლის დაყენების ბმულის გაგზავნა ვერ მოხერხდა.";
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

export async function resetAgentPassword(
  agentId: string,
  newPassword: string,
): Promise<{ message?: string }> {
  const { baseUrl, headers } = getAuthHeaders();

  try {
    const res = await axios.post<{ message?: string }>(
      `${baseUrl}/admin/agents/${agentId}/reset-password`,
      { newPassword },
      { headers },
    );
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const fallback = "პაროლის შეცვლა ვერ მოხერხდა.";
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
