import axios from "axios";
import { getApiBaseUrl, getStoredAuthToken } from "@/shared/lib/auth";
import type {
  Agent,
  AgentDetails,
  AgentCreatePayload,
  AgentUpdatePayload,
} from "@/features/agents/types";

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

export async function getAgentById(id: string): Promise<AgentDetails> {
  const { baseUrl, headers } = getAuthHeaders();

  try {
    const res = await axios.get<AgentDetails>(`${baseUrl}/admin/agents/${id}`, {
      headers,
    });
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message =
        (error.response?.data as { message?: string } | undefined)?.message ??
        "Could not load this agent right now.";
      throw new Error(message);
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
      const message =
        (error.response?.data as { message?: string } | undefined)?.message ??
        "Could not create agent right now.";
      throw new Error(message);
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
      const message =
        (error.response?.data as { message?: string } | undefined)?.message ??
        "Could not save changes for this agent.";
      throw new Error(message);
    }

    throw error;
  }
}

export async function deleteAgents(ids: string[]): Promise<void> {
  const { baseUrl, headers } = getAuthHeaders();

  try {
    await axios.post(
      `${baseUrl}/admin/agents/deletion`,
      {
        ids,
      },
      { headers },
    );
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message =
        (error.response?.data as { message?: string } | undefined)?.message ??
        "Could not delete this agent right now.";
      throw new Error(message);
    }

    throw error;
  }
}

