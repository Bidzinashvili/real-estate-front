import {
  asNullableString,
  asString,
  isJsonObject,
} from "@/shared/lib/jsonValue";
import type { JsonObject } from "@/shared/lib/jsonValue";

export type ManagingAgentSummary = {
  id: string;
  fullName: string;
  email: string;
};

export function formatManagingAgentDisplayName(
  agent: ManagingAgentSummary | null | undefined,
): string | null {
  if (!agent) {
    return null;
  }
  const fullName = agent.fullName.trim();
  if (fullName) {
    return fullName;
  }
  const email = agent.email.trim();
  if (email) {
    return email;
  }
  return null;
}

export function normalizeManagingAgentSummary(
  value: unknown,
): ManagingAgentSummary | null {
  if (!isJsonObject(value)) {
    return null;
  }

  const agentId = asString(value.id).trim();
  if (!agentId) {
    return null;
  }

  const fullName =
    asString(value.fullName).trim() || asString(value.name).trim();
  const email = asString(value.email).trim();

  return {
    id: agentId,
    fullName,
    email,
  };
}

export function readManagingAgentFromRecord(
  record: JsonObject,
): ManagingAgentSummary | null {
  const nestedKeys = ["agent", "ownerAgent", "user"] as const;

  for (const fieldKey of nestedKeys) {
    if (!Object.prototype.hasOwnProperty.call(record, fieldKey)) {
      continue;
    }
    const normalized = normalizeManagingAgentSummary(record[fieldKey]);
    if (normalized) {
      return normalized;
    }
  }

  return null;
}
