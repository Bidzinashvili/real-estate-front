import axios from "axios";
import { getApiBaseUrl, getStoredAuthToken } from "@/shared/lib/auth";
import type {
  Agent,
  AgentDetails,
  AgentsResponse,
  AgentCreatePayload,
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
    throw new Error("API base URL is not configured");
  }

  if (!token) {
    throw new Error("You are not authenticated.");
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
      const fallback = "Could not load agents right now.";
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
      const fallback = "Could not load this agent right now.";
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

export async function createAgent(payload: AgentCreatePayload): Promise<Agent> {
  const { baseUrl, headers } = getAuthHeaders();

  try {
    const res = await axios.post<Agent>(`${baseUrl}/admin/agents`, payload, {
      headers,
    });
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const fallback = "Could not create agent right now.";
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
      const fallback = "Could not save changes for this agent.";
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
      const fallback = "Could not delete this agent right now.";
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
