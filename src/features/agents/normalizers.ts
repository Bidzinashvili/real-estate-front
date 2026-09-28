import type { AgentDetails } from "@/features/agents/types";
import {
  asBoolean,
  asNullableString,
  asString,
  isJsonObject,
} from "@/shared/lib/jsonValue";
import type { JsonValue } from "@/shared/lib/jsonValue";

function parseAgentRole(value: JsonValue | undefined): "ADMIN" | "AGENT" {
  const role = asString(value).trim().toUpperCase();
  if (role === "ADMIN") {
    return "ADMIN";
  }
  return "AGENT";
}

export function normalizeAgentDetails(value: unknown): AgentDetails | null {
  if (!isJsonObject(value)) {
    return null;
  }

  const id = asString(value.id).trim();
  if (!id) {
    return null;
  }

  const phoneRaw = asNullableString(value.phone);

  return {
    id,
    fullName: asString(value.fullName).trim(),
    email: asString(value.email).trim(),
    phone: phoneRaw ?? "",
    role: parseAgentRole(value.role),
    createdByAdminId: asNullableString(value.createdByAdminId),
    createdAt: asString(value.createdAt).trim(),
    updatedAt: asString(value.updatedAt).trim(),
    deletedAt: asNullableString(value.deletedAt),
    passwordSet:
      value.passwordSet !== undefined
        ? asBoolean(value.passwordSet)
        : undefined,
  };
}

export function normalizeAgentDetailResponse(value: unknown): AgentDetails | null {
  if (!isJsonObject(value)) {
    return null;
  }

  if (isJsonObject(value.agent)) {
    return normalizeAgentDetails(value.agent);
  }

  return normalizeAgentDetails(value);
}
