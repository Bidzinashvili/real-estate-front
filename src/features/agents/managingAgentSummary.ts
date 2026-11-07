import {
  asNullableString,
  asString,
  isJsonObject,
} from "@/shared/lib/jsonValue";
import type { JsonObject } from "@/shared/lib/jsonValue";

export type ManagingAgentSummary = {
  id: string;
  fullName: string;
  /** Empty when the API does not send contact details (blocked agent, non-admin view). */
  email: string;
  /** Admin restricted this agent's access. Name is masked for non-Active-Admin viewers. */
  blocked?: boolean;
  /** Agent was removed (soft-deleted). Their records are kept. */
  deleted?: boolean;
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
    ...(value.blocked === true ? { blocked: true } : {}),
    ...(value.deleted === true ? { deleted: true } : {}),
  };
}

export function readManagingAgentFromRecord(
  record: JsonObject,
): ManagingAgentSummary | null {
  const nestedKeys = ["managingAgent", "agent", "ownerAgent", "user"] as const;

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
