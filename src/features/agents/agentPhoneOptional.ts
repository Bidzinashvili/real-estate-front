import {
  GEORGIAN_AGENT_PHONE_PREFIX,
  normalizeGeorgianAgentPhone,
} from "@/features/agents/normalizeAgentPhone";

/** Phone is optional. Empty or prefix-only ("+995") means: no phone. */
export function hasAgentPhone(raw: string | null | undefined): boolean {
  const trimmed = (raw ?? "").trim();
  if (trimmed === "") return false;
  return normalizeGeorgianAgentPhone(trimmed) !== GEORGIAN_AGENT_PHONE_PREFIX;
}

/** Normalized phone for the API, or undefined to leave it out. */
export function agentPhoneForApi(raw: string | null | undefined): string | undefined {
  return hasAgentPhone(raw) ? normalizeGeorgianAgentPhone((raw ?? "").trim()) : undefined;
}
